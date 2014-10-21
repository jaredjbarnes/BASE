BASE.require([
    "BASE.data.utils",
    "BASE.data.DataContext"   
], function () {
    
    BASE.namespace("BASE.data.sync");
    
    var Future = BASE.async.Future;
    var emptyFn = function () { };
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
            dataContext.saveChanges();
        };
        
        self.remove = emptyFn;
        self.update = emptyFn;
        self.load = function () {
            status.status = "loaded";
            status.modifiedDate = new Date();
            dataContext.saveChanges();
        };

    };
    
    
    var AddedState = function (status, dataContext) {
        var self = this;
        
        BASE.assertNotGlobal(self);
        
        self.add = emptyFn;
        
        self.update = function (updates) {
            var datum = status.load("data").then(function (datum) {
                var data = JSON.parse(datum.json);
                Object.keys(updates).forEach(function (key) {
                    data[key] = updates[key];
                });
                datum.json = JSON.stringify(data);
                dataContext.saveChanges();
            });
        };
        
        self.remove = function () {
            dataContext.statuses.remove(status);
            dataContext.saveChanges();
        };
        
        self.load = emptyFn;
    };
    
    var UpdatedState = function (status, dataContext) {
        var self = this;
        
        BASE.assertNotGlobal(self);
        
        self.add = emptyFn;
        
        self.update = function (updates) {
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
                
                dataContext.saveChanges();
            });
            
        };
        
        self.remove = function () {
            status.status = "removed";
            dataContext.saveChanges();
        };
        
        self.load = emptyFn;

    };
    
    var LoadedState = function (status, dataContext) {
        var self = this;
        
        BASE.assertNotGlobal(self);
        
        self.add = emptyFn;
        self.update = function (updates) {
            status.load("data").then(function (datum) {
                
                if (datum === null) {
                    datum = dataContext.statusData.createInstance();
                    status.data = datum;
                }
                
                datum.json = JSON.stringify(updates);
                status.status = "updated";
                dataContext.saveChanges();
            });
            
        };
        
        self.remove = function () {
            status.status = "removed";
            dataContext.saveChanges();
        };
        
        self.load = emptyFn;
    };
    
    var RemovedState = function (status, dataContext) {
        var self = this;
        
        BASE.assertNotGlobal(self);
        
        self.add = function () {
            status.status = "loaded";
            dataContext.saveChanges();
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
                    data.state.load();
                    setValue(data.status);
                });
            });
        };
        
        serviceToWatch.observeType("added", function (event) {
            var entity = createEntity(event.tableName, event.entity);
            
            loadState(entity, event.timestamp).then(function (data) {
                var state = data.state;
                state.add(event.entity);
            });
        });
        
        serviceToWatch.observeType("removed", function (event) {
            var entity = createEntity(event.tableName, event.entity);
            
            loadState(event.entity, event.timestamp).then(function (data) {
                var state = data.state;
                state.remove();
            });
        });
        
        serviceToWatch.observeType("updated", function (event) {
            var entity = createEntity(event.tableName, event.entity);
            
            loadState(event.entity, event.timestamp).then(function (data) {
                var state = data.state;
                state.update(event.updates);
            });
        });

    };

});