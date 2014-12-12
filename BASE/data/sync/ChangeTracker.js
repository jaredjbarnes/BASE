BASE.require([
    "BASE.data.utils",
    "BASE.data.DataContext"
], function () {

    BASE.namespace("BASE.data.sync");

    var Future = BASE.async.Future;
    var emptyFn = function () { return Future.fromResult(undefined); };
    var flattenEntity = BASE.data.utils.flattenEntity;
    var makePrimaryKeyString = BASE.data.utils.makePrimaryKeyString;
    var DataContext = BASE.data.DataContext;

    var EmptyState = function (status, dataContext) {
        var self = this;

        BASE.assertNotGlobal(self);

        self.add = function (entity) {
            var json = JSON.stringify(flattenEntity(entity));
            var datum = dataContext.statusData.createInstance();
            datum.json = json;
            status.status = "added";
            status.data = datum;
            return dataContext.saveChanges();
        };

        self.remove = emptyFn;
        self.update = emptyFn;
        self.load = function () {
            return new Future(function (setValue, setError) {
                status.status = "loaded";
                status.modifiedDate = new Date();
                return dataContext.saveChanges().then(function () {
                    setValue(status);
                }).ifError(setError);
            });
        };

    };


    var AddedState = function (status, dataContext) {
        var self = this;

        BASE.assertNotGlobal(self);

        self.add = emptyFn;

        self.update = function (updates) {
            return new Future(function (setValue, setError) {
                var datum = status.load("data").then(function (datum) {
                    var data = JSON.parse(datum.json);
                    Object.keys(updates).forEach(function (key) {
                        data[key] = updates[key];
                    });
                    datum.json = JSON.stringify(data);
                    dataContext.saveChanges().then(setValue).ifError(setError);
                });
            });

        };

        self.remove = function () {
            dataContext.statuses.remove(status);
            return dataContext.saveChanges();
        };

        self.load = emptyFn;
    };

    var UpdatedState = function (status, dataContext) {
        var self = this;

        BASE.assertNotGlobal(self);

        self.add = emptyFn;

        self.update = function (updates) {
            return new Future(function (setValue, setError) {
                var datum = status.load("data").then(function (datum) {

                    if (datum === null) {
                        datum = dataContext.statusData.createInstance();
                        status.data = datum;
                        datum.json = JSON.stringify(updates);
                    } else {
                        var data = JSON.parse(datum.json);
                        Object.keys(updates).forEach(function (key) {
                            data[key] = updates[key];
                        });
                        datum.json = JSON.stringify(data);
                    }

                    dataContext.saveChanges().then(setValue).ifError(setError);
                });
            });
        };

        self.remove = function () {
            status.status = "removed";
            return dataContext.saveChanges();
        };

        self.load = emptyFn;

    };

    var LoadedState = function (status, dataContext) {
        var self = this;

        BASE.assertNotGlobal(self);

        self.add = emptyFn;
        self.update = function (updates) {
            return new Future(function (setValue, setError) {
                status.load("data").then(function (datum) {

                    if (datum === null) {
                        datum = dataContext.statusData.createInstance();
                        status.data = datum;
                    }

                    datum.json = JSON.stringify(updates);
                    status.status = "updated";
                    dataContext.saveChanges().then(setValue).ifError(setError);
                });
            });
        };

        self.remove = function () {
            status.status = "removed";
            return dataContext.saveChanges();
        };

        self.load = emptyFn;
    };

    var RemovedState = function (status, dataContext) {
        var self = this;

        BASE.assertNotGlobal(self);

        self.add = function () {
            status.status = "loaded";
            return dataContext.saveChanges();
        };

        self.update = emptyFn;
        self.remove = emptyFn;

        self.load = emptyFn;
    };

    constructorByState = {
        added: AddedState,
        updated: UpdatedState,
        removed: RemovedState,
        loaded: LoadedState
    };


    BASE.data.sync.ChangeTracker = function (serviceToWatch, syncService) {
        var self = this;

        BASE.assertNotGlobal(self);

        var edm = serviceToWatch.getEdm();

        var dataContextFactory = function () {
            return new DataContext(syncService);
        };

        var loadState = function (entity, timestamp) {
            var Type = entity.constructor;
            var model = edm.getModelByType(Type);
            var tableName = model.collectionName;
            var primaryKeys = edm.getPrimaryKeyProperties(Type);

            return new Future(function (setValue, setError) {
                var syncDataContext = dataContextFactory();

                syncDataContext.primaryKeys.where(function (e) {
                    var keys = [];

                    primaryKeys.forEach(function (key) {
                        keys.push(e.and(e.property("fieldName").isEqualTo(key), e.property("local").isEqualTo(entity[key])));
                    });

                    var keyExpression = e.or.apply(e, keys);

                    return e.and.apply(e, [keyExpression, e.property("tableName").isEqualTo(tableName)]);
                }).toArray().then(function (primaryKeysEntities) {

                    if (primaryKeysEntities.length > 0) {
                        primaryKeysEntities[0].load("status").then(function (status) {
                            status.modifiedDate = timestamp;
                            status.primaryKeys.asQueryable().toArray(function () {
                                var Type = constructorByState[status.status];
                                var stateInstance = new Type(status, syncDataContext);

                                setValue({
                                    status: status,
                                    state: stateInstance
                                });
                            });
                        });
                    } else {

                        var status = syncDataContext.statuses.createInstance();
                        var stateInstance = new EmptyState(status, syncDataContext);

                        status.modifiedDate = timestamp;

                        primaryKeys.forEach(function (key) {

                            var primaryKeyInstance = syncDataContext.primaryKeys.createInstance();

                            primaryKeyInstance.local = entity[key];
                            primaryKeyInstance.fieldName = key;
                            primaryKeyInstance.tableName = tableName;

                            status.primaryKeys.push(primaryKeyInstance);
                        });

                        setValue({
                            status: status,
                            state: stateInstance
                        });
                    }
                });

            });
        };

        var createEntity = function (tableName, entity) {
            var model = edm.getModel(tableName);
            var Type = model.type;
            var clone = new Type();

            Object.keys(entity).forEach(function (key) {
                clone[key] = entity[key];
            });

            return clone;
        };

        self.load = function (entity) {
            return new Future(function (setValue, setError) {
                loadState(entity).then(function (data) {
                    data.state.load().then(function () {
                        setValue(data.status);
                    });
                });

            });
        };

        if (typeof serviceToWatch.createHook !== "function") {
            throw new Error("The service we are watching needs to implement the method registerAction.");
        }

        var models = edm.getModels().getValues().forEach(function (model) {
            var Type = model.type;
            var model = edm.getModelByType(Type);
            var tableName = model.collectionName;

            serviceToWatch.createHook(Type, {
                "added": function (entity, timestamp) {
                    return new Future(function (setValue, setError) {
                        var clone = createEntity(tableName, entity);

                        loadState(entity, timestamp).then(function (data) {
                            var state = data.state;
                            state.add(clone).then(setValue).ifError(setError);
                        });
                    });
                }
            });

            serviceToWatch.createHook(Type, {
                "remove": function (entity, timestamp) {
                    return new Future(function (setValue, setError) {
                        loadState(entity, timestamp).then(function (data) {
                            var state = data.state;
                            state.remove().then(setValue).ifError(setError);
                        });
                    });
                }
            });

            serviceToWatch.createHook(Type, {
                "update": function (entity, updates, timestamp) {
                    return new Future(function (setValue, setError) {
                        loadState(entity, timestamp).then(function (data) {
                            var state = data.state;
                            state.update(updates).then(setValue).ifError(setError);
                        });
                    });
                }
            });

        });

    };

});