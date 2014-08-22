BASE.require([
    "BASE.data.dataStores.InMemoryDataStore",
    "BASE.query.Provider",
    "BASE.query.Queryable",
    "BASE.collections.Hashmap",
    "BASE.data.responses.AddedResponse",
    "BASE.data.responses.UpdatedResponse",
    "BASE.data.responses.RemovedResponse",
    "BASE.data.responses.ErrorResponse"
], function () {
    
    BASE.namespace("BASE.data.services");
    
    var Hashmap = BASE.collections.Hashmap;
    var Future = BASE.async.Future;
    var DataStore = BASE.data.dataStores.InMemoryDataStore;
    var Provider = BASE.query.Provider;
    var ErrorResponse = BASE.data.responses.ErrorResponse;
    var AddedResponse = BASE.data.responses.AddedResponse;
    var UpdatedResponse = BASE.data.responses.UpdatedResponse;
    var RemovedResponse = BASE.data.responses.RemovedResponse;
    
    BASE.data.services.InMemoryService = function (relationships) {
        var self = this;
        var dataStores = new Hashmap();
        
        var getDataStore = function (Type) {
            var dataStore = dataStores.get(Type);
            if (!dataStore) {
                dataStore = new DataStore();
                dataStores.add(Type, dataStore);
            }
            
            return dataStore;
        };
        
        self.add = function (entity) {
            var dataStore = getDataStore(entity.constructor);
            return dataStore.add(entity);
        };
        
        self.update = function (entity, updates) {
            var dataStore = getDataStore(entity.constructor);
            return dataStore.update(entity.id, updates);
        };
        
        self.remove = function (entity) {
            var dataStore = getDataStore(entity.constructor);
            return dataStore.remove(entity);
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
    };


});