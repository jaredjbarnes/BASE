BASE.require([
"BASE.collections.MultiKeyMap",
"BASE.collections.Hashmap",
"BASE.behaviors.NotifyPropertyChange",
"BASE.behaviors.collections.ObservableArray",
"BASE.behaviors.Observable"
], function () {
    BASE.namespace("BASE.data");

    var Hashmap = BASE.collections.Hashmap;
    var MultiKeyMap = BASE.collections.MultiKeyMap;
    var Observable = BASE.behaviors.Observable;

    BASE.data.Orm = function () {
        var self = this;
        BASE.assertNotGlobal(self);

        Observable.call(self);

        var oneToOneRelationships = [];
        var oneToManyRelationships = [];
        var manyToManyRelationships = [];

        var oneToOneObservers = new MultiKeyMap();
        var oneToOneAsTargetObservers = new MultiKeyMap();
        var oneToManyObservers = new MultiKeyMap();
        var oneToManyAsTargetObservers = new MultiKeyMap();
        var manyToManyObservers = new MultiKeyMap();
        var manyToManyAsTargetObservers = new MultiKeyMap();

        var addedEntities = new Hashmap();

        var makeSetter = function (property) {
            return "set" + property.substr(0, 1).toUpperCase() + property.substr(1);
        };

        var getOneToOneRelationships = function (entity) {
            return oneToOneRelationships.filter(function (relationship) {
                if (entity instanceof relationship.type) {
                    return true;
                }
                return false;
            });
        };

        var getOneToOneAsTargetRelationships = function (entity) {
            return oneToOneRelationships.filter(function (relationship) {
                if (entity instanceof relationship.ofType) {
                    return true;
                }
                return false;
            });
        };

        var getOneToManyRelationships = function (entity) {
            return oneToManyRelationships.filter(function (relationship) {
                if (entity instanceof relationship.type) {
                    return true;
                }
                return false;
            });
        };

        var getOneToManyAsTargetRelationships = function (entity) {
            return oneToManyRelationships.filter(function (relationship) {
                if (entity instanceof relationship.ofType) {
                    return true;
                }
                return false;
            });
        };

        var getManyToManyRelationships = function (entity) {
            return manyToManyRelationships.filter(function (relationship) {
                if (entity instanceof relationship.type) {
                    return true;
                }
                return false;
            });
        };

        var getManyToManyAsTargetRelationships = function (entity) {
            return manyToManyRelationships.filter(function (relationship) {
                if (entity instanceof relationship.ofType) {
                    return true;
                }
                return false;
            });
        };

        var observeOneToOne = function (entity) {
            var Type = entity.constructor;

            var relationships = getOneToOneRelationships(entity);
            relationships.forEach(function (relationship) {
                var property = relationship.hasOne;

                var withOneSetter = makeSetter(relationship.withOne);
                var withForeignKeySetter = makeSetter(relationship.withForeignKey);
                var key = relationship.hasKey;

                var action = function (e) {
                    var oldTarget = e.oldValue;
                    var newTarget = e.newValue;
                    self.add(oldTarget);
                    self.add(newTarget);

                    if (oldTarget && oldTarget[relationship.withOne] === entity) {
                        oldTarget[withOneSetter](null);
                        oldTarget[withForeignKeySetter](null);
                    }

                    if (newTarget && newTarget[relationship.withOne] !== entity) {
                        newTarget[withOneSetter](entity);
                    }

                    if (entity[key] === null) {
                        var idObserver = entity.observeProperty(key, function (e) {
                            if (newTarget && entity[property] === newTarget) {
                                newTarget[withForeignKeySetter](e.newValue);
                            }
                            idObserver.dispose();
                        });

                    } else {
                        if (newTarget !== null) {
                            newTarget[withForeignKeySetter](entity[key]);
                        }
                    }

                    self.notify({
                        type: "oneToOneChange",
                        relationship: relationship,
                        source: entity,
                        property: property,
                        oldTarget: oldTarget,
                        newTarget: newTarget
                    });

                    entity.notify({
                        type: "oneToOneChange",
                        relationship: relationship,
                        source: entity,
                        property: property,
                        oldTarget: oldTarget,
                        newTarget: newTarget
                    });

                };

                // Link if there is a entity already there.
                action({
                    oldValue: null,
                    newValue: entity[property]
                });

                var observer = entity.observeProperty(property).onEach(action);
                oneToOneObservers.add(entity, property, observer);
            });

        };

        var observeOneToOneAsTarget = function (entity) {
            var Type = entity.constuctor;
            var relationships = getOneToOneAsTargetRelationships(entity);

            relationships.forEach(function (relationship) {
                var property = relationship.withOne;

                var hasOneSetter = makeSetter(relationship.hasOne);

                var action = function (e) {
                    var oldSource = e.oldValue;
                    var newSource = e.newValue;

                    self.add(oldSource);
                    self.add(newSource);

                    if (oldSource && oldSource[relationship.hasOne] === entity) {
                        oldSource[hasOneSetter](null);
                    }

                    if (newSource && newSource[relationship.hasOne] !== entity) {
                        newSource[hasOneSetter](entity);
                    }

                };
                // Link if there is a entity already there.
                action({
                    oldValue: null,
                    newValue: entity[property]
                });

                var observer = entity.observeProperty(property).onEach(action);
                oneToOneAsTargetObservers.add(entity, property, observer);
            });

        };

        var observeOneToMany = function (entity) {
            var Type = entity.constructor;
            var relationships = getOneToManyRelationships(entity);

            relationships.forEach(function (relationship) {
                var property = relationship.hasMany;

                var withOneSetter = makeSetter(relationship.withOne);
                var withForeignKeySetter = makeSetter(relationship.withForeignKey);
                var key = relationship.hasKey;

                var action = function (e) {
                    var newItems = e.newItems;
                    var oldItems = e.oldItems;

                    newItems.forEach(function (item) {
                        self.add(item);
                        item[withOneSetter](entity);

                        if (entity[key] === null) {
                            var idObserver = entity.observeProperty(key, function (e) {
                                if (item && entity[property].indexOf(item) > -1) {
                                    item[withForeignKeySetter](e.newValue);
                                }
                                idObserver.dispose();
                            });
                        } else {
                            if (item !== null) {
                                item[withForeignKeySetter](entity[key]);
                            }
                        }
                    });

                    oldItems.forEach(function (item) {
                        // Detach from entity if its still bound.
                        if (item[relationship.withOne] === entity) {
                            item[withOneSetter](null);
                            item[withForeignKeySetter](null);
                        }

                    });

                    self.notify({
                        type: "oneToManyChange",
                        relationship: relationship,
                        source: entity,
                        property: property,
                        newItems: newItems,
                        oldItems: oldItems
                    });
                };

                action({
                    oldItems: [],
                    newItems: entity[relationship.hasMany].slice(0)
                });

                BASE.behaviors.collections.ObservableArray.apply(entity[property]);

                var observer = entity[property].observe(action);
                oneToManyObservers.add(entity, property, observer);
            });
        };

        var observeOneToManyAsTarget = function (entity) {
            var Type = entity.constructor;
            var relationships = getOneToManyAsTargetRelationships(entity);

            relationships.forEach(function (relationship) {
                var property = relationship.withOne;

                var action = function (e) {
                    var oldValue = e.oldValue;
                    var newValue = e.newValue;

                    self.add(newValue);

                    if (oldValue) {
                        var index = oldValue[relationship.hasMany].indexOf(entity);
                        if (index > -1) {
                            oldValue[relationship.hasMany].splice(index, 1);
                        }
                    }

                    if (newValue) {
                        var index = newValue[relationship.hasMany].indexOf(entity);
                        if (index === -1) {
                            newValue[relationship.hasMany].push(entity);
                        }
                    }
                };

                var observer = entity.observeProperty(relationship.withOne).onEach(action);
                oneToManyAsTargetObservers.add(entity, property, observer);
            });
        };

        var observeManyToMany = function (entity) {
            var Type = entity.constructor;
            var relationships = getManyToManyRelationships(entity);

            relationships.forEach(function (relationship) {
                var property = relationship.hasMany;

                var action = function (e) {
                    var oldItems = e.oldItems;
                    var newItems = e.newItems;

                    oldItems.forEach(function (target) {
                        var targetArray = target[relationship.withMany];
                        var index = targetArray.indexOf(entity);
                        if (index > -1) {
                            targetArray.splice(index, 1);
                        }
                    });

                    newItems.forEach(function (target) {
                        self.add(target);
                        var targetArray = target[relationship.withMany];
                        var index = targetArray.indexOf(entity);
                        if (index === -1) {
                            targetArray.push(entity);
                        }
                    });

                    self.notify({
                        type: "manyToManyChange",
                        relationship: relationship,
                        source: entity,
                        property: property,
                        newItems: newItems,
                        oldItems: oldItems
                    });

                };

                BASE.behaviors.collections.ObservableArray.apply(entity[property]);
                var observer = entity[property].observe(action);
                manyToManyObservers.add(entity, property, observer);
            });
        };

        var observeManyToManyAsTarget = function (entity) {
            var Type = entity.constructor;
            var relationships = getManyToManyAsTargetRelationships(entity);

            relationships.forEach(function (relationship) {
                var property = relationship.withMany;

                var action = function (e) {
                    var oldItems = e.oldItems;
                    var newItems = e.newItems;

                    oldItems.forEach(function (source) {
                        var sourceArray = source[relationship.hasMany];
                        var index = sourceArray.indexOf(entity);
                        if (index > -1) {
                            sourceArray.splice(index, 1);
                        }
                    });

                    newItems.forEach(function (source) {
                        self.add(source);
                        var sourceArray = source[relationship.hasMany];
                        var index = sourceArray.indexOf(entity);
                        if (index === -1) {
                            sourceArray.push(entity);
                        }
                    });
                };

                BASE.behaviors.collections.ObservableArray.apply(entity[property]);

                var observer = entity[property].observe(action);
                manyToManyAsTargetObservers.add(entity, property, observer);
            });

        };

        var unobserveOneToOne = function (entity) {
            var observers = oneToOneObservers.get(entity);
            if (observers) {
                observers.getValues().forEach(function (observer) {
                    observer.dispose();
                });
            }
        };

        var unobserveOneToOneAsTargets = function (entity) {
            var observers = oneToOneObservers.get(entity);
            if (observers) {
                observers.getValues().forEach(function (observer) {
                    observer.dispose();
                });
            }
        };

        var unobserveOneToMany = function (entity) {
            var observers = oneToOneObservers.get(entity);
            if (observers) {
                observers.getValues().forEach(function (observer) {
                    observer.dispose();
                });
            }
        };

        var unobserveOneToManyAsTargets = function (entity) {
            var observers = oneToOneObservers.get(entity);
            if (observers) {
                observers.getValues().forEach(function (observer) {
                    observer.dispose();
                });
            }
        };

        var unobserveManyToMany = function (entity) {
            var observers = oneToOneObservers.get(entity);
            if (observers) {
                observers.getValues().forEach(function (observer) {
                    observer.dispose();
                });
            }
        };

        var unobserveManyToManyAsTargets = function (entity) {
            var observers = oneToOneObservers.get(entity);
            if (observers) {
                observers.getValues().forEach(function (observer) {
                    observer.dispose();
                });
            }
        };

        self.addOneToOne = function (relationship) {
            oneToOneRelationships.push(relationship);
        };

        self.addOneToMany = function (relationship) {
            oneToManyRelationships.push(relationship);
        };

        self.addManyToMany = function (relationship) {
            manyToManyRelationships.push(relationship);
        };

        self.getOneToOneRelationships = getOneToOneRelationships;
        self.getOneToManyRelationships = getOneToManyRelationships;
        self.getManyToManyRelationships = getManyToManyRelationships;
        self.getOneToOneAsTargetRelationships = getOneToOneAsTargetRelationships;
        self.getOneToManyAsTargetRelationships = getOneToManyAsTargetRelationships;
        self.getManyToManyAsTargetRelationships = getManyToManyAsTargetRelationships;

        self.add = function (entity) {
            if (entity && !addedEntities.hasKey(entity)) {
                addedEntities.add(entity, entity);

                BASE.behaviors.NotifyPropertyChange.apply(entity);

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