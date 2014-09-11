BASE.require([
    "Array.prototype.asQueryable",
    "BASE.util.Guid",
    "BASE.collections.Hashmap",
    "BASE.data.dataStores.InMemoryDataStore"
], function () {

    var createGuid = BASE.util.Guid.create;
    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Hashmap = BASE.collections.Hashmap;
    var InMemoryDataStore = BASE.data.dataStores.InMemoryDataStore;

    BASE.namespace("BASE.data.dataStores");

    BASE.data.dataStores.LocalStorageDataStore = function (name) {
        var self = this;

        BASE.assertNotGlobal(self);

        var dataStore = new InMemoryDataStore();

        self.add = function (entity) {
            return dataStore.add.apply(dataStore, arguments);
        };

        self.update = function (entity, updates) {
            return dataStore.update.apply(dataStore, arguments);
        };

        self.remove = function (entity) {
            return dataStore.remove.apply(dataStore, arguments);
        };

        self.asQueryable = function () {
            return dataStore.asQueryable.apply(dataStore, arguments);
        };

        self.initialize = function () {
            var json = localStorage[name];
            if (json) {
                var object = JSON.parse(json);
                var entities = dataStore.getEntities();
                Object.keys(object).forEach(function (key) {
                    entities.add(key, object[key]);
                });
            }
            return Future.fromResult(undefined);
        };

        self.saveToDisk = function () {
            var object = {};
            var entities = dataStore.getEntities();
            entities.getKeys().forEach(function (key) {
                object[key] = entities.get(key);
            });

            localStorage[name] = JSON.stringify(object);
        };

        self.dispose = function () {
            self.saveToDisk();
            return Future.fromResult(undefined);
        };
    };


});