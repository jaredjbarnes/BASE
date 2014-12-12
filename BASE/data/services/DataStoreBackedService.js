BASE.require([
    "BASE.collections.Hashmap",
    "BASE.query.Queryable",
    "Array.prototype.intersect",
    "Array.convertToArray",
    "BASE.query.Provider",
    "BASE.data.utils"
], function () {

    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Hashmap = BASE.collections.Hashmap;
    var Queryable = BASE.query.Queryable;
    var Provider = BASE.query.Provider;
    var flattenEntity = BASE.data.utils.flattenEntity;
    var global = (function () { return this; })();

    BASE.namespace("BASE.data.services");

    BASE.data.services.DataStoreBackedService = function (config) {
        var self = this;

        var edm = config.edm;
        var version = config.version || 1;
        var getDataStore = config.getDataStore || function () { return null; };
        var readyFuture = config.readyFuture || Future.fromResult();
        var models = edm.getModels();
        var hooks = new Hashmap();
        var transactionsServicesByName = {};

        if (typeof edm === "undefined") {
            throw new Error("BASE.data.services.DataStoreBackedService needs to have an edm in the config object.");
        }

        if (typeof getDataStore !== "function") {
            throw new Error("The config needs to have a getDataStore function.");
        }

        var getHookByType = function (Type) {
            var hook = hooks.get(Type);
            if (hook === null) {
                hook = [];
                hooks.add(Type, hook);
            }

            return hook;
        };

        var addHook = function (Type, hook) {
            var hooks = getHookByType(Type);

            hooks.push(hook);
        };

        var removeHook = function (Type, hook) {
            var hooks = getHookByType(Type);
            var index = hooks.indexOf(hook);

            if (index >= 0) {
                hooks.splice(index, 1);
            }
            hooks.push(hook);
        };

        var executeHooks = function (Type, actionType, args) {
            var typeHooks = hooks.get(Type)
            if (typeHooks !== null) {
                return new Future(function (setValue, setError) {

                    typeHooks.map(function (hook) {
                        var action = hook.actions[actionType];

                        if (typeof action === "function") {
                            return action;
                        } else {
                            return function () { return Future.fromResult(); };
                        }

                    }).reduce(function (task, action) {
                        task.add(action.apply(null, args));
                        return task;
                    }, new Task()).start().whenAll(setValue);
                });
            } else {
                return Future.fromResult();
            }
        };

        self.add = function (entity) {
            var Type = entity.constructor;
            var dataStore = getDataStore(Type);
            var timestamp = new Date().getTime();

            return new Future(function (setValue, setError) {
                dataStore.add(entity).then(function (response) {

                    executeHooks(Type, "added", [response.entity, timestamp]).then(function () {
                        setValue(response);
                    });

                }).ifError(setError);
            }).then();
        };

        self.update = function (entity, updates) {
            var Type = entity.constructor;
            var dataStore = getDataStore(Type);
            var timestamp = new Date().getTime();

            return new Future(function (setValue, setError) {
                dataStore.update(entity, updates).then(function (response) {

                    executeHooks(Type, "updated", [entity, updates, timestamp]).then(function () {
                        setValue(response);
                    });

                }).ifError(setError);
            });
        };

        self.remove = function (entity) {
            var Type = entity.constructor;
            var dataStore = getDataStore(Type);
            var timestamp = new Date().getTime();

            return new Future(function (setValue, setError) {
                dataStore.remove(entity).then(function (response) {
                    executeHooks(Type, "removed", [entity, timestamp]).then(function () {
                        setValue(response);
                    });
                }).ifError(setError);
            });
        };

        self.getSourcesOneToOneTargetEntity = function (sourceEntity, relationship) {
            var targetType = relationship.ofType;
            var targetDataStore = getDataStore(targetType);
            var timestamp = new Date().getTime();

            return new Future(function (setValue, setError) {
                targetDataStore.asQueryable().where(function (e) {
                    return e.property(relationship.withForeignKey).isEqualTo(sourceEntity[relationship.hasKey]);
                }).firstOrDefault().then(function (entity) {
                    executeHooks(targetType, "queried", [[entity], timestamp]).then(function () {
                        setValue(entity);
                    });
                }).ifError(setError);
            });
        };

        self.getTargetsOneToOneSourceEntity = function (targetEntity, relationship) {
            var sourceType = relationship.type;
            var sourceDataStore = getDataStore(sourceType);
            var timestamp = new Date().getTime();

            return new Future(function (setValue, setError) {
                sourceDataStore.asQueryable().where(function (e) {
                    return e.property(relationship.hasKey).isEqualTo(targetEntity[relationship.withForeignKey]);
                }).firstOrDefault().then(function (entity) {
                    executeHooks(sourceType, "queried", [[entity], timestamp]).then(function () {
                        setValue(entity);
                    });
                }).ifError(setError);
            });
        };

        self.getSourcesOneToManyQueryProvider = function (sourceEntity, relationship) {
            var provider = new Provider();
            var targetType = relationship.ofType;
            var timestamp = new Date().getTime();

            provider.execute = provider.toArray = function (queryable) {
                return new Future(function (setValue, setError) {
                    var targetsDataStore = getDataStore(relationship.ofType);
                    var targetQueryable = targetsDataStore.asQueryable().where(function (e) {
                        return e.property(relationship.withForeignKey).isEqualTo(sourceEntity[relationship.hasKey]);
                    });

                    targetQueryable.merge(queryable).toArray(function (entities) {

                        executeHooks(targetType, "queried", [entities, timestamp]).then(function () {
                            setValue(entities);
                        });

                    }).ifError(setError);

                });
            };

            return provider;
        };

        self.getTargetsOneToManySourceEntity = function (targetEntity, relationship) {
            var sourceType = relationship.type;
            var sourceDataStore = getDataStore(sourceType);
            var timestamp = new Date().getTime();

            return new Future(function (setValue, setError) {
                sourceDataStore.asQueryable().where(function (e) {
                    return e.property(relationship.hasKey).isEqualTo(targetEntity[relationship.withForeignKey]);
                }).firstOrDefault().then(function (entity) {
                    executeHooks(sourceType, "queried", [[entity], timestamp]).then(function () {
                        setValue(entity);
                    });
                }).ifError(setError);
            });
        };

        self.getSourcesManyToManyQueryProvider = function (sourceEntity, relationship) {
            var provider = new Provider();
            var targetType = relationship.ofType;
            var timestamp = new Date().getTime();

            provider.execute = provider.toArray = function (queryable) {
                return new Future(function (setValue, setError) {

                    var mappingDataStore = getDataStore(relationship.usingMappingType);
                    var targetDataStore = getDataStore(relationship.ofType);

                    mappingDataStore.asQueryable().where(function (e) {
                        return e.property(relationship.withForeignKey).isEqualTo(sourceEntity[relationship.hasKey])
                    }).toArray(function (mappingEntities) {
                        targetDataStore.asQueryable().where(function (e) {
                            var ids = [];
                            mappingEntities.forEach(function (mappingEntity) {
                                ids.push(e.property(relationship.withKey).isEqualTo(mappingEntity[relationship.hasForeignKey]));
                            });

                            return e.or.apply(e, ids);
                        }).toArray(function (entities) {
                            executeHooks(targetType, "queried", [entities, timestamp]).then(function () {
                                setValue(entities);
                            });
                        });
                    });
                });
            };

            return provider;
        };

        self.getTargetsManyToManyQueryProvider = function (targetEntity, relationship) {
            var provider = new Provider();
            var sourceType = relationship.type;
            var timestamp = new Date().getTime();

            provider.execute = provider.toArray = function (queryable) {
                return new Future(function (setValue, setError) {
                    var mappingDataStore = getDataStore(relationship.usingMappingType);
                    var sourceDataStore = getDataStore(relationship.type);

                    mappingDataStore.asQueryable().where(function (e) {
                        return e.property(relationship.hasForeignKey).isEqualTo(targetEntity[relationship.withKey])
                    }).toArray(function (mappingEntities) {
                        sourceDataStore.asQueryable().where(function (e) {
                            var ids = [];
                            mappingEntities.forEach(function (mappingEntity) {
                                ids.push(e.property(relationship.hasKey).isEqualTo(mappingEntity[relationship.withForeignKey]));
                            });

                            return e.or.apply(e, ids);
                        }).toArray(function (entities) {
                            executeHooks(sourceType, "queried", [entities, timestamp]).then(function () {
                                setValue(entities);
                            });
                        });
                    });
                });
            };

            return provider;
        };

        self.getQueryProvider = function (Type) {
            var dataStore = getDataStore(Type);
            var provider = new Provider();
            var timestamp = new Date().getTime();

            provider.execute = provider.toArray = function (queryable) {
                return new Future(function (setValue, setError) {
                    var dataStoreProvider = dataStore.getQueryProvider();

                    dataStoreProvider.execute(queryable).then(function (entities) {
                        executeHooks(Type, "queried", [entities, timestamp]).then(function () {
                            setValue(entities);
                        });
                    });
                });
            };

            return provider;
        };

        self.asQueryable = function (Type) {
            var queryable = new Queryable(Type);
            queryable.provider = self.getQueryProvider(Type);

            return queryable;
        };

        self.getEdm = function () {
            return edm;
        };

        self.supportsType = function (Type) {
            var dataStore = getDataStore(Type);
            return dataStore === null || typeof dataStore === "undefined" ? true : false;
        };

        self.addTransactionService = function (name, service) {
            transactionsServicesByName[name] = service;
        };

        self.getTransactionService = function (name) {
            var service = transactionsServicesByName[name];
            return service ? service : null;
        };

        // The actions should be an object with the methods it wants to hook on to.
        // {queried: function(entities){}, added: function(entity){}, updated: function(entity){}, removed: function(entity){}}
        self.createHook = function (Type, actions) {

            var hook = {
                actions: actions,
                dispose: function () {
                    removeHook(Type, hook);
                }
            };

            addHook(Type, hook);
        };

        self.initialize = function () {
            return readyFuture;
        };

        self.dispose = function () {
            return Future.fromResult(null);
        };

        readyFuture.then();

    };

});