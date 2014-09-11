BASE.require([
    "Array.prototype.asQueryable",
    "BASE.collections.Hashmap",
    "BASE.query.ODataProvider",
    "BASE.query.Queryable",
    "BASE.data.responses.AddedResponse",
    "BASE.data.responses.UpdatedResponse",
    "BASE.data.responses.RemovedResponse",
    "BASE.data.responses.ErrorResponse",
    "BASE.data.utils"
], function () {
    
    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Hashmap = BASE.collections.Hashmap;
    var ODataProvider = BASE.query.ODataProvider;
    var AddedResponse = BASE.data.responses.AddedResponse;
    var UpdatedResponse = BASE.data.responses.UpdatedResponse;
    var RemovedResponse = BASE.data.responses.RemovedResponse;
    var ErrorResponse = BASE.data.responses.ErrorResponse;
    var Queryable = BASE.query.Queryable;
    
    BASE.namespace("BASE.data.dataStores");
    
    BASE.data.dataStores.ODataDataStore = function (config) {
        var self = this;
        
        BASE.assertNotGlobal(self);
        
        config = config || {};
        
        var provider = config.provider;
        var endPoint = config.endPoint;
        var ajax = config.ajax || ajax;
        var entities = new Hashmap();
        var headers = config.headers || {};
        
        if (typeof endPoint === "undefined" || endPoint === null) {
            throw new Error("The configuration needs to have the endPoint property set.");
        }
        
        if (typeof provider === "undefined" || provider === null) {
            throw new Error("The configuration needs to have the provider property set.");
        }
        
        self.add = function (entity) {
            var url = BASE.concatPaths(endPoint);
            ajax.POST(url, {
                data: entity,
                headers: headers
            }).then(function () {

            }).ifError(function () {

            });
        };
        
        self.update = function (entity, updates) {
            var id = entity.id;
            var url = BASE.concatPaths(endPoint, id);
            ajax.PATCH(url, {
                data: updates,
                headers: headers
            }).then(function () {

            }).ifError(function () {

            });
        };
        
        self.remove = function (entity) {
            var url = BASE.concatPaths(endPoint, id);
            
            ajax.DELETE(url, {
                headers: headers
            }).then(function () {

            }).ifError(function () {

            });

        };
        
        self.asQueryable = function () {
            var queryable = new Queryable();
            queryable.provider = provider;
            return queryable;
        };
        
        self.initialize = function () {
            return Future.fromResult();
        };
        
        self.dispose = function () {
            return Future.fromResult();
        };
    };


});