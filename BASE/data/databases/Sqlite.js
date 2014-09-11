﻿BASE.require([
    "BASE.data.dataStores.SqliteDataStore",
    "BASE.collections.Hashmap"
    ], function () {
    BASE.namespace("BASE.data.Sqlite");
    
    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var DataStore = BASE.data.dataStores.SqliteDataStore;
    var Hashmap = BASE.collections.Hashmap;
    
    BASE.namespace("BASE.data.databases");
    
    BASE.data.databases.Sqlite = function (config) {
        var self = this;
        BASE.assertNotGlobal(self);
        
        var name = config.name;
        var sizeInMegaBytes = config.sizeInMegaBytes || 5;
        var size = sizeInMegaBytes * 1024 * 1024;
        var edm = config.edm;
        var db = openDatabase(name, "1.0", "", size);
        var dataStores = new Hashmap();
        
        if (typeof edm === "undefined") {
            throw new Error("The edm cannot be undefined.");
        }
        
        if (typeof name !== "string") {
            throw new Error("Database needs a name.");
        }
        
        var dataStoreOnReadyFutures = [];
        
        var createDataStore = function (Type) {
            var dataStore = dataStores.get(Type);
            if (dataStore === null) {
                dataStore = new DataStore(Type, db, edm);
                dataStores.add(Type, dataStore);
                dataStoreOnReadyFutures.push(dataStore.onReady());
            }
        };
        
        var readyFuture = new Future(function (setValue, setError) {
            
            edm.getModels().getValues().forEach(function (model) {
                createDataStore(model.type);
            });
            
            var task = new Task();
            task.add.apply(task, dataStoreOnReadyFutures);
            task.start().whenAll(function () {
                setValue();
            });

        });
        
        var getDataStore = function (Type) {
            var dataStore = dataStores.get(Type);
            if (dataStore === null) {
                throw new Error("Couldn't find dataStore for type.");
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
        
        self.asQueryable = function (Type) {
            var dataStore = getDataStore(Type);
            return dataStore.asQueryable();
        };
        
        self.getQueryProvider = function (Type) {
            var dataStore = getDataStore(Type);
            return dataStore.getQueryProvider();
        };

        self.onReady = function (callback) {
            readyFuture.then(callback);
        };
        
        self.getDataStore = function (Type) {
            return dataStores.get(Type);
        };
        
        
        readyFuture.then();
    };

});