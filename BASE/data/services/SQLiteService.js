BASE.require([
    "BASE.query.Queryable",
    "BASE.query.Provider",
    "BASE.collections.Hashmap",
    "BASE.util.Observable"
], function () {
    
    BASE.namespace("BASE.data.services");
    
    var global = (function () { return this; })();
    
    var Queryable = BASE.query.Queryable;
    var Provider = BASE.query.Provider;
    var Hashmap = BASE.collections.Hashmap;
    var Future = BASE.async.Future;
    var Observable = BASE.util.Observable;
    
    BASE.data.services.SqliteService = function (SqliteDatabase) {
        var self = this;
        BASE.assertNotGlobal(self);
        
        Observable.call(self);
        
        self.add = function (entity) {
            return SqliteDatabase.add(entity).then(function () {
                self.notify({
                    type: "added",
                    entity: entity
                })
            }).ifError(function (responseError) {
                self.notify({
                    type: "error",
                    entity: entity,
                    error: responseError
                });

            });
        };
        
        self.update = function (entity, updates) {
            return SqliteDatabase.update(entity, updates).then(function () {
                self.notify({
                    type: "updated",
                    entity: entity,
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
            return SqliteDatabase.remove(entity).then(function () {
                self.notify({
                    type: "removed",
                    entity: entity
                });
            }).ifError(function (responseError) {
                self.notify({
                    type: "error",
                    entity: entity,
                    error: responseError
                });
            });
        };
        
        self.getSourcesOneToOneTargetEntity = function (sourceEntity, relationship) {
            var targetType = relationship.ofType;
            var targetDataStore = SqliteDatabase.getDataStore(targetType);
            
            return new Future(function (setValue, setError) {
                SqliteDatabase.asQueryable(targetType).where(function (e) {
                    return e.property(relationship.withForeignKey).isEqualTo(sourceEntity[relationship.hasKey]);
                }).firstOrDefault().then(setValue).ifError(setError);
            });
        };
        
        self.getTargetsOneToOneSourceEntity = function (targetEntity, relationship) {
            var sourceType = relationship.type;
            var sourceDataStore = SqliteDatabase.getDataStore(sourceType);
            
            return new Future(function (setValue, setError) {
                SqliteDatabase.asQueryable(sourceType).where(function (e) {
                    return e.property(relationship.hasKey).isEqualTo(targetEntity[relationship.withForeignKey]);
                }).firstOrDefault().then(setValue).ifError(setError);
            });
        };
        
        self.getSourcesOneToManyQueryProvider = function (sourceEntity, relationship) {
            var provider = new Provider();
            
            provider.execute = provider.toArray = function (queryable) {
                return new Future(function (setValue, setError) {
                    var targetsDataStore = SqliteDatabase.getDataStore(relationship.ofType);
                    var targetQueryable = targetsDataStore.asQueryable().where(function (e) {
                        return e.property(relationship.withForeignKey).isEqualTo(sourceEntity[relationship.hasKey]);
                    });
                    
                    targetQueryable.merge(queryable).toArray(setValue).ifError(setError);

                });
            };
            
            return provider;
        };
        
        self.getTargetsOneToManySourceEntity = function (targetEntity, relationship) {
            var sourceType = relationship.type;
            var sourceDataStore = SqliteDatabase.getDataStore(sourceType);
            
            return new Future(function (setValue, setError) {
                SqliteDatabase.asQueryable(sourceType).where(function (e) {
                    return e.property(relationship.hasKey).isEqualTo(targetEntity[relationship.withForeignKey]);
                }).firstOrDefault().then(setValue).ifError(setError);
            });
        };
        
        
        // TODO: optimize the many to many with joins.
        self.getSourcesManyToManyQueryProvider = function (sourceEntity, relationship) {
            var provider = new Provider();
            
            provider.execute = provider.toArray = function (queryable) {
                return new Future(function (setValue, setError) {
                    
                    var mappingDataStore = SqliteDatabase.getDataStore(relationship.usingMappingType);
                    var targetDataStore = SqliteDatabase.getDataStore(relationship.ofType);
                    
                    mappingDataStore.asQueryable().where(function (e) {
                        return e.property(relationship.withForeignKey).isEqualTo(sourceEntity[relationship.hasKey])
                    }).toArray(function (mappingEntities) {
                        targetDataStore.asQueryable().where(function (e) {
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
                    var mappingDataStore = SqliteDatabase.getDataStore(relationship.usingMappingType);
                    var sourceDataStore = SqliteDatabase.getDataStore(relationship.type);
                    
                    mappingDataStore.asQueryable().where(function (e) {
                        return e.property(relationship.hasForeignKey).isEqualTo(targetEntity[relationship.withKey])
                    }).toArray(function (mappingEntities) {
                        sourceDataStore.asQueryable().where(function (e) {
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
            return SqliteDatabase.getQueryProvider(Type);
        };

    };
    
    
    var isSupported = (typeof global.sqlitePlugin === "undefined") && (typeof global.openDatabase === "undefined");
    BASE.data.services.SqliteService.isSupported = isSupported;


});