BASE.require([
    "BASE.data.sync.Edm",
    "BASE.data.sync.ChangeTracker",
    "BASE.data.sync.DataContext",
    "BASE.data.services.SqliteService",
    "BASE.collections.Hashmap",
    "BASE.collections.MultiKeyMap",
    "BASE.async.getTimer",
    "BASE.data.utils",
    "BASE.data.sync.Mutator",
    "BASE.util.Observable"
], function () {

    BASE.namespace("BASE.data");

    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var ChangeTracker = BASE.data.sync.ChangeTracker;
    var DataContext = BASE.data.sync.DataContext;
    var Edm = BASE.data.sync.Edm;
    var Task = BASE.async.Task;
    var SqliteService = BASE.data.services.SqliteService;
    var getTimer = BASE.async.getTimer;
    var makePrimaryKeyString = BASE.data.utils.makePrimaryKeyString;
    var Future = BASE.async.Future;
    var Hashmap = BASE.collections.Hashmap;
    var MultiKeyMap = BASE.collections.MultiKeyMap;
    var Mutator = BASE.data.sync.Mutator;
    var flattenEntity = BASE.data.utils.flattenEntity;
    var isPrimitive = BASE.data.utils.isPrimitive;

    var modifiedEntityQueryable = function (e) {
        return e.or(e.property("status").isEqualTo("added"),
                    e.property("status").isEqualTo("removed"),
                    e.property("status").isEqualTo("updated"));
    };

    var modifiedDateQueryable = function (e) { return e.property("modifiedDate"); };

    BASE.data.Syncer = function (serviceToWatch, serviceToActOn, remoteService, syncDatabaseName) {
        var self = this;

        BASE.assertNotGlobal(self);

        BASE.util.Observable.call(self);

        var interval = null;
        var dataContext;
        var changeTracker;
        var service;
        var remoteEdm = remoteService.getEdm();
        var edm = new Edm();
        var syncingFuture = Future.fromResult(null).then();
        var syncFactory;
        var exceptionHandlers = Hashmap();
        var defaultLastSyncDate = new Date("0001-01-01T00:00:00+00:00");
        var mappingTypes = remoteEdm.getMappingTypes();
        var mutator;
        var disabledTypes = new Hashmap();
        var remoteSyncFilterByType = new Hashmap();
        var remoteSyncTriggersByType = new MultiKeyMap();
        var sqliteDatabase = null;

        var saveEntitiesToLocal = function (entities, callback) {
            var syncDataContext = new DataContext(service);

            var insertTimes = entities.insertTimes = entities.insertTimes || [];

            if (entities.length > 0) {
                var entity = entities.pop();
                var Type = entity.constructor;
                var keys = remoteEdm.getPrimaryKeyProperties(Type);
                var model = remoteEdm.getModelByType(Type);
                var tableName = model.collectionName;
                var properties = model.properties;

                self.notify({ type: "status", remaining: entities.length, tableName: tableName });

                var startInsertTime = new Date().getTime();

                syncDataContext.primaryKeys.where(function (e) {
                    var or = [];

                    keys.forEach(function (key) {
                        or.push(e.and(e.property("remote").isEqualTo(entity[key]), e.property("fieldName").isEqualTo(key)));
                    });

                    return e.and.apply(e, [e.property("tableName").isEqualTo(tableName), e.or.apply(e, or)]);
                }).toArray(function (primaryKeys) {
                    var primaryKey = primaryKeys[0];
                    if (!primaryKey) {
                        var localEntity = flattenEntity(entity);

                        if (!mappingTypes.hasKey(Type)) {
                            keys.forEach(function (key) {
                                var property = properties[key];
                                if (!property.foreignKeyRelationship || (property.foreignKeyRelationship && property.foreignKeyRelationship.hasKey !== property.foreignKeyRelationship.withForeignKey)) {
                                    localEntity[key] = undefined;
                                }
                            });
                        }

                        mutator.toLocal(localEntity).then(function () {

                            serviceToActOn.add(localEntity).then(function (response) {

                                Object.keys(response.entity).forEach(function (key) {
                                    localEntity[key] = response.entity[key];
                                });

                                changeTracker.load(localEntity).then(function (status) {
                                    var task = new Task();
                                    status.primaryKeys.forEach(function (key) {
                                        key.remote = entity[key.fieldName];
                                        task.add(key.save());
                                    });

                                    task.start().whenAll(function () {

                                        insertTimes.push(new Date().getTime() - startInsertTime);

                                        var trigger = remoteSyncTriggersByType.get(Type, "added");
                                        if (typeof trigger === "function") {
                                            trigger(localEntity);
                                        }

                                        saveEntitiesToLocal(entities, callback);
                                    });

                                });
                            });
                        });

                    } else {
                        saveEntitiesToLocal(entities, callback);
                    }
                });

            } else {
                var total = entities.insertTimes.reduce(function (value, currentItem) {
                    return value + currentItem;
                }, 0);

                var average = total / entities.insertTimes.length;

                //console.log("Insert average: " + average);
                callback();
            }
        };

        var updateEntitiesToLocal = function (entities, callback) {
            if (entities.length > 0) {
                var syncDataContext = new DataContext(service);

                var entity = entities.pop();
                var Type = entity.constructor;
                var keys = remoteEdm.getPrimaryKeyProperties(Type);
                var tableName = remoteEdm.getModelByType(Type).collectionName;
                var model = remoteEdm.getModelByType(Type);

                syncDataContext.primaryKeys.where(function (e) {
                    var or = [];

                    keys.forEach(function (key) {
                        or.push(e.and(e.property("remote").isEqualTo(entity[key]), e.property("fieldName").isEqualTo(key)));
                    });

                    return e.and.apply(e, [e.property("tableName").isEqualTo(tableName), e.or.apply(e, or)]);
                }).toArray(function (primaryKeys) {
                    var localEntity = flattenEntity(entity);

                    mutator.toLocal(localEntity).then(function () {
                        var updates = {};

                        Object.keys(model.properties).forEach(function (key) {
                            updates[key] = localEntity[key];
                        });

                        primaryKeys.forEach(function (key) {
                            localEntity[key.fieldName] = key.local;
                            updates[key.fieldName] = undefined;
                        });

                        serviceToActOn.update(localEntity, updates).then(function () {
                            var trigger = remoteSyncTriggersByType.get(Type, "update");
                            if (typeof trigger === "function") {
                                trigger(localEntity);
                            }

                            updateEntitiesToLocal(entities, callback)
                        });

                    });
                });
            } else {
                callback();
            }
        };

        var syncRemote = function (syncDataContext) {
            return new Future(function (setValue, setError) {
                var models = remoteEdm.getModels().getValues();
                var syncFutures = new Hashmap();

                syncDataContext.syncData.firstOrDefault().then(function (syncDatum) {

                    var syncFromRemoteService = function (Type) {
                        var model = remoteEdm.getModelByType(Type);
                        var syncFuture = syncFutures.get(Type);

                        if (!syncFuture) {
                            syncFuture = new Future(function (setValue, setError) {
                                var entity = new Type();
                                var dependencies = remoteEdm.getOneToOneAsTargetRelationships(entity);
                                dependencies = dependencies.concat(remoteEdm.getOneToManyAsTargetRelationships(entity));

                                var dependenciesTask = new Task();

                                dependencies.forEach(function (relationship) {
                                    dependenciesTask.add(syncFromRemoteService(relationship.type));
                                });

                                dependenciesTask.start().whenAll(function () {
                                    var createdDateQueryable = remoteService.asQueryable(Type).where(function (e) {
                                        var args = [];
                                        args.push(e.property("createdDate").isGreaterThanOrEqualTo(syncDatum.startDate));
                                        if (syncDatum.startDate !== defaultLastSyncDate) {
                                            args.push(e.property("createdDate").isLessThan(syncDatum.endDate));
                                        }
                                        var type = new Type();
                                        if (type.hasOwnProperty("endDate")) {
                                            args.push(e.property("endDate").isEqualTo(null));
                                        }
                                        return e.and.apply(e, args);
                                    });


                                    var filter = remoteSyncFilterByType.get(Type);
                                    if (filter) {
                                        createdDateQueryable = createdDateQueryable.merge(filter);
                                    }

                                    var getDataStart = new Date().getTime();
                                    createdDateQueryable.toArray(function (addedEntities) {

                                        //console.log("TableName adding: " + model.collectionName + " (" + (new Date().getTime() - getDataStart) + ")");
                                        self.notify({ type: "addingTable", table: model.collectionName });

                                        saveEntitiesToLocal(addedEntities, function () {
                                            // This looks for modified entities on the remote service.
                                            var lastModifiedQueryable = remoteService.asQueryable(Type).where(function (e) {
                                                return e.and(
                                                    e.property("lastModifiedDate").isGreaterThanOrEqualTo(syncDatum.startDate),
                                                    e.property("lastModifiedDate").isLessThan(syncDatum.endDate),
                                                    e.property("createdDate").isLessThan(syncDatum.startDate)
                                                    );
                                            });

                                            var filter = remoteSyncFilterByType.get(Type);

                                            if (filter) {
                                                lastModifiedQueryable = lastModifiedQueryable.merge(filter);
                                            }

                                            var getDataStart = new Date().getTime();
                                            lastModifiedQueryable.toArray(function (updatedEntities) {
                                                //console.log("TableName updating: " + model.collectionName + " (" + (new Date().getTime() - getDataStart) + ")");
                                                self.notify({ type: "updatingTable", table: model.collectionName });
                                                updateEntitiesToLocal(updatedEntities, setValue);
                                            }).ifError(function (e) {
                                                setError(e);
                                            });
                                        });

                                    }).ifError(function (e) {
                                        setError(e);
                                    });
                                });
                            });
                            syncFutures.add(Type, syncFuture);
                        }

                        return syncFuture;
                    };

                    if (syncDatum === null) {
                        syncDatum = syncDataContext.syncData.createInstance();
                        syncDatum.startDate = defaultLastSyncDate;
                        syncDatum.endDate = new Date();
                    } else {
                        if (syncDatum.isComplete) {
                            syncDatum.startDate = syncDatum.endDate;
                            syncDatum.endDate = new Date();
                            syncDatum.isComplete = false;
                        }
                    }

                    syncDataContext.saveChanges().then(function () {

                        var task = new Task();
                        var mappings = [];

                        models.forEach(function (model) {
                            if (!model.abstract) {
                                var Type = model.type;
                                var entity = new Type();

                                if (!disabledTypes.get(Type)) {
                                    if (!mappingTypes.hasKey(Type)) {
                                        task.add(syncFromRemoteService(Type));
                                    } else {
                                        mappings.push(Type);
                                    }
                                }
                            }
                        });

                        task.start().whenAll(function () {
                            var task = new Task();
                            mappings.forEach(function (Type) {
                                task.add(syncFromRemoteService(Type));
                            });

                            task.start().whenAll(function () {
                                syncDatum.isComplete = true;
                                syncDataContext.saveChanges().then(setValue).ifError(setError);
                            });
                        });
                    });

                });

            });
        };

        var getEntityByStatus = function (status) {
            return new Future(function (setValue, setError) {
                if (status) {
                    status.primaryKeys.asQueryable().toArray(function (primaryKeys) {
                        var primaryKey = primaryKeys[0];
                        var localDataContext = new DataContext(serviceToActOn);

                        localDataContext[primaryKey.tableName].where(function (e) {
                            var args = [];

                            primaryKeys.forEach(function (key) {
                                args.push(e.property(key.fieldName).isEqualTo(key.local));
                            });

                            return e.and.apply(e, args)
                        }).firstOrDefault().then(setValue);

                    });
                } else {
                    setValue(null);
                }
            });

        }

        var getEntityByStatusId = function (statusId) {
            return new Future(function (setValue, setError) {
                var dataContext = new DataContext(service);

                dataContext.statuses.where(function (e) {
                    e.property("id").isEqualTo(statusId);
                }).firstOrDefault().then(function (status) {
                    getEntityByStatus(status).then(setValue);
                });
            });
        };

        var syncFromStatus = function (syncDataContext, status) {
            return new Future(function (setValue, setError) {
                status.primaryKeys.asQueryable().toArray(function (primaryKeys) {
                    var primaryKey = primaryKeys[0];
                    var model = remoteEdm.getModel(primaryKey.tableName);

                    if (model === null) {
                        throw new Error("Couldn't find model in remote edm.");
                    }

                    var Type = model.type;
                    var statusString = status.status;
                    var handlers = exceptionHandlers.get(Type) || {};
                    var properties = model.properties;

                    if (disabledTypes.get(Type)) {
                        setValue();
                    } else {
                        getEntityByStatus(status).then(function (instance) {
                            if (statusString === "added") {

                                var defaultAddHandler = function () {
                                    status.load("data").then(function (data) {
                                        if (typeof data.json !== "string") {
                                            throw new Error("Expected data to add entity.");
                                        }
                                        var localInstance = instance;
                                        instance = flattenEntity(instance);
                                        mutator.toRemote(instance).then(function () {

                                            if (!mappingTypes.hasKey(Type)) {
                                                primaryKeys.forEach(function (key) {
                                                    var property = properties[key.fieldName];
                                                    if (!property.foreignKeyRelationship || (property.foreignKeyRelationship && property.foreignKeyRelationship.hasKey !== property.foreignKeyRelationship.withForeignKey)) {
                                                        instance[key.fieldName] = undefined;
                                                    }
                                                });
                                            }

                                            remoteService.add(instance).then(function (response) {
                                                var entity = response.entity;
                                                primaryKeys.forEach(function (primaryKey) {
                                                    primaryKey.remote = entity[primaryKey.fieldName];
                                                });
                                                status.status = "loaded";
                                                syncDataContext.statusData.remove(data);
                                                syncDataContext.saveChanges().then(setValue);

                                                // Update the entity saved with the servers response entity.
                                                var keys = remoteEdm.getAllKeyProperties(Type).reduce(function (hash, current) {
                                                    hash[current] = current;
                                                    return hash;
                                                }, {});

                                                Object.keys(entity).forEach(function (key) {
                                                    if (!keys[key]) {
                                                        localInstance[key] = entity[key];
                                                    }
                                                });

                                                localInstance.save();

                                            }).ifError(function (e) {
                                                console.log(instance);
                                                console.error(e.message);
                                                if (e instanceof BASE.data.responses.ValidationErrorResponse) {
                                                    // We should not keep trying to repeat the erroring request.
                                                    // TODO: Is this the best way to handle this? I'm removing the entity from the local store
                                                    serviceToWatch.remove(localInstance).then(function (response) {
                                                        syncDataContext.statusData.remove(data);
                                                        syncDataContext.saveChanges().then(setValue);
                                                    });
                                                }
                                                setError(e);
                                            });

                                        });
                                    });
                                };

                                if (typeof handlers["add"] === "function") {
                                    var handler = handlers["add"];
                                    handler(instance).then(function (handled) {
                                        if (!handled) {
                                            defaultAddHandler();
                                        } else {
                                            setValue();
                                        }
                                    });
                                } else {
                                    defaultAddHandler();
                                }


                            } else if (statusString === "removed") {

                                var defaultRemoveHandler = function () {
                                    var instance = new Type();

                                    if (!mappingTypes.hasKey(Type)) {
                                        primaryKeys.forEach(function (key) {
                                            instance[key.fieldName] = key.remote;
                                        });
                                    }

                                    remoteService.remove(instance).then(function (response) {

                                        syncDataContext.statuses.remove(status);
                                        syncDataContext.saveChanges().then(setValue);

                                    }).ifError(function (e) {
                                        // If it's already not on the remote, who cares?
                                        if (e instanceof BASE.data.responses.EntityNotFoundErrorResponse) {
                                            syncDataContext.statuses.remove(status);
                                            syncDataContext.saveChanges().then(setValue);
                                        } else {
                                            setError(e);
                                        }
                                    });
                                };

                                if (typeof handlers["remove"] === "function") {
                                    var handler = handlers["remove"];
                                    handler(instance).then(function (handled) {
                                        if (!handled) {
                                            defaultAddHandler();
                                        } else {
                                            setValue();
                                        }
                                    });
                                } else {
                                    defaultRemoveHandler();
                                }


                            } else if (statusString === "updated") {

                                var defaultUpdateHandler = function () {
                                    status.load("data").then(function (data) {
                                        if (typeof data.json !== "string") {
                                            throw new Error("Expected data to update entity.");
                                        }

                                        var updates = JSON.parse(data.json);
                                        var updatedKeys = Object.keys(updates);

                                        mutator.toRemote(instance).then(function () {
                                            if (!mappingTypes.hasKey(Type)) {
                                                primaryKeys.forEach(function (key) {
                                                    instance[key.fieldName] = key.remote;
                                                });
                                            }

                                            // This may seem wierd, but if a foreign key changed we need the remote id.
                                            var updates = {};
                                            updatedKeys.forEach(function (key) {
                                                updates[key] = instance[key];
                                            });

                                            remoteService.update(instance, updates).then(function (response) {
                                                status.status = "loaded";
                                                syncDataContext.statusData.remove(data);
                                                syncDataContext.saveChanges().then(setValue);
                                            }).ifError(function (e) {
                                                setError(e);
                                            });

                                        });
                                    });
                                };

                                if (typeof handlers["update"] === "function") {
                                    var handler = handlers["update"];
                                    handler(instance).then(function (handled) {
                                        if (!handled) {
                                            defaultAddHandler();
                                        } else {
                                            setValue();
                                        }
                                    });
                                } else {
                                    defaultUpdateHandler();
                                }

                            }
                        });
                    }

                });
            }).then();
        };

        var syncNext = function () {
            return new Future(function (setValue, setError) {
                self.notify({ type: "start" });
                readyFuture.then(function () {
                    if (syncingFuture.isComplete) {
                        var startSync = new Date().getTime();
                        var syncDataContext = new DataContext(service);

                        syncingFuture = new Future(function (setValue, setError) {
                            var getNext = function () {
                                return syncDataContext.statuses.where(modifiedEntityQueryable).orderBy(modifiedDateQueryable).firstOrDefault();
                            };

                            var onComplete = function () {
                                //console.log("---- Finished ----");
                                //console.log(new Date().getTime() - startSync);
                                //console.log("----          ----");
                                getNext().then(function (status) {
                                    if (status === null) {
                                        syncRemote(syncDataContext).then(function () {
                                            setValue();
                                            self.notify({ type: "complete" });
                                        }).ifError(function (e) {
                                            setError(e);
                                            self.notify({ type: "complete" });
                                        });
                                    } else {
                                        next(status);
                                    }
                                });
                            }

                            var next = function (status) {
                                syncFromStatus(syncDataContext, status).then(onComplete).ifError(function (e) {
                                    setError(e);
                                    self.notify({ type: "complete" });
                                });
                            };

                            getNext().then(function (status) {
                                if (status === null) {
                                    syncRemote(syncDataContext).then(function () {
                                        setValue();
                                        self.notify({ type: "complete" });
                                    }).ifError(function (e) {
                                        setError(e);
                                        self.notify({ type: "complete" });
                                    });
                                } else {
                                    next(status);
                                }
                            });
                        });

                    }

                    syncingFuture.then(setValue).ifError(setError);
                });
            }).then();
        };

        var readyFuture = new Future(function (setValue, setError) {

            sqliteDatabase = new BASE.data.databases.Sqlite({
                name: syncDatabaseName || "sync",
                edm: edm
            });

            sqliteDatabase.onReady(function () {
                service = new SqliteService(sqliteDatabase);
                mutator = new Mutator(service, remoteEdm)
                changeTracker = new ChangeTracker(serviceToWatch, service);
                syncFactory = function () {
                    return new DataContext(service);
                };
                setValue(undefined);
            });

        }).then();

        self.sync = function () {
            return syncNext();
        };

        self.addSyncException = function (Type, action, handler) {
            var handlers = exceptionHandlers.get(Type);
            if (!handlers) {
                handlers = {};
            }

            handlers[action] = handler;

            exceptionHandlers.add(Type, handlers);
        };

        self.addRemoteSyncFilter = function (Type, queryable) {
            remoteSyncFilterByType.add(Type, queryable);
        };

        // Actions are: added, updated.
        self.addRemoteSyncTrigger = function (Type, action, trigger) {
            remoteSyncTriggersByType.add(Type, action, trigger);
        };

        self.resync = function () {
            var syncDataContext = self.syncFactory();
            syncDataContext.syncData.toArray(function (entities) {
                entities.forEach(function (data) {
                    syncDataContext.syncData.remove(data);
                });
                syncDataContext.saveChanges();
            });
        };

        self.syncFactory = function () {
            if (typeof syncFactory === "function") {
                return syncFactory();
            } else {
                throw new Error("The syncer isn't ready.");
            }
        };

        self.getSyncService = function () {
            return service;
        };

        self.getRemoteService = function () {
            return remoteService;
        };

        self.getLocalService = function () {
            return serviceToActOn;
        };

        self.getActiveLocalService = function () {
            return serviceToWatch;
        };

        self.onReady = function (callback) {
            return readyFuture.then(callback);
        };

        self.hardReset = function () {
            return sqliteDatabase.dropAll();
        };

        self.disableSyncByType = function (Type) {
            disabledTypes.add(Type, true);
        };

        self.getLastSyncTime = function () {
            return new Future(function (setValue, setError) {
                var syncDataContext = new DataContext(service);
                syncDataContext.syncData.firstOrDefault().then(function (syncDatum) {
                    if (syncDatum && syncDatum.endDate) {
                        setValue(syncDatum.endDate)
                    } else {
                        setValue(null);
                    }
                });
            });
        };

        syncNext();
    };

});