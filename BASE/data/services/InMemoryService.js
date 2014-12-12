BASE.require([
    "BASE.data.dataStores.InMemoryDataStore",
    "BASE.data.services.DataStoreBackedService",
    "BASE.query.Provider",
    "BASE.query.Queryable",
    "BASE.collections.Hashmap",
    "BASE.collections.MultiKeyMap",
], function () {
    
    BASE.namespace("BASE.data.services");
    
    var Hashmap = BASE.collections.Hashmap;
    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var DataStore = BASE.data.dataStores.InMemoryDataStore;
    var Provider = BASE.query.Provider;
    var MultiKeyMap = BASE.collections.MultiKeyMap;
    var DataStoreBackedService = BASE.data.services.DataStoreBackedService;
    
    BASE.data.services.InMemoryService = function (edm) {
        var self = this;
        var config = {}
        var dataStores = new Hashmap();
        
        config.edm = edm;
        config.getDataStore = function (Type) {
            var dataStore = dataStores.get(Type);
            if (!dataStore) {
                dataStore = new DataStore(edm.getPrimaryKeyProperties(Type));
                dataStores.add(Type, dataStore);
            }
            
            return dataStore;
        };
        
        DataStoreBackedService.call(self, config);
        
        self.getDataStore = config.getDataStore;
        
    };


});