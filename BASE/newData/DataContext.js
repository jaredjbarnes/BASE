BASE.require([
    "BASE.data.ChangeTracker",
    "BASE.data.Orm",
    "BASE.collections.Hashmap",
    "BASE.collections.MultiKeyMap",
    "BASE.query.Provider",
    "BASE.query.Queryable",
    "BASE.data.utils",
    "Date.fromISO"
], function () {

    BASE.namespace("BASE.data");

    var Orm = BASE.data.Orm;
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

    BASE.data.DataContext = function (relationships) {
        var self = this;
        BASE.assertNotGlobal(self);

        var dataContext = self;
        var orm = new Orm();

        var dataStoresHash = new Hashmap();
        var changeTrackersHash = new Hashmap();
        var loadedBucket = new MultiKeyMap();
        var addedBucket = new MultiKeyMap();
        var updatedBucket = new MultiKeyMap();
        var removedBucket = new MultiKeyMap();

        var removeEntityFromBuckets = function (entity) {
            addedBucket.remove(entity.constructor, entity);
            updatedBucket.remove(entity.constructor, entity);
            removedBucket.remove(entity.constructor, entity);
            loadedBucket.remove(entity.constructor, entity);
        };

        var saveEntity = function (entity) {
            return new Future(function (setValue, setError) {
                var task = new Task();

                var oneToOne = orm.getOneToOneAsTargetRelationships(entity);
                var oneToMany = orm.getOneToManyAsTargetRelationships(entity);
                var dependencies = oneToOne.concat(oneToMany);

                dependencies.forEach(function (relationship) {
                    var property = relationship.hasOne;

                    if (entity[property]) {
                        task.add(self.saveEntity(entity[property]));
                    }
                });

                task.start().whenAll(function (futures) {
                    changeTrackersHash.get(entity).save().then(setValue).ifError(setError);
                });

            }).then();
        };

        var createOneToManyProvider = function (id, fillArray, relationship) {
            var provider = new Provider();
            provider.toArray = provider.execute = function (queryable) {

                return new Future(function (setValue, setError) {

                    queryable = queryable.where(function (e) {
                        return e.property(relationship.withForeignKey).isEqualTo(id);
                    });

                    var dataStore = dataStoresHash.get(relationship.ofType);

                    if (dataStore === null) {
                        throw new Error("Couldn't find a data store for type.");
                    }

                    var dataStoreQueryable = dataStore.asQueryable();
                    dataStoreQueryable.merge(queryable);

                    dataStoreQueryable.toArray(function (dtos) {

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

        var createManyToManyProvider = function (id, fillArray, relationship) {

            var provider = new Provider();
            provider.toArray = provider.execute = function (queryable) {

                return new Future(function (setValue, setError) {
                    var MappingType = relationship.usingMappingType;
                    var mappingDataStore = dataStoresHash.get(MappingType);

                    var TargetType = relationship.ofType;
                    var targetDataStore = dataStoresHash.get(TargetType);

                    if (targetDataStore === null || mappingDataStore === null) {
                        throw new Error("Couldn't find target dataStore or the mapping dataStore.");
                    }

                    mappingDataStore.asQueryable().where(function (e) {
                        return e.property(relationship.withForeignKey).isEqualTo(id);
                    }).toArray(function (array) {
                        var task = new Task();

                        array.forEach(function (dto) {
                            task.add(targetDataStore.asQueryable().where(function (e) {
                                return e.property("id").isEqualTo(dto[relationship.hasForeignKey]);
                            }).merge(queryable).toArray());
                        });

                        task.start().whenAll(function (futures) {
                            var dtos = futures.reduce(function (array, nextFuture) {
                                return array.concat(nextFuture.value);
                            }, []);

                            var entities = loadEntities(TargetType, dtos);
                            entities.forEach(function (entity) {
                                if (fillArray.indexOf(entity) === -1) {
                                    fillArray.load(entity);
                                }
                            });

                            setValue(entities);
                        });
                    });

                });
            };
            return provider;

        };

        var createManyToManyAsTargetProvider = function (id, fillArray, relationship) {

            var provider = new Provider();
            provider.toArray = provider.execute = function (queryable) {

                return new Future(function (setValue, setError) {
                    var MappingType = relationship.usingMappingType;
                    var mappingDataStore = dataStoresHash.get(MappingType);

                    var SourceType = relationship.type;
                    var sourceDataStore = dataStoresHash.get(SourceType);

                    if (sourceDataStore === null || mappingDataStore === null) {
                        throw new Error("Couldn't find target dataStore or the mapping dataStore.");
                    }

                    mappingDataStore.asQueryable().where(function (e) {
                        return e.property(relationship.hasForeignKey).isEqualTo(id);
                    }).toArray(function (array) {
                        var task = new Task();

                        array.forEach(function (dto) {
                            task.add(sourceDataStore.asQueryable().where(function (e) {
                                return e.property("id").isEqualTo(dto[relationship.withForeignKey]);
                            }).merge(queryable).toArray());
                        });

                        task.start().whenAll(function (futures) {
                            var dtos = futures.reduce(function (array, nextFuture) {
                                return array.concat(nextFuture.value);
                            }, []);

                            var entities = loadEntities(SourceType, dtos);
                            entities.forEach(function (entity) {
                                if (fillArray.indexOf(entity) === -1) {
                                    fillArray.load(entity);
                                }
                            });

                            setValue(entities);
                        });
                    });

                });
            };
            return provider;

        };

        var addOneToManyProviders = function (entity) {
            var oneToManyRelationships = orm.getOneToManyRelationships(entity);

            oneToManyRelationships.forEach(function (relationship) {
                var property = relationship.hasMany;
                var provider = createOneToManyProvider(entity.id, entity[property], relationship);

                entity[property].getProviderFactory = function () {
                    return provider;
                };
            });
        };

        var addManyToManyProviders = function (entity) {
            var sourceRelationships = orm.getManyToManyRelationships(entity);
            var targetRelationships = orm.getManyToManyAsTargetRelationships(entity);

            sourceRelationships.forEach(function (relationship) {
                var property = relationship.hasMany;
                var provider = createManyToManyProvider(entity.id, entity[property], relationship);

                entity[property].getProviderFactory = function () {
                    return provider;
                };
            });

            targetRelationships.forEach(function (relationship) {
                var property = relationship.withMany;
                var provider = createManyToManyAsTargetProvider(entity.id, entity[property], relationship);

                entity[property].getProviderFactory = function () {
                    return provider;
                };
            });
        };

        var setUpEntity = function (entity) {
            addOneToManyProviders(entity);
            addManyToManyProviders(entity);
        };

        var loadEntity = function (Type, dto) {
            var entity = loadedBucket.get(Type, dto.id);
            if (entity === null) {
                entity = new Type();
                Object.keys(dto).forEach(function (key) {
                    if (isPrimitive(dto[key])) {
                        entity[key] = getValue(dto[key]);
                    }
                });

                self.addEntity(entity);
                setUpEntity(entity);

            }
            return entity;
        };

        var loadEntities = function (Type, dtos) {
            var entities = [];
            dtos.forEach(function (entity) {
                entities.push(loadEntity(Type, entity));
            });

            return entities;
        };

        relationships = relationships || {};
        relationships.oneToOne = relationships.oneToOne || [];
        relationships.oneToMany = relationships.oneToMany || [];
        relationships.manyToMany = relationships.manyToMany || [];

        relationships.oneToOne.forEach(function (relationship) {
            orm.addOneToOne(relationship);
        });

        relationships.oneToMany.forEach(function (relationship) {
            orm.addOneToMany(relationship);
        });

        relationships.manyToMany.forEach(function (relationship) {
            orm.addManyToMany(relationship);
        });

        self.addEntity = function (entity) {
            orm.add(entity);
        };

        self.removeEntity = function (entity) {
            orm.remove(entity);
        };

        self.syncEntity = function (entity, dto) {
            var changeTracker = changeTrackersHash.get(entity);
            changeTracker.sync(dto);
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
                var mappingTypes = orm.getMappingTypes();

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
                        entity[entity.relationship.withForeignKey] = entity.source.id;
                        entity[entity.relationship.hasForeignKey] = entity.target.id;
                        task.add(saveEntity(entity));
                    });

                    task.start().whenAll(setValue);

                });

            }).then();
        };
        self.asQueryable = function (Type) {
            var dataStore = dataStoresHash.get(Type);
            if (dataStore === null) {
                throw new Error("Couldn't find dataStore for entity: " + Type);
            }

            var queryable = dataStore.asQueryable();
            var provider = new Provider();

            queryable.provider = provider;

            provider.toArray = provider.execute = function (queryable) {
                return new Future(function (setValue, setError) {
                    var dataStoreQueryable = dataStore.asQueryable();
                    dataStoreQueryable.merge(queryable);

                    dataStoreQueryable.toArray(function (dtos) {
                        var entities = loadEntities(Type, dtos);
                        setValue(entities);
                    }).ifError(setError);
                });
            };

            return queryable;
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

        self.getDataStores = function () {
            return dataStoresHash;
        };

        orm.observeType("entityAdded", function (e) {
            var entity = e.entity;
            var dataStore = dataStoresHash.get(e.entity.constructor);

            if (dataStore === null) {
                throw new Error("Couldn't find dataStore for entity: " + e.entity.constructor);
            }

            var changeTracker = new ChangeTracker(e.entity, dataStore);

            changeTracker.observeType("detached", function () {
                removeEntityFromBuckets(entity);
                changeTrackersHash.remove(entity);

                //TODO: Set the entities to use the Array Provider again.
            });

            changeTracker.observeType("added", function () {
                removeEntityFromBuckets(entity);
                addedBucket.add(entity.constructor, entity, entity);

                var loadedObserver = changeTracker.observeType("loaded", function () {
                    loadedObserver.dispose();
                    setUpEntity(entity);
                });
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

                // We want to use the entity's key as the key for the hash, so we can sync.
                loadedBucket.add(entity.constructor, entity.id, entity);
            });

            changeTrackersHash.add(entity, changeTracker);
            if (entity.id) {
                changeTracker.setStateToLoaded();
            } else {
                changeTracker.add();
            }
        });

        orm.observeType("entityRemoved", function (e) {
            var entity = e.entity;
            var changeTracker = changeTrackersHash.get(entity);

            changeTracker.remove();
        });

    };

});