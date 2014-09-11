BASE.require([
    "Array.prototype.asQueryable",
    "BASE.data.ChangeTracker",
    "BASE.data.Orm",
    "BASE.data.DataSet",
    "BASE.data.Entity",
    "BASE.collections.Hashmap",
    "BASE.collections.MultiKeyMap",
    "BASE.query.Provider",
    "BASE.query.Queryable",
    "BASE.data.utils",
    "Date.fromISO"
], function () {
    
    BASE.namespace("BASE.data");
    
    var Orm = BASE.data.Orm;
    var Entity = BASE.data.Entity;
    var DataSet = BASE.data.DataSet;
    var ChangeTracker = BASE.data.ChangeTracker;
    var Hashmap = BASE.collections.Hashmap;
    var MultiKeyMap = BASE.collections.MultiKeyMap;
    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Queryable = BASE.query.Queryable;
    var Provider = BASE.query.Provider;
    
    var isPrimitive = BASE.data.utils.isPrimitive;
    
    var flattenMultiKeyMap = function (multiKeyMap) {
        var keys = multiKeyMap.getKeys();
        return keys.reduce(function (array, key) {
            return array.concat(multiKeyMap.get(key).getValues());
        }, []);
    }
    
    var getValue = function (value) {
        var returnValue = value;
        
        var dateRegex = /\d{4}-\d{2}-\d{2}/;
        if (dateRegex.test(value)) {
            returnValue = Date.fromISO(value);
        }
        
        return returnValue;
    };
    
    BASE.data.DataContext = function (service, edm) {
        var self = this;
        BASE.assertNotGlobal(self);
        
        if (typeof service === "undefined") {
            throw new Error("Data Context needs to have a service.");
        }
        
        var dataContext = self;
        var orm = new Orm(edm);
        
        var changeTrackersHash = new Hashmap();
        var loadedBucket = new MultiKeyMap();
        var addedBucket = new MultiKeyMap();
        var updatedBucket = new MultiKeyMap();
        var removedBucket = new MultiKeyMap();
        
        var removeEntityFromBuckets = function (entity) {
            addedBucket.remove(entity.constructor, entity);
            updatedBucket.remove(entity.constructor, entity);
            removedBucket.remove(entity.constructor, entity);
            loadedBucket.remove(entity.constructor, getUniqueValue(entity));
        };
        
        var saveEntity = function (entity) {
            return new Future(function (setValue, setError) {
                var task = new Task();
                
                var oneToOne = edm.getOneToOneAsTargetRelationships(entity);
                var oneToMany = edm.getOneToManyAsTargetRelationships(entity);
                var dependencies = oneToOne.concat(oneToMany);
                
                dependencies.forEach(function (relationship) {
                    var property = relationship.withOne;
                    var source = entity[property];
                    if (source) {
                        task.add(self.saveEntity(source));
                    }
                });
                
                task.start().whenAll(function (futures) {
                    changeTrackersHash.get(entity).save().then(setValue).ifError(setError);
                });

            }).then();
        };
        
        var createSourcesOneToOneProvider = function (entity, relationship) {
            entity.registerProvider(relationship.hasOne, function (entity, property) {
                return new Future(function (setValue, setError) {
                    service.getSourcesOneToOneTargetEntity(entity, relationship).then(function (target) {
                        var loadedTarget = loadEntity(relationship.ofType, target);
                        entity[property] = loadedTarget;
                        setValue(loadedTarget);
                    });
                });
            });

        };
        
        var createTargetsOneToOneProvider = function (entity, relationship) {
            entity.registerProvider(relationship.withOne, function (entity, property) {
                return new Future(function (setValue, setError) {
                    service.getTargetsOneToOneSourceEntity(entity, relationship).then(function (source) {
                        var loadedSource = loadEntity(relationship.type, source);
                        entity[property] = loadedSource;
                        setValue(loadedSource);
                    });
                });
            });
        };
        
        var createTargetsOneToManyProvider = function (entity, relationship) {
            entity.registerProvider(relationship.withOne, function (entity, property) {
                return new Future(function (setValue, setError) {
                    service.getTargetsOneToManySourceEntity(entity, relationship).then(function (source) {
                        var loadedSource = loadEntity(relationship.type, source);
                        entity[property] = loadedSource;
                        setValue(loadedSource);
                    });
                });
            });
        };
        
        var createOneToManyProvider = function (entity, fillArray, relationship) {
            var provider = new Provider();
            provider.toArray = provider.execute = function (queryable) {
                
                return new Future(function (setValue, setError) {
                    
                    var provider = service.getSourcesOneToManyQueryProvider(entity, relationship);
                    var queryableCopy = queryable.copy();
                    queryableCopy.provider = provider;
                    
                    if (provider === null) {
                        throw new Error("Couldn't find a provider for type.");
                    }
                    
                    queryableCopy.toArray(function (dtos) {
                        
                        var entities = loadEntities(relationship.ofType, dtos);
                        
                        entities.forEach(function (entity) {
                            if (fillArray.indexOf(entity) === -1) {
                                fillArray.load(entity);
                            }
                        });
                        
                        setValue(entities);

                    }).ifError(setError);

                });
            };
            return provider;
        };
        
        var createManyToManyProvider = function (entity, fillArray, relationship) {
            
            var provider = new Provider();
            provider.toArray = provider.execute = function (queryable) {
                
                return new Future(function (setValue, setError) {
                    var provider = service.getSourcesManyToManyQueryProvider(entity, relationship);
                    var queryableCopy = queryable.copy();
                    queryableCopy.provider = provider;
                    
                    if (provider === null) {
                        throw new Error("Couldn't find provider for type.");
                    }
                    
                    queryableCopy.toArray(function (dtos) {
                        
                        var entities = loadEntities(relationship.ofType, dtos);
                        
                        entities.forEach(function (entity) {
                            if (fillArray.indexOf(entity) === -1) {
                                fillArray.load(entity);
                            }
                        });
                        
                        setValue(entities);

                    }).ifError(setError);

                });
            };
            return provider;

        };
        
        var createManyToManyAsTargetProvider = function (entity, fillArray, relationship) {
            
            var provider = new Provider();
            provider.toArray = provider.execute = function (queryable) {
                
                return new Future(function (setValue, setError) {
                    var provider = service.getTargetsManyToManyQueryProvider(entity, relationship);
                    var queryableCopy = queryable.copy();
                    queryableCopy.provider = provider;
                    
                    if (provider === null) {
                        throw new Error("Couldn't find provider for type.");
                    }
                    
                    queryableCopy.toArray(function (dtos) {
                        
                        var entities = loadEntities(relationship.type, dtos);
                        
                        entities.forEach(function (entity) {
                            if (fillArray.indexOf(entity) === -1) {
                                fillArray.load(entity);
                            }
                        });
                        
                        setValue(entities);

                    }).ifError(setError);
                });
            };
            return provider;

        };
        
        var addOneToOneProviders = function (entity) {
            var oneToOneRelationships = edm.getOneToOneRelationships(entity);
            var oneToOneAsTargetsRelationships = edm.getOneToOneAsTargetRelationships(entity);
            
            oneToOneRelationships.forEach(function (relationship) {
                createSourcesOneToOneProvider(entity, relationship);
            });
            
            oneToOneAsTargetsRelationships.forEach(function (relationship) {
                createTargetsOneToOneProvider(entity, relationship);
            });
        };
        
        var addOneToManyProviders = function (entity) {
            var oneToManyRelationships = edm.getOneToManyRelationships(entity);
            var oneToManyAsTargetsRelationships = edm.getOneToManyAsTargetRelationships(entity);
            
            oneToManyRelationships.forEach(function (relationship) {
                var property = relationship.hasMany;
                var provider = createOneToManyProvider(entity, entity[property], relationship);
                
                entity[property].getProvider = function () { return provider; };
            });
            
            oneToManyAsTargetsRelationships.forEach(function (relationship) {
                createTargetsOneToManyProvider(entity, relationship);
            });
        };
        
        var addManyToManyProviders = function (entity) {
            var sourceRelationships = edm.getManyToManyRelationships(entity);
            var targetRelationships = edm.getManyToManyAsTargetRelationships(entity);
            
            sourceRelationships.forEach(function (relationship) {
                var property = relationship.hasMany;
                var provider = createManyToManyProvider(entity, entity[property], relationship);
                
                entity[property].getProvider = function () { return provider; };
            });
            
            targetRelationships.forEach(function (relationship) {
                var property = relationship.withMany;
                var provider = createManyToManyAsTargetProvider(entity, entity[property], relationship);
                
                entity[property].getProvider = function () { return provider; };
            });
        };
        
        
        var getUniqueValue = function (entity) {
            var uniqueKey = {};
            var properties = edm.getPrimaryKeyProperties(entity.constructor);
            
            properties.forEach(function (key) {
                uniqueKey[key] = entity[key];
            });
            
            return JSON.stringify(uniqueKey);
        };
        
        var setUpEntity = function (entity) {
            addOneToOneProviders(entity);
            addOneToManyProviders(entity);
            addManyToManyProviders(entity);
        };
        
        var loadEntity = function (Type, dto) {
            var entity = loadedBucket.get(Type, getUniqueValue(dto));
            if (entity === null) {
                entity = new Type();
                
                Object.keys(dto).forEach(function (key) {
                    if (isPrimitive(dto[key])) {
                        entity[key] = getValue(dto[key]);
                    }
                });
                
                loadedBucket.add(Type, getUniqueValue(entity), entity);
                
                self.addEntity(entity);
            }
            return entity;
        };
        
        var loadEntities = function (Type, dtos) {
            var entities = [];
            dtos.forEach(function (dto) {
                entities.push(loadEntity(Type, dto));
            });
            
            return entities;
        };
        
        self.loadEntity = function (entity) {
            return loadEntity(entity.constructor, entity);
        };
        
        self.addEntity = function (entity) {
            orm.add(entity);
        };
        
        self.removeEntity = function (entity) {
            orm.remove(entity);
        };
        
        self.syncEntity = function (entity, dto) {
            var changeTracker = changeTrackersHash.get(entity);
            if (changeTracker !== null) {
                changeTracker.sync(dto);
            } else {
                throw new Error("Entity isn't part of the data context.");
            }
        };
        
        self.saveEntity = function (entity) {
            var changeTracker = changeTrackersHash.get(entity);
            
            if (changeTracker === null) {
                throw new Error("The entity supplied wasn't part of the dataContext.");
            }
            
            return saveEntity(entity);
        };
        
        self.saveChanges = function () {
            return new Future(function (setValue, setError) {
                var task = new Task();
                
                var mappingEntities = [];
                var mappingTypes = edm.getMappingTypes();
                
                var forEachEntity = function (entity) {
                    if (mappingTypes.hasKey(entity.constructor)) {
                        mappingEntities.push(entity);
                    } else {
                        task.add(saveEntity(entity));
                    }
                };
                
                flattenMultiKeyMap(addedBucket).forEach(forEachEntity);
                flattenMultiKeyMap(updatedBucket).forEach(forEachEntity);
                flattenMultiKeyMap(removedBucket).forEach(forEachEntity);
                
                task.start().whenAll(function () {
                    
                    var task = new Task();
                    
                    mappingEntities.forEach(function (entity) {
                        if (entity.relationship) {
                            entity[entity.relationship.withForeignKey] = entity.source[entity.relationship.hasKey];
                            entity[entity.relationship.hasForeignKey] = entity.target[entity.relationship.withKey];
                        }
                        task.add(saveEntity(entity));
                    });
                    
                    task.start().whenAll(setValue);

                });

            }).then();
        };
        
        self.asQueryable = function (Type) {
            var queryable = new Queryable(Type);
            
            var provider = self.getQueryProvider(Type);
            queryable.provider = provider;
            
            return queryable;
        };
        
        self.getQueryProvider = function (Type) {
            var provider = new Provider();
            
            provider.toArray = provider.execute = function (queryable) {
                var serviceProvider = service.getQueryProvider(Type);
                
                return new Future(function (setValue, setError) {
                    var queryableCopy = queryable.copy();
                    queryableCopy.provider = serviceProvider;
                    
                    queryableCopy.toArray(function (dtos) {
                        var entities = loadEntities(Type, dtos);
                        setValue(entities);
                    }).ifError(setError);
                });
            };
            
            return provider;
        };
        
        self.getOrm = function () {
            return orm;
        };
        
        self.getPendingEntities = function () {
            return {
                added: flattenMultiKeyMap(addedBucket),
                removed: flattenMultiKeyMap(removedBucket),
                updated: flattenMultiKeyMap(updatedBucket)
            };
        };
        
        // Add DataSets
        edm.getModels().getValues().forEach(function (model) {
            self[model.collectionName] = new DataSet(model.type, self);
        });
        
        var setUpChangeTracker = function (entity) {
            
            var changeTracker = new ChangeTracker(entity, service);
            
            changeTracker.observeType("detached", function () {
                removeEntityFromBuckets(entity);
                changeTrackersHash.remove(entity);

                //TODO: Set the entities to use the Array Provider again.
            });
            
            changeTracker.observeType("added", function () {
                removeEntityFromBuckets(entity);
                addedBucket.add(entity.constructor, entity, entity);
            });
            
            changeTracker.observeType("updated", function () {
                removeEntityFromBuckets(entity);
                updatedBucket.add(entity.constructor, entity, entity);
            });
            
            changeTracker.observeType("removed", function () {
                removeEntityFromBuckets(entity);
                removedBucket.add(entity.constructor, entity, entity);
            });
            
            changeTracker.observeType("loaded", function () {
                removeEntityFromBuckets(entity);
                
                // As requested by Ben
                entity.save = function () {
                    return self.saveEntity(entity);
                };
                
                setUpEntity(entity);
                
                // We want to use the entity's key as the key for the hash, so we can sync.
                loadedBucket.add(entity.constructor, getUniqueValue(entity), entity);
            });
            
            changeTrackersHash.add(entity, changeTracker);
            return changeTracker;
        };
        
        var onEntityAdded = function (e) {
            var entity = e.entity;
            Entity.apply(entity);
            
            var changeTracker = setUpChangeTracker(entity);
            var id = getUniqueValue(entity);
            
            if (loadedBucket.hasKey(entity.constructor, id)) {
                changeTracker.setStateToLoaded();
            } else {
                changeTracker.add();
            }
        };
        
        orm.observeType("entityAdded", onEntityAdded);
        
        orm.observeType("entityRemoved", function (e) {
            var entity = e.entity;
            var changeTracker = changeTrackersHash.get(entity);
            
            // This only happens with Many to Many.
            // I really don't like this. Its a broken pattern. I've missed something somewhere.
            if (!changeTracker) {
                changeTracker = setUpChangeTracker(entity);
                changeTracker.setStateToLoaded();
            }
            
            changeTracker.remove();
        });
        
    };

});