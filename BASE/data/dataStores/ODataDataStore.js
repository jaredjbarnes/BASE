/*
 * This will be used for the future Odata spec. So DONT delete it. 
 * 
 * 
 * 
 * 
 * This is big SO YOU'LL NOTICE :) Future self.
 */

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
    var UnauthorizedErrorResponse = BASE.data.responses.UnauthorizedErrorResponse;
    var ForbiddenErrorResponse = BASE.data.responses.ForbiddenErrorResponse;
    var EntityNotFoundErrorResponse = BASE.data.responses.EntityNotFoundErrorResponse;
    var ConnectionErrorResponse = BASE.data.responses.ConnectionErrorResponse;
    var ValidationErrorResponse = BASE.data.responses.ValidationErrorResponse;
    var Queryable = BASE.query.Queryable;
    
    BASE.namespace("BASE.data.dataStores");
    
    var createError = function (xhr, entity) {
        var data;
        data = xhr.responseText ? JSON.parse(xhr.responseText) : {};
        var err;
        
        // I really hate this, but its comparing primitives and is only in one place.
        if (xhr.status == 401) {
            err = new UnauthorizedErrorResponse("Unauthorized");
        } else if (error.xhr.status === 403) {
            err = new ForbiddenErrorResponse(data.Message);
        } else if (error.xhr.status === 404) {
            err = new EntityNotFoundErrorResponse("File Not Found", entity);
        } else if (error.xhr.status === 0) {
            err = new ConnectionErrorResponse("Network Error");
        } else if (error.xhr.status === 400) {
            var data = JSON.parse(error.xhr.response);
            err = new ValidationErrorResponse(data.ValidationErrors[0].Error, data.ValidationErrors);
        } else {
            err = new ErrorResponse("Unknown Error");
        }
        
        return err;
    };
    
    var jsonify = function (model, entity) {
        var obj = {};
        
        Object.keys(model).forEach(function (key) {
            obj[key] = entity[key];
        });
        
        return JSON.stringify(obj);
    };
    
    BASE.data.dataStores.ODataDataStore = function (config) {
        var self = this;
        
        BASE.assertNotGlobal(self);
        
        config = config || {};
        
        var provider = config.provider || null;
        var endPoint = config.endPoint;
        var ajax = config.ajax || ajax;
        var model = config.model || null;
        var entities = new Hashmap();
        var headers = config.headers || {};
        
        if (endPoint === null) {
            throw new Error("The configuration needs to have the endPoint property set.");
        }
        
        if (provider === null) {
            throw new Error("The configuration needs to have the provider property set.");
        }
        
        if (model === null) {
            throw new Error("The configuration needs to have the model property set.");
        }
        
        self.add = function (entity) {
            var url = BASE.concatPaths(endPoint);
            
            var json = jsonify(model, entity);
            
            ajax.POST(url, {
                data: json,
                headers: headers
            }).then(function (response) {

            }).ifError(function () {
                var errorResponse = createError(error.xhr, entity);
                setError(errorResponse);
            });
        };
        
        self.update = function (entity, updates) {
            var id = entity.id;
            var url = BASE.concatPaths(endPoint, id);
            
            ajax.PATCH(url, {
                data: updates,
                headers: headers
            }).then(function (response) {

            }).ifError(function (error) {
                var errorResponse = createError(error.xhr, entity);
                setError(errorResponse);
            });
        };
        
        self.remove = function (entity) {
            var url = BASE.concatPaths(endPoint, id);
            
            ajax.DELETE(url, {
                headers: headers
            }).then(function (response) {

            }).ifError(function (error) {
                var errorResponse = createError(error.xhr, entity);
                setError(errorResponse);
            });

        };
        
        self.getQueryProvider = function () {
            return provider;
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