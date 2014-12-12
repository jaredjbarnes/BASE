BASE.require([
    "BASE.collections.Hashmap",
    "BASE.query.Queryable",
    "BASE.data.services.DataStoreBackedService",
    "BASE.data.dataStores.IndexedDbDataStore",
    "Array.prototype.intersect",
    "Array.convertToArray"
], function () {
    
    // In the following line, you should include the prefixes of implementations you want to test.
    window.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
    // DON'T use "var indexedDB = ..." if you're not in a function.
    // Moreover, you may need references to some window.IDB* objects:
    window.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
    window.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
    // (Mozilla has never prefixed these objects, so we don't need window.mozIDB*)
    
    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Hashmap = BASE.collections.Hashmap;
    var IndexedDbDataStore = BASE.data.dataStores.IndexedDbDataStore;
    var DataStoreBackedService = BASE.data.services.DataStoreBackedService;
    
    BASE.namespace("BASE.data.services");
    
    BASE.data.services.IndexedDbService = function (config) {
        var self = this;
        
        var edm = config.edm;
        var models = edm.getModels();
        var databaseName = config.name;
        var version = config.version || 1;
        var dataStores = new Hashmap();
        
        if (typeof databaseName === "undefined") {
            throw new Error("IndexedDb needs to have a name for the database.");
        }
        
        config.getDataStore = function (Type) {
            var dataStore = dataStores.get(Type);
            if (!dataStore) {
                throw new Error("This service doesn't support that Type." + Type);
            }
            
            return dataStore;
        };
        
        config.readyFuture = new Future(function (setValue, setError) {
            
            var request = indexedDB.open(databaseName, version);
            
            var startUp = function (db) {
                var task = new Task();
                
                models.getValues().forEach(function (model) {
                    var dataStore = new IndexedDbDataStore(model.type, edm);
                    dataStores.add(model.type, dataStore);
                    task.add(dataStore.initialize(db));
                });
                
                task.start().whenAll(function () {
                    db.close();
                });
            };
            
            request.onsuccess = function (event) {
                var db = event.target.result;
                
                models.getValues().forEach(function (model) {
                    var dataStore = new IndexedDbDataStore(model.type, edm);
                    dataStores.add(model.type, dataStore);
                    dataStore.setDatabase(db);
                });
                
                setValue();
            };
            
            request.onupgradeneeded = function (event) {
                var task = new Task();
                var db = event.target.result;
                
                Array.convertToArray(db.objectStoreNames).intersect(models.getKeys()).forEach(function (model) {
                    db.deleteObjectStore(model.collectionName);
                });
                
                startUp(db);
            };

        });
        
        DataStoreBackedService.call(self, config);
        readyFuture.then();

    };



});