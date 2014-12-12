BASE.require([
    "BASE.data.Edm",
    "BASE.collections.MultiKeyMap",
    "BASE.collections.Hashmap",
    "BASE.util.PropertyBehavior",
    "BASE.collections.ObservableArray",
    "BASE.util.Observable"
], function () {
    BASE.namespace("BASE.data");

    var Hashmap = BASE.collections.Hashmap;
    var MultiKeyMap = BASE.collections.MultiKeyMap;
    var Observable = BASE.util.Observable;
    var Edm = BASE.data.Edm;

    var flattenMultiKeyMap = function (multiKeyMap) {
        var keys = multiKeyMap.getKeys();
        return keys.reduce(function (array, key) {
            return array.concat(multiKeyMap.get(key).getValues());
        }, []);
    }

    BASE.data.Orm = function (edm) {
        var self = this;
        BASE.assertNotGlobal(self);

        if (typeof edm === "undefined" || !(edm instanceof Edm)) {
            throw new Error("Orm must have an edm.");
        }

        Observable.call(self);

        var oneToOneObservers = new MultiKeyMap();
        var oneToOneAsTargetObservers = new MultiKeyMap();
        var oneToManyObservers = new MultiKeyMap();
        var oneToManyAsTargetObservers = new MultiKeyMap();
        var manyToManyObservers = new MultiKeyMap();
        var manyToManyAsTargetObservers = new MultiKeyMap();

        var mappingRelationships = new Hashmap();
        var addedEntities = new Hashmap();

        var getOneToOneRelationships = edm.getOneToOneRelationships;
        var getOneToManyRelationships = edm.getOneToManyRelationships;
        var getManyToManyRelationships = edm.getManyToManyRelationships;
        var getOneToOneAsTargetRelationships = edm.getOneToOneAsTargetRelationships;
        var getOneToManyAsTargetRelationships = edm.getOneToManyAsTargetRelationships;
        var getManyToManyAsTargetRelationships = edm.getManyToManyAsTargetRelationships;

        var getMappingEntities = function (relationship) {
            var mappingEntities = mappingRelationships.get(relationship);
            if (mappingEntities === null) {
                mappingEntities = new MultiKeyMap();
                mappingRelationships.add(relationship, mappingEntities);
            }
            return mappingEntities;
        };

        var assertProperty = function (entity, property) {
            if (typeof entity[property] === "undefined") {
                throw new Error("Couldn't find property \"" + property + "\" on entity: " + entity.constructor.toString());
            }
        };

        var observeOneToOne = function (entity) {
            var Type = entity.constructor;

            var relationships = getOneToOneRelationships(entity);
            relationships.forEach(function (relationship) {
                var property = relationship.hasOne;

                if (typeof property !== "undefined") {

                    assertProperty(entity, property);

                    var withOneSetter = relationship.withOne;
                    var withForeignKeySetter = relationship.withForeignKey;
                    var key = relationship.hasKey;

                    var action = function (e) {
                        var oldTarget = e.oldValue;
                        var newTarget = e.newValue;
                        //self.add(oldTarget);
                        self.add(newTarget);

                        if (typeof withOneSetter !== "undefined") {
                            if (oldTarget && oldTarget[relationship.withForeignKey] === entity[relationship.hasKey]) {
                                oldTarget[withOneSetter] = null;
                                var primaryKeyHash = edm.getPrimaryKeyProperties(relationship.ofType).reduce(function (hash, name) {
                                    hash[name] = true;
                                    return hash;
                                }, {});

                                if (!primaryKeyHash[withForeignKeySetter]) {
                                    oldTarget[withForeignKeySetter] = null;
                                }

                                if (relationship.optional !== true) {
                                    self.remove(oldTarget);
                                }
                            }

                            if (newTarget && newTarget[relationship.withOne] !== entity) {
                                newTarget[withOneSetter] = entity;
                            }
                        }

                        if (entity[key] === null) {
                            var idObserver = entity.observeProperty(key, function (e) {
                                if (entity[property] !== null) {
                                    entity[property][withForeignKeySetter] = e.newValue;
                                }
                                idObserver.dispose();
                            });

                        } else {
                            if (newTarget !== null) {
                                newTarget[withForeignKeySetter] = entity[key];
                            }
                        }

                    };

                    // Link if there is a entity already there.
                    action({
                        oldValue: null,
                        newValue: entity[property]
                    });


                    var observer = entity.observeProperty(property, action);
                    oneToOneObservers.add(entity, property, observer);
                }
            });

        };

        var observeOneToOneAsTarget = function (entity) {
            var Type = entity.constuctor;
            var relationships = getOneToOneAsTargetRelationships(entity);

            relationships.forEach(function (relationship) {
                var property = relationship.withOne;

                if (typeof property !== "undefined") {
                    assertProperty(entity, property);

                    var hasOneSetter = relationship.hasOne;

                    var action = function (e) {
                        var oldSource = e.oldValue;
                        var newSource = e.newValue;

                        //self.add(oldSource);
                        self.add(newSource);

                        if (typeof hasOneSetter !== "undefined") {
                            if (oldSource && oldSource[relationship.hasOne] === entity) {
                                oldSource[hasOneSetter] = null;
                            }

                            if (newSource && newSource[relationship.hasOne] !== entity) {
                                newSource[hasOneSetter] = entity;
                            }
                        }
                    };
                    // Link if there is a entity already there.
                    action({
                        oldValue: null,
                        newValue: entity[property],
                        isSetUp: true
                    });

                    var observer = entity.observeProperty(property, action);
                    oneToOneAsTargetObservers.add(entity, property, observer);
                }
            });

        };

        var observeOneToMany = function (entity) {
            var Type = entity.constructor;
            var relationships = getOneToManyRelationships(entity);

            relationships.forEach(function (relationship) {
                var property = relationship.hasMany;

                if (typeof property !== "undefined") {
                    assertProperty(entity, property);

                    var withOneSetter = relationship.withOne;
                    var withForeignKeySetter = relationship.withForeignKey;
                    var key = relationship.hasKey;

                    var action = function (e) {
                        var newItems = e.newItems;
                        var oldItems = e.oldItems;

                        newItems.forEach(function (item) {
                            self.add(item);
                            if (typeof withOneSetter !== "undefined") {
                                item[withOneSetter] = entity;
                            }

                            if (entity[key] === null) {
                                var idObserver = entity.observeProperty(key, function (e) {
                                    if (item && entity[property].indexOf(item) > -1) {
                                        item[withForeignKeySetter] = e.newValue;
                                    }
                                    idObserver.dispose();
                                });
                            } else {
                                if (item !== null) {
                                    item[withForeignKeySetter] = entity[key];
                                }
                            }
                        });

                        oldItems.forEach(function (item) {
                            // Detach from entity if its still bound.
                            if (item[relationship.withForeignKey] === entity[relationship.hasKey]) {
                                if (typeof withOneSetter !== "undefined") {
                                    item[withOneSetter] = null;
                                }
                                item[withForeignKeySetter] = null;

                                if (relationship.optional !== true) {
                                    self.remove(item);
                                }
                            }

                        });

                    };

                    action({
                        oldItems: [],
                        newItems: entity[property].slice(0)
                    });

                    BASE.collections.ObservableArray.apply(entity[property]);

                    var observer = entity[property].observe(action);
                    oneToManyObservers.add(entity, property, observer);
                }
            });
        };

        var observeOneToManyAsTarget = function (entity) {
            var Type = entity.constructor;
            var relationships = getOneToManyAsTargetRelationships(entity);

            relationships.forEach(function (relationship) {
                var property = relationship.withOne;

                if (typeof property !== "undefined") {
                    assertProperty(entity, property);

                    var action = function (e) {
                        var oldValue = e.oldValue;
                        var newValue = e.newValue;

                        self.add(newValue);

                        if (typeof relationship.hasMany !== "undefined") {

                            if (oldValue) {
                                if (relationship.optional === true) {
                                    oldValue[relationship.hasMany].unload(entity);
                                } else {
                                    oldValue[relationship.hasMany].remove(entity);
                                }
                            }

                            if (newValue) {
                                var index = newValue[relationship.hasMany].indexOf(entity);
                                if (index === -1) {
                                    newValue[relationship.hasMany].push(entity);
                                }
                            }

                        }
                    };

                    action({
                        oldValue: null,
                        newValue: entity[property]
                    });

                    var observer = entity.observeProperty(property, action);
                    oneToManyAsTargetObservers.add(entity, property, observer);
                }
            });
        };

        var observeManyToMany = function (entity) {
            var Type = entity.constructor;
            var relationships = getManyToManyRelationships(entity);

            relationships.forEach(function (relationship) {
                var property = relationship.hasMany;
                if (typeof property !== "undefined") {

                    assertProperty(entity, property);

                    var action = function (e) {
                        var oldItems = e.oldItems;
                        var newItems = e.newItems;

                        var mappingEntities = getMappingEntities(relationship);

                        oldItems.forEach(function (target) {

                            if (typeof relationship.withMany !== "undefined") {
                                var targetArray = target[relationship.withMany];
                                targetArray.unload(entity);
                            }

                            var mappingEntity = mappingEntities.remove(entity, target);
                            var MappingEntity;

                            if (mappingEntity === null) {
                                MappingEntity = relationship.usingMappingType;
                                mappingEntity = new MappingEntity();
                                mappingEntity.source = entity;
                                mappingEntity.target = target;
                                mappingEntity.relationship = relationship;
                            }

                            self.notify({
                                type: "entityRemoved",
                                entity: mappingEntity
                            });
                        });

                        newItems.forEach(function (target) {
                            self.add(target);

                            if (typeof relationship.withMany !== "undefined") {
                                var targetArray = target[relationship.withMany];
                                var index = targetArray.indexOf(entity);

                                if (index === -1) {
                                    targetArray.push(entity);
                                }
                            }

                            var mappingEntity = mappingEntities.get(entity, target);
                            var MappingEntity;

                            if (mappingEntity === null) {
                                MappingEntity = relationship.usingMappingType;
                                mappingEntity = new MappingEntity();
                                mappingEntity.source = entity;
                                mappingEntity.target = target;
                                mappingEntity.relationship = relationship;

                                mappingEntities.add(entity, target, mappingEntity);
                            }

                            self.add(mappingEntity);

                        });

                    };

                    action({
                        oldItems: [],
                        newItems: entity[property].slice(0)
                    });

                    BASE.collections.ObservableArray.apply(entity[property]);
                    var observer = entity[property].observe(action);
                    manyToManyObservers.add(entity, property, observer);
                }
            });
        };

        var observeManyToManyAsTarget = function (entity) {
            var Type = entity.constructor;
            var relationships = getManyToManyAsTargetRelationships(entity);

            relationships.forEach(function (relationship) {
                var property = relationship.withMany;
                if (typeof property !== "undefined") {

                    assertProperty(entity, property);

                    var action = function (e) {
                        var oldItems = e.oldItems;
                        var newItems = e.newItems;

                        var mappingEntities = getMappingEntities(relationship);

                        oldItems.forEach(function (source) {

                            if (typeof relationship.hasMany !== "undefined") {
                                var sourceArray = source[relationship.hasMany];
                                sourceArray.unload(entity);
                            }

                            var mappingEntity = mappingEntities.remove(source, entity);
                            var MappingEntity;

                            if (mappingEntity === null) {
                                MappingEntity = relationship.usingMappingType;
                                mappingEntity = new MappingEntity();
                                mappingEntity.source = source;
                                mappingEntity.target = entity;
                                mappingEntity.relationship = relationship;
                            }

                            self.notify({
                                type: "entityRemoved",
                                entity: mappingEntity
                            });

                        });

                        newItems.forEach(function (source) {
                            self.add(source);

                            if (typeof relationship.hasMany !== "undefined") {
                                var sourceArray = source[relationship.hasMany];
                                var index = sourceArray.indexOf(entity);

                                if (index === -1) {
                                    sourceArray.push(entity);
                                }
                            }

                            var mappingEntity = mappingEntities.get(source, entity);
                            var MappingEntity;

                            if (mappingEntity === null) {
                                MappingEntity = relationship.usingMappingType;
                                mappingEntity = new MappingEntity();
                                mappingEntity.source = source;
                                mappingEntity.target = entity;
                                mappingEntity.relationship = relationship;

                                mappingEntities.add(source, entity, mappingEntity);
                            }

                            self.add(mappingEntity);

                        });
                    };

                    action({
                        oldItems: [],
                        newItems: entity[property].slice(0)
                    });

                    BASE.collections.ObservableArray.apply(entity[property]);

                    var observer = entity[property].observe(action);
                    manyToManyAsTargetObservers.add(entity, property, observer);
                }
            });

        };

        var unobserveOneToOne = function (entity) {
            var observers = oneToOneObservers.remove(entity);
            if (observers) {
                observers.getValues().forEach(function (observer) {
                    observer.dispose();
                });
            }
        };

        var unobserveOneToOneAsTargets = function (entity) {
            var observers = oneToOneAsTargetObservers.remove(entity);
            if (observers) {
                observers.getValues().forEach(function (observer) {
                    observer.dispose();
                });
            }
        };

        var unobserveOneToMany = function (entity) {
            var observers = oneToManyObservers.remove(entity);
            if (observers) {
                observers.getValues().forEach(function (observer) {
                    observer.dispose();
                });
            }
        };

        var unobserveOneToManyAsTargets = function (entity) {
            var observers = oneToManyAsTargetObservers.remove(entity);
            if (observers) {
                observers.getValues().forEach(function (observer) {
                    observer.dispose();
                });
            }
        };

        var unobserveManyToMany = function (entity) {
            var observers = manyToManyObservers.remove(entity);
            if (observers) {
                observers.getValues().forEach(function (observer) {
                    observer.dispose();
                });
            }
        };

        var unobserveManyToManyAsTargets = function (entity) {
            var observers = manyToManyAsTargetObservers.remove(entity);
            if (observers) {
                observers.getValues().forEach(function (observer) {
                    observer.dispose();
                });
            }
        };

        var dismantleRelationships = function (entity) {
            var oneToOne = getOneToOneRelationships(entity);
            var oneToOneAsTarget = getOneToOneAsTargetRelationships(entity);
            var oneToMany = getOneToManyRelationships(entity);
            var oneToManyAsTarget = getOneToManyAsTargetRelationships(entity);
            var manyToMany = getManyToManyRelationships(entity);
            var manyToManyAsTarget = getManyToManyAsTargetRelationships(entity);

            oneToOne.forEach(function (relationship) {
                if (typeof relationship.hasOne !== "undefined") {
                    entity[relationship.hasOne] = null;
                }
            });

            oneToOneAsTarget.forEach(function (relationship) {
                if (typeof relationship.withOne !== "undefined") {
                    entity[relationship.withOne] = null;
                }
            });

            oneToMany.forEach(function (relationship) {
                if (typeof relationship.hasMany !== "undefined") {
                    entity[relationship.hasMany].splice(0, entity[relationship.hasMany].length);
                }
            });

            oneToManyAsTarget.forEach(function (relationship) {
                if (typeof relationship.withOne !== "undefined") {
                    entity[relationship.withOne] = null;
                }
            });

            manyToMany.forEach(function (relationship) {
                if (typeof relationship.hasMany !== "undefined") {
                    entity[relationship.hasMany].splice(0, entity[relationship.hasMany].length);
                }
            });

            manyToManyAsTarget.forEach(function (relationship) {
                if (typeof relationship.withMany !== "undefined") {
                    entity[relationship.withMany].splice(0, entity[relationship.withMany].length);
                }
            });
        };

        self.add = function (entity) {
            if (entity && !addedEntities.hasKey(entity)) {
                addedEntities.add(entity, entity);

                BASE.util.PropertyBehavior.apply(entity);

                observeOneToOne(entity);
                observeOneToOneAsTarget(entity);
                observeOneToMany(entity);
                observeOneToManyAsTarget(entity);
                observeManyToMany(entity);
                observeManyToManyAsTarget(entity);

                self.notify({
                    type: "entityAdded",
                    entity: entity
                });
            }
        };

        self.remove = function (entity) {
            if (entity && addedEntities.hasKey(entity)) {
                addedEntities.remove(entity);

                dismantleRelationships(entity);

                unobserveOneToOne(entity);
                unobserveOneToOneAsTargets(entity);
                unobserveOneToMany(entity);
                unobserveOneToManyAsTargets(entity);
                unobserveManyToMany(entity);
                unobserveManyToManyAsTargets(entity);

                self.notify({
                    type: "entityRemoved",
                    entity: entity
                });
            }
        };
    };

});