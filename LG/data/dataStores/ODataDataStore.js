BASE.require([
    "LG.query.ApiProvider",
    "BASE.query.Queryable",
    "BASE.collections.Hashmap",
    "BASE.data.responses.AddedResponse",
    "BASE.data.responses.UpdatedResponse",
    "BASE.data.responses.RemovedResponse",
    "BASE.data.responses.ErrorResponse",
    "BASE.data.responses.ValidationErrorResponse",
    "BASE.data.responses.ConnectionErrorResponse",
    "BASE.data.responses.ForbiddenErrorResponse",
    "BASE.data.responses.UnauthorizedErrorResponse",
    "BASE.data.responses.EntityNotFoundErrorResponse",
    "BASE.web.ajax",
    "BASE.data.utils"
    ], function () {
    BASE.namespace("LG.data.dataStores");
    
    var ApiProvider = LG.query.ApiProvider;
    var ajax = BASE.web.ajax;
    var Future = BASE.async.Future;
    var ErrorResponse = BASE.data.responses.ErrorResponse;
    var Queryable = BASE.query.Queryable;
    var ValidationErrorResponse = BASE.data.responses.ValidationErrorResponse;
    var UnauthorizedErrorResponse = BASE.data.responses.UnauthorizedErrorResponse;
    var ForbiddenErrorResponse = BASE.data.responses.ForbiddenErrorResponse;
    var EntityNotFoundErrorResponse = BASE.data.responses.EntityNotFoundErrorResponse;
    var ConnectionErrorResponse = BASE.data.responses.ConnectionErrorResponse;
    var AddedResponse = BASE.data.responses.AddedResponse;
    var UpdatedResponse = BASE.data.responses.UpdatedResponse;
    var RemovedResponse = BASE.data.responses.RemovedResponse;
    var Hashmap = BASE.collections.Hashmap;
    var isPrimitive = BASE.data.utils.isPrimitive;
    
    var convertToLocalDto = function (Type, dto) {
        var entity = new Type();
        
        for (var x in dto) {
            var objX = x;
            
            if (x.substr(0, 2) !== x.substr(0, 2).toUpperCase()) {
                objX = x.substr(0, 1).toLowerCase() + x.substring(1);
            }
            
            if (isPrimitive(dto[x])) {
                entity[objX] = dto[x];
            }
        }
        
        return entity;
    }
    
    var makeServerDto = function (entity) {
        var DTO = {};
        
        for (var x in entity) {
            var objX = x.substr(0, 1).toUpperCase() + x.substring(1);
            if ((typeof entity[x] === "string" ||
                        typeof entity[x] === "number" ||
                        typeof entity[x] === "boolean" ||
                        entity[x] === null ||
                        entity[x] instanceof Date) &&
                        x.indexOf("_") !== 0) {
                if (x === "id") {
                    if (entity.id !== null) {
                        DTO[objX] = entity[x];
                    }
                } else {
                    DTO[objX] = entity[x];
                }
            }
        }
        
        return DTO;
    };
    
    var createError = function (error, entity) {
        var data;
        data = error.xhr.responseText ? JSON.parse(error.xhr.responseText) : {};
        var err;
        
        // I really hate this, but its comparing primitives and is only in one place.
        if (error.xhr.status == 401) {
            err = new UnauthorizedErrorResponse("Unauthorized");
        } else if (error.xhr.status === 403) {
            err = new ForbiddenErrorResponse(data.Message);
        } else if (error.xhr.status === 404) {
            err = new EntityNotFoundErrorResponse("File Not Found", entity);
        } else if (error.xhr.status == 0) {
            err = new ConnectionErrorResponse("Connection Error");
        }
        
        return err;
    };
    
    
    
    LG.data.dataStores.ODataDataStore = function (config) {
        var self = this;
        config = config || {};
        var baseUrl = config.baseUrl;
        var appId = config.appId;
        var token = config.token;
        var Type = config.Type;
        
        if (typeof baseUrl === "undefined" ||
             typeof appId === "undefined" || 
             typeof token === "undefined" ||
             typeof Type !== "function") {
            throw new Error("Null argument error.");
        }
        
        BASE.assertNotGlobal(self);
        
        var setUpHeaders = function (settings) {
            settings.headers = {
                "X-LGAppId": appId,
                "X-LGToken": token
            };
        };
        
        var provider = new ApiProvider(config);
        
        self.add = function (entity) {
            var url = baseUrl;
            var dto = makeServerDto(entity);
            
            return new Future(function (setValue, setError) {
                if (url) {
                    var settings = {
                        type: "POST",
                        data: JSON.stringify(dto)
                    };
                    
                    setUpHeaders(settings);
                    
                    ajax.request(url, settings).then(function (response) {
                        var data = response.data;
                        if (data && data.Error) {
                            var err = new ValidationError(data.Message, data.ValidationErrors);
                            setError(err);
                        } else {
                            var entity = convertToLocalDto(Type, data.Data);
                            var response = new AddedResponse(response.message, entity);
                            setValue(response);
                        }
                    }).ifError(function (error) {
                        setError(createError(error, entity));
                    });
                } else {
                    throw new Error("Could not find url for this type.");
                }
            });
        };
        
        self.update = function (entity, updates) {
            var id = entity.id;
            var url = baseUrl + "/" + id;
            
            return new Future(function (setValue, setError) {
                if (url) {
                    var dto = makeServerDto(updates);
                    var settings = {
                        type: "PATCH",
                        data: JSON.stringify(dto)
                    };
                    
                    setUpHeaders(settings);
                    
                    ajax.request(url, settings).then(function (response) {
                        var data = response.data;
                        if (data && data.Error) {
                            var err = new ValidationError(data.Message, data.ValidationErrors);
                            setError(err);
                        } else {
                            var response = new UpdatedResponse(data.Message);
                            setValue(response);
                        }
                    }).ifError(function (error) {
                        setError(createError(error, entity));
                    });
                } else {
                    setValue({});
                }
            });
        };
        
        self.remove = function (entity) {
            var id = entity.id;
            var url = baseUrl + "/" + id;
            
            return new BASE.async.Future(function (setValue, setError) {
                if (url) {
                    var settings = {
                        type: "DELETE"
                    };
                    
                    setUpHeaders(settings);
                    
                    ajax.request(url, settings).then(function (response) {
                        var data = response.data;
                        if (data && data.Error) {
                            entity.id = null;
                            var err = new ErrorResponse(data.Message);
                            setError(err);
                        } else {
                            var response = new RemovedResponse(data.Message);
                            setValue(response);
                        }
                    }).ifError(function (error) {
                        setError(createError(error, entity));
                    });
                } else {
                    setValue({});
                }
            });

        };
        
        self.asQueryable = function () {
            var queryable = new Queryable(Type);
            queryable.provider = provider;
            return queryable;
        };
        
        self.getQueryProvider = function () {
            return provider;
        };
        
        self.initialize = function () {
            Future.fromResult(null);
        };
        
        self.dispose = function () {
            Future.fromResult(null);
        };
    };

});