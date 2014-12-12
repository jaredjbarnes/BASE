BASE.require([
    "BASE.data.services.DataStoreBackedService"
], function () {
    
    var DataStoreBackedService = BASE.data.services.DataStoreBackedService;
    var global = (function () { return this; })();

    BASE.namespace("BASE.data.services");
    
    BASE.data.services.SqliteService = function (sqliteDatabase) {
        var self = this;
        BASE.assertNotGlobal(self);
        
        var config = {};
        config.edm = sqliteDatabase.getEdm();
        config.name = "Sqlite_Service";
        config.readyFuture = sqliteDatabase.onReady();
        config.getDataStore = function (Type) {
            return sqliteDatabase.getDataStore(Type);
        };
        
        DataStoreBackedService.call(self, config);
    };
    
    var isSupported = (typeof global.sqlitePlugin === "undefined") && (typeof global.openDatabase === "undefined");
    BASE.data.services.SqliteService.isSupported = isSupported;


});