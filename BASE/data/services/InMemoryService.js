BASE.require([
    "BASE.data.dataStores.InMemoryDataStore",
    "BASE.query.Provider",
    "BASE.query.Queryable",
    "BASE.collections.Hashmap"
], function () {
    
    BASE.namespace("BASE.data.services");
    
    var Hashmap = BASE.collections.Hashmap;
    var Future = BASE.async.Future;
    var DataStore = BASE.data.dataStores.InMemoryDataStore;
    var Provider = BASE.query.Provider;
    var Observable = BASE.util.Observable;
    
    BASE.data.services.InMemoryService = function (edm) {
        var self = this;
        
        BASE.assertNotGlobal(self);
        Observable.call(self);
        
        var dataStores = new Hashmap();
        
        if (typeof edm === "undefined") {
            throw new Error("Argument error: edm cannot be undefined.");
        }
        
        var getDataStore = function (Type) {
            var dataStore = dataStores.get(Type);
            if (!dataStore) {
                dataStore = new DataStore(edm.getPrimaryKeyProperties(Type));
                dataStores.add(Type, dataStore);
            }
            
            return dataStore;
        };
        
        self.add = function (entity) {
            var dataStore = getDataStore(entity.constructor);
            return dataStore.add(entity).then(function () {
                var model = edm.getModelByType(entity.constructor);
                var tableName = model.collectionName;
                var primaryKeys = edm.getPrimaryKeyProperties(entity.constructor);
                
                self.notify({
                    type: "added",
                    entity: entity,
                    primaryKeys: primaryKeys,
                    tableName: tableName
                });
            }).ifError(function (responseError) {
                self.notify({
                    type: "error",
                    entity: entity,
                    error: responseError
                });
            });
        };
        
        self.update = function (entity, updates) {
            var dataStore = getDataStore(entity.constructor);
            return dataStore.update(entity, updates).then(function () {
                var model = edm.getModelByType(entity.constructor);
                var tableName = model.collectionName;
                var primaryKeys = edm.getPrimaryKeyProperties(entity.constructor);
                
                self.notify({
                    type: "updated",
                    entity: entity,
                    primaryKeys: primaryKeys,
                    tableName: tableName,
                    updates: updates
                });
            }).ifError(function (responseError) {
                self.notify({
                    type: "error",
                    entity: entity,
                    error: responseError
                });
            });
        };
        
        self.remove = function (entity) {
            return new Future(function (setValue, setError) {
                
                // Clean house.
                var cleanTargets = function (relationship) {
                    var keyValue = entity[relationship.hasKey];
                    
                    if (relationship.optional !== true) {
                        var dataStore = getDataStore(relationship.ofType);
                        dataStore.asQueryable().where(function (e) {
                            
                            return e.property(relationship.withForeignKey).isEqualTo(keyValue);
                        
                        }).toArray(function (entities) {
                            
                            entities.forEach(function (childEntity) {
                                if (childEntity) {
                                    dataStore.remove(childEntity).then();
                                }
                            });

                        });
                       
                    }
                };
                
                edm.getOneToOneRelationships(entity).forEach(cleanTargets);
                edm.getOneToManyRelationships(entity).forEach(cleanTargets);
                
                var dataStore = getDataStore(entity.constructor);
                dataStore.remove(entity).then(function (response) {
                    var model = edm.getModelByType(entity.constructor);
                    var tableName = model.collectionName;
                    var primaryKeys = edm.getPrimaryKeyProperties(entity.constructor);
                    
                    self.notify({
                        type: "removed",
                        entity: entity,
                        primaryKeys: primaryKeys,
                        tableName: tableName
                    });
                    
                    setValue(response);
                
                }).ifError(function (responseError) {
                    
                    self.notify({
                        type: "error",
                        entity: entity,
                        error: responseError
                    });
                    
                    setError(responseError);
                });
            });

            
        };
        
        self.getSourcesOneToOneTargetEntity = function (sourceEntity, relationship) {
            var targetDataStore = getDataStore(relationship.ofType);
            
            return new Future(function (setValue, setError) {
                targetDataStore.asQueryable().where(function (e) {
                    return e.property(relationship.withForeignKey).isEqualTo(sourceEntity.id);
                }).firstOrDefault().then(setValue);
            });
        };
        
        self.getTargetsOneToOneSourceEntity = function (targetEntity, relationship) {
            var sourceDataStore = getDataStore(relationship.type);
            
            return new Future(function (setValue, setError) {
                sourceDataStore.asQueryable().where(function (e) {
                    return e.property(relationship.hasKey).isEqualTo(targetEntity[relationship.withForeignKey]);
                }).firstOrDefault().then(setValue);
            });
        };
        
        self.getSourcesOneToManyQueryProvider = function (sourceEntity, relationship) {
            var provider = new Provider();
            
            provider.execute = provider.toArray = function (queryable) {
                return new Future(function (setValue, setError) {
                    var targetsDataStore = getDataStore(relationship.ofType);
                    var targetQueryable = targetsDataStore.asQueryable().where(function (e) {
                        return e.property(relationship.withForeignKey).isEqualTo(sourceEntity[relationship.hasKey]);
                    });
                    
                    targetQueryable.merge(queryable).toArray(setValue).ifError(setError);

                });
            };
            
            return provider;
        };
        
        // This seems to be the same as the oneToOne... should we share the same function?
        self.getTargetsOneToManySourceEntity = function (targetEntity, relationship) {
            var sourceDataStore = getDataStore(relationship.type);
            
            return new Future(function (setValue, setError) {
                sourceDataStore.asQueryable().where(function (e) {
                    return e.property(relationship.hasKey).isEqualTo(targetEntity[relationship.withForeignKey]);
                }).firstOrDefault().then(setValue);
            });
        };
        
        self.getSourcesManyToManyQueryProvider = function (sourceEntity, relationship) {
            var provider = new Provider();
            
            provider.execute = provider.toArray = function (queryable) {
                return new Future(function (setValue, setError) {
                    
                    var mappingDataStore = getDataStore(relationship.usingMappingType);
                    var targetDataStore = getDataStore(relationship.ofType);
                    
                    mappingDataStore.asQueryable().where(function (e) {
                        return e.property(relationship.withForeignKey).isEqualTo(sourceEntity[relationship.hasKey])
                    }).toArray(function (mappingEntities) {
                        targetDataStore.asQueryable(function (e) {
                            var ids = [];
                            mappingEntities.forEach(function (mappingEntity) {
                                ids.push(e.property(relationship.withKey).isEqualTo(mappingEntity[relationship.hasForeignKey]));
                            });
                            
                            return e.or.apply(e, ids);
                        }).toArray(setValue);
                    });
                });
            };
            
            return provider;
        };
        
        self.getTargetsManyToManyQueryProvider = function (targetEntity, relationship) {
            var provider = new Provider();
            
            provider.execute = provider.toArray = function (queryable) {
                return new Future(function (setValue, setError) {
                    var mappingDataStore = getDataStore(relationship.usingMappingType);
                    var sourceDataStore = getDataStore(relationship.type);
                    
                    mappingDataStore.asQueryable().where(function (e) {
                        return e.property(relationship.hasForeignKey).isEqualTo(targetEntity[relationship.withKey])
                    }).toArray(function (mappingEntities) {
                        sourceDataStore.asQueryable(function (e) {
                            var ids = [];
                            mappingEntities.forEach(function (mappingEntity) {
                                ids.push(e.property(relationship.hasKey).isEqualTo(mappingEntity[relationship.withForeignKey]));
                            });
                            
                            return e.or.apply(e, ids);
                        }).toArray(setValue);
                    });
                });
            };
            
            return provider;
        };
        
        self.getQueryProvider = function (Type) {
            var dataStore = getDataStore(Type);
            return dataStore.getQueryProvider();
        };
        
        self.getDataStore = getDataStore;
        
        self.getEdm = function () {
            return edm;
        };
    };


});