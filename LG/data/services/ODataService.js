BASE.require([
    "BASE.collections.Hashmap",
    "BASE.query.Queryable",
    "LG.data.dataStores.ODataDataStore",
    "BASE.query.Provider"
], function () {
    
    BASE.namespace("LG.data.services");
    
    var Hashmap = BASE.collections.Hashmap;
    var Future = BASE.async.Future;
    var DataStore = LG.data.dataStores.ODataDataStore;
    var Provider = BASE.query.Provider;
    var Queryable = BASE.query.Queryable;
    
    LG.data.services.ODataService = function (edm, appId, token) {
        var self = this;
        
        var dataStores = new Hashmap();
        
        var getDataStore = function (Type) {
            var dataStore = dataStores.get(Type);
            if (dataStore === null) {
                throw new Error("There isn't a end point for that type.");
            }
            return dataStore;
        };
        
        self.add = function (entity) {
            var dataStore = getDataStore(entity.constructor);
            return dataStore.add(entity);
        };
        
        self.update = function (entity, updates) {
            var dataStore = getDataStore(entity.constructor);
            return dataStore.update(entity, updates);
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
        
        self.asQueryable = function (Type) {
            var provider = self.getQueryProvider(Type);
            var queryable = new Queryable(Type);
            queryable.provider = provider;
            return queryable;
        };
        
        self.getEdm = function () {
            return edm;
        };
        
        self.addEndPoint = function (Type, url) {
            var model = edm.getModelByType(Type);
            var dataStore = new DataStore({
                baseUrl: url,
                appId: appId,
                token: token,
                Type: Type,
                model: model
            });
            
            dataStores.add(Type, dataStore);
        };

    };

});