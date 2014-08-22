BASE.require([
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
    
    var flattenMultiKeyMap = function (multiKeyMap) {
        var keys = multiKeyMap.getKeys();
        return keys.reduce(function (array, key) {
            return array.concat(multiKeyMap.get(key).getValues());
        }, []);
    }
    
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
        
        var mappingTypes = new MultiKeyMap();
        var mappingEntities = new MultiKeyMap();
        
        var addedEntities = new Hashmap();
        
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
                
                var withOneSetter = relationship.withOne;
                var withForeignKeySetter = relationship.withForeignKey;
                var key = relationship.hasKey;
                
                var action = function (e) {
                    var oldTarget = e.oldValue;
                    var newTarget = e.newValue;
                    self.add(oldTarget);
                    self.add(newTarget);
                    
                    if (oldTarget && oldTarget[relationship.withOne] === entity) {
                        oldTarget[withOneSetter] = null;
                        oldTarget[withForeignKeySetter] = null;
                    }
                    
                    if (newTarget && newTarget[relationship.withOne] !== entity) {
                        newTarget[withOneSetter] = entity;
                    }
                    
                    if (entity[key] === null) {
                        var idObserver = entity.observeProperty(key, function (e) {
                            if (newTarget && entity[property] === newTarget) {
                                newTarget[withForeignKeySetter] = e.newValue;
                            }
                            idObserver.dispose();
                        });

                    } else {
                        if (newTarget !== null) {
                            newTarget[withForeignKeySetter] = entity[key];
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

                };
                
                // Link if there is a entity already there.
                action({
                    oldValue: null,
                    newValue: entity[property]
                });
                
                var observer = entity.observeProperty(property, action);
                oneToOneObservers.add(entity, property, observer);
            });

        };
        
        var observeOneToOneAsTarget = function (entity) {
            var Type = entity.constuctor;
            var relationships = getOneToOneAsTargetRelationships(entity);
            
            relationships.forEach(function (relationship) {
                var property = relationship.withOne;
                
                var hasOneSetter = relationship.hasOne;
                
                var action = function (e) {
                    var oldSource = e.oldValue;
                    var newSource = e.newValue;
                    
                    self.add(oldSource);
                    self.add(newSource);
                    
                    if (oldSource && oldSource[relationship.hasOne] === entity) {
                        oldSource[hasOneSetter] = null;
                    }
                    
                    if (newSource && newSource[relationship.hasOne] !== entity) {
                        newSource[hasOneSetter] = entity;
                    }

                };
                // Link if there is a entity already there.
                action({
                    oldValue: null,
                    newValue: entity[property]
                });
                
                var observer = entity.observeProperty(property, action);
                oneToOneAsTargetObservers.add(entity, property, observer);
            });

        };
        
        var observeOneToMany = function (entity) {
            var Type = entity.constructor;
            var relationships = getOneToManyRelationships(entity);
            
            relationships.forEach(function (relationship) {
                var property = relationship.hasMany;
                
                var withOneSetter = relationship.withOne;
                var withForeignKeySetter = relationship.withForeignKey;
                var key = relationship.hasKey;
                
                var action = function (e) {
                    var newItems = e.newItems;
                    var oldItems = e.oldItems;
                    
                    newItems.forEach(function (item) {
                        self.add(item);
                        item[withOneSetter] = entity;
                        
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
                        if (item[relationship.withOne] === entity) {
                            item[withOneSetter] = null;
                            item[withForeignKeySetter] = null;
                        }
                        self.remove(item);
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
                    newItems: entity[property].slice(0)
                });
                
                BASE.collections.ObservableArray.apply(entity[property]);
                
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
                        self.remove(entity);
                    }
                    
                    if (newValue) {
                        var index = newValue[relationship.hasMany].indexOf(entity);
                        if (index === -1) {
                            newValue[relationship.hasMany].push(entity);
                        }
                    }
                };
                
                action({
                    oldValue: null,
                    newValue: entity[property]
                });
                
                var observer = entity.observeProperty(property, action);
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
                        
                        var mappingEntity = mappingEntities.remove(entity, target);
                        var MappingEntity;
                        
                        if (mappingEntity === null) {
                            MappingEntity = mappingTypes.get(relationship.type, relationship.ofType);
                            mappingEntity = new MappingEntity();
                            mappingEntity.source = entity;
                            mappingEntity.target = target;
                            mappingEntity.relationship = relationship;
                        }
                        
                        self.remove(mappingEntity);
                    });
                    
                    newItems.forEach(function (target) {
                        self.add(target);
                        var targetArray = target[relationship.withMany];
                        var index = targetArray.indexOf(entity);
                        if (index === -1) {
                            targetArray.push(entity);
                        }
                        
                        var mappingEntity = mappingEntities.get(entity, target);
                        var MappingEntity;
                        
                        if (mappingEntity === null) {
                            MappingEntity = mappingTypes.get(relationship.type, relationship.ofType);
                            mappingEntity = new MappingEntity();
                            mappingEntity.source = entity;
                            mappingEntity.target = target;
                            mappingEntity.relationship = relationship;
                            
                            mappingEntities.add(entity, target, mappingEntity);
                        }
                        
                        self.add(mappingEntity);

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
                
                action({
                    oldItems: [],
                    newItems: entity[property].slice(0)
                });
                
                BASE.collections.ObservableArray.apply(entity[property]);
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
                        
                        var mappingEntity = mappingEntities.remove(source, entity);
                        var MappingEntity;
                        
                        if (mappingEntity === null) {
                            MappingEntity = mappingTypes.get(relationship.type, relationship.ofType);
                            mappingEntity = new MappingEntity();
                            mappingEntity.source = source;
                            mappingEntity.target = entity;
                            mappingEntity.relationship = relationship;
                        }
                        
                        self.remove(mappingEntity);
                    });
                    
                    newItems.forEach(function (source) {
                        self.add(source);
                        var sourceArray = source[relationship.hasMany];
                        var index = sourceArray.indexOf(entity);
                        
                        if (index === -1) {
                            sourceArray.push(entity);
                        }
                        
                        var mappingEntity = mappingEntities.get(source, entity);
                        var MappingEntity;
                        
                        if (mappingEntity === null) {
                            MappingEntity = mappingTypes.get(relationship.type, relationship.ofType);
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
        
        var dismantleRelationships = function (entity) {
            var oneToOne = getOneToOneRelationships(entity);
            var oneToOneAsTarget = getOneToOneAsTargetRelationships(entity);
            var oneToMany = getOneToManyRelationships(entity);
            var oneToManyAsTarget = getOneToManyAsTargetRelationships(entity);
            var manyToMany = getManyToManyRelationships(entity);
            var manyToManyAsTarget = getManyToManyAsTargetRelationships(entity);
            
            oneToOne.forEach(function (relationship) {
                entity[relationship.hasOne] = null;
            });
            
            oneToOneAsTarget.forEach(function (relationship) {
                entity[relationship.withOne] = null;
            });
            
            oneToMany.forEach(function (relationship) {
                entity[relationship.hasMany].splice(0, entity[relationship.hasMany].length);
            });
            
            oneToManyAsTarget.forEach(function (relationship) {
                entity[relationship.withOne] = null;
            });
            
            manyToMany.forEach(function (relationship) {
                entity[relationship.hasMany].splice(0, entity[relationship.hasMany].length);
            });
            
            manyToManyAsTarget.forEach(function (relationship) {
                entity[relationship.withMany].splice(0, entity[relationship.withMany].length);
            });
        };
        
        self.addOneToOne = function (relationship) {
            oneToOneRelationships.push(relationship);
        };
        
        self.addOneToMany = function (relationship) {
            oneToManyRelationships.push(relationship);
        };
        
        self.addManyToMany = function (relationship) {
            if (!relationship.usingMappingType) {
                throw new Error("Many to many relationship needs to supply the mapping Type.");
            } else {
                mappingTypes.add(relationship.type, relationship.ofType, relationship.usingMappingType);
                manyToManyRelationships.push(relationship);
            }
        };
        
        self.getOneToOneRelationships = getOneToOneRelationships;
        self.getOneToManyRelationships = getOneToManyRelationships;
        self.getManyToManyRelationships = getManyToManyRelationships;
        self.getOneToOneAsTargetRelationships = getOneToOneAsTargetRelationships;
        self.getOneToManyAsTargetRelationships = getOneToManyAsTargetRelationships;
        self.getManyToManyAsTargetRelationships = getManyToManyAsTargetRelationships;
        
        self.getMappingTypes = function () {
            var array = flattenMultiKeyMap(mappingTypes);
            var hashmap = new Hashmap();
            array.forEach(function (Type) {
                hashmap.add(Type, Type);
            });
            return hashmap;
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
                
                unobserveOneToOne(entity);
                unobserveOneToOneAsTargets(entity);
                unobserveOneToMany(entity);
                unobserveOneToManyAsTargets(entity);
                unobserveManyToMany(entity);
                unobserveManyToManyAsTargets(entity);
                
                dismantleRelationships(entity);
                
                self.notify({
                    type: "entityRemoved",
                    entity: entity
                });
            }

        };

    };

});