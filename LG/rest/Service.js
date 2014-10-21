BASE.require([
    "BASE.util.Observable",
    "LG.AjaxProvider",
    "BASE.collections.Hashmap",
    "LG.ServiceError",
    "LG.ServiceResponse",
    "BASE.async.Future",
    "BASE.async.Task",
    "LG.query.ApiProvider",
    "BASE.query.Queryable",
    "BASE.data.EntityChangeTracker",
    "BASE.data.UnauthorizedError",
    "BASE.data.ForbiddenError",
    "BASE.data.ValidationError",
    "BASE.data.NetworkError",
    "BASE.data.EntityNotFoundError",
    "BASE.data.AddedResponse",
    "BASE.data.UpdatedResponse",
    "BASE.data.RemovedResponse",
    "BASE.data.EntityChangeTracker"
], function () {
    BASE.namespace("LG.rest");

    var ExpressionParser = BASE.query.ExpressionParser;
    var ODataQueryBuilder = BASE.query.ODataQueryBuilder;
    var ApiProvider = LG.query.ApiProvider;
    var Queryable = BASE.query.Queryable;
    var EntityChangeTracker = BASE.data.EntityChangeTracker;

    LG.rest.Service = (function (Super) {
        var Service = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Service();
            }

            Super.call(self);

            var _serverTypeToClientType = new BASE.collections.Hashmap();
            var _typeUri = new BASE.collections.Hashmap();
            var _host = null;
            var _ajaxProvider = new LG.AjaxProvider("", "");

            var makeDto = function (entity) {
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
            var convertToJavascriptDTO = function (dto) {
                var DTO = {};

                for (var x in dto) {
                    var objX = x;

                    if (x.substr(0, 2) !== x.substr(0, 2).toUpperCase()) {
                        objX = x.substr(0, 1).toLowerCase() + x.substring(1);
                    }

                    if (typeof dto[x] === "object" && dto[x] !== null) {
                        DTO[objX] = convertToJavascriptDTO(dto[x]);
                    } else {
                        DTO[objX] = dto[x];
                    }
                }

                return DTO;
            }

            self.convertToJavascriptDto = convertToJavascriptDTO;
            self.convertToServerDto = makeDto;

            self.serverTypeToClientType = _serverTypeToClientType;
            self.typeUri = _typeUri;
            self.setHost = function (host) {
                var index = host.lastIndexOf("/");
                if (index === host.length - 1) {
                    _host = host.substr(0, host.length - 1);
                } else {
                    _host = host;
                }
            };
            self.getHost = function () {
                return _host;
            };

            var createExecuteFuture = function (queryable, provider, baseUrl, oldExecute) {
                return new BASE.async.Future(function (setValue, setError) {
                    provider.baseUrl = baseUrl;

                    oldExecute.call(provider, queryable).then(function (dtos) {
                        var convertedDtos = [];

                        dtos.forEach(function (dto) {
                            convertedDtos.push(convertToJavascriptDTO(dto));
                        });

                        setValue(convertedDtos);
                    }).ifError(function (e) {
                        setError(self.createError(e));
                    });
                });
            };

            var createCountFuture = function (queryable, provider, baseUrl, oldCount) {
                return new BASE.async.Future(function (setValue, setError) {
                    provider.baseUrl = baseUrl;

                    oldCount.call(provider, queryable).then(function (count) {
                        setValue(count);
                    }).ifError(function (e) {
                        setError(e);
                    });
                });
            };

            self.createError = function (error, entity) {
                var data;
                data = error.xhr.responseText ? JSON.parse(error.xhr.responseText) : {};
                var err;

                // I really hate this, but its comparing primitives and is only in one place.
                if (error.xhr.status == 401) {
                    err = new BASE.data.UnauthorizedError("Unauthorized");
                } else if (error.xhr.status === 403) {
                    err = new BASE.data.ForbiddenError(data.Message);
                } else if (error.xhr.status === 404) {
                    err = new BASE.data.EntityNotFoundError("File Not Found", entity);
                } else if (error.xhr.status == 0) {
                    err = new BASE.data.NetworkError("Network Error");
                }

                return err;
            };


            self.getSetProvider = function () {
                var self = this;
                var provider = new ApiProvider(self.ajaxProvider.defaultHeaders["X-LGAppId"], self.ajaxProvider.defaultHeaders["X-LGToken"]);

                var oldExecute = provider.execute;
                var oldCount = provider.count;

                provider.execute = function (queryable) {
                    var Type = queryable.Type;
                    var directory = _typeUri.get(Type);
                    var baseUrl = self.host + directory;

                    if (!directory) {
                        throw new Error("Couldn't find a directory for specified Type. " + Type);
                    }

                    if (!self.host) {
                        throw new Error("Need to set the \"host\" property before invoking a load.");
                    }

                    return createExecuteFuture(queryable, provider, baseUrl, oldExecute);

                };

                provider.count = function (queryable) {
                    var Type = queryable.Type;
                    var directory = _typeUri.get(Type);
                    var baseUrl = self.host + directory;

                    if (!directory) {
                        throw new Error("Couldn't find a directory for specified Type. " + Type);
                    }

                    if (!self.host) {
                        throw new Error("Need to set the \"host\" property before invoking a load.");
                    }

                    return createCountFuture(queryable, provider, baseUrl, oldCount);
                };

                return provider;
            };

            self.getTargetProvider = function (entity, property) {
                var self = this;

                var provider = new ApiProvider(self.ajaxProvider.defaultHeaders["X-LGAppId"], self.ajaxProvider.defaultHeaders["X-LGToken"]);

                var oldExecute = provider.execute;
                var oldCount = provider.count;

                // This is horrendous! Change this from being a hack.
                provider.execute = function (queryable) {
                    var Type = queryable.Type;
                    var directory = _typeUri.get(Type);
                    var baseUrl = self.host + entity[property]._uri;

                    if (!directory) {
                        throw new Error("Couldn't find a directory for specified Type. " + Type);
                    }

                    if (!self.host) {
                        throw new Error("Need to set the \"host\" property before invoking a load.");
                    }

                    return createExecuteFuture(queryable, provider, baseUrl, oldExecute);
                };

                provider.count = function (queryable) {
                    var Type = queryable.Type;
                    var directory = _typeUri.get(Type);
                    var baseUrl = self.host + entity[property]._uri;

                    if (!directory) {
                        throw new Error("Couldn't find a directory for specified Type. " + Type);
                    }

                    if (!self.host) {
                        throw new Error("Need to set the \"host\" property before invoking a load.");
                    }

                    return createCountFuture(queryable, provider, baseUrl, oldCount);
                };

                return provider;
            };

            self.addEntity = function (entity) {
                var Type = entity.constructor;
                var url = _typeUri.get(Type);
                var dto = makeDto(entity);
                return new BASE.async.Future(function (setValue, setError) {
                    if (url) {
                        var settings = {
                            type: "POST",
                            data: JSON.stringify(dto)
                        };

                        self.ajaxProvider.ajax(self.host + url, settings).then(function (response) {
                            var data = response.data;
                            if (data && data.Error) {
                                var err = new BASE.data.ValidationError(new Error(data.Message), data.ValidationErrors);
                                setError(err);
                            } else {
                                var response = new BASE.data.AddedResponse(response.message, convertToJavascriptDTO(data.Data));
                                setValue(response);
                            }
                        }).ifError(function (error) {
                            setError(self.createError(error));
                        });
                    } else {
                        throw new Error("Could not find url for this type.");
                    }
                });


            };


            self.updateEntity = function (entity, updates) {
                var Type = entity.constructor;
                var url = _typeUri.get(Type) + "/" + entity.id;

                var updateObject = {};
                updates.getKeys().forEach(function (key) {
                    updateObject[key] = updates.get(key);
                });

                return new BASE.async.Future(function (setValue, setError) {
                    if (url) {
                        var dto = makeDto(updateObject);
                        var settings = {
                            type: "PATCH",
                            data: JSON.stringify(dto)
                        };

                        self.ajaxProvider.ajax(self.host + url, settings).then(function (response) {
                            var data = response.data;
                            if (data && data.Error) {
                                var err = new BASE.data.ValidationError(data.Message, data.ValidationErrors);
                                setError(err);
                            } else {
                                var response = new BASE.data.UpdatedResponse(data.Message, data);
                                setValue(response);
                            }
                        }).ifError(function (error) {
                            setError(self.createError(error, entity));
                        });
                    } else {
                        setValue({});
                    }
                });

            };

            self.removeEntity = function (entity) {
                var self = this;
                var Type = entity.constructor;
                var url = _typeUri.get(Type) + "/" + (entity.id || "");
                return new BASE.async.Future(function (setValue, setError) {
                    if (url) {
                        var dto = makeDto(entity);
                        var settings = {
                            type: "DELETE",
                            data: JSON.stringify(dto)
                        };

                        self.ajaxProvider.ajax(self.host + url, settings).then(function (response) {
                            var data = response.data;
                            if (data && data.Error) {
                                entity.id = null;
                                var err = new BASE.data.ErrorResponse(data.Message);
                                setError(err);
                            } else {
                                var response = new BASE.data.RemovedResponse(data.Message);
                                setValue(response);
                            }
                        }).ifError(function (error) {
                            setError(self.createError(error, entity));
                        });
                    } else {
                        setValue({});
                    }
                });
            };

            self.logIn = function (username, factors) {
                var self = this;

                throw new Error("This method isn't implemented yet.");

                return BASE.async.Future(function (setValue, setError) {
                    var dto = {
                        username: username,
                        Factors: factors
                    };

                    var settings = {
                        type: "POST",
                        data: JSON.stringify(dto)
                    };

                    self.ajaxProvider.ajax(_host + "/Login", settings).then(function (response) {

                    }).ifError(function (error) {

                    });
                });

            };

            self.getTypeForDto = function (dto) {
                var Type = _serverTypeToClientType.get(dto._type);
                if (Type === null) {
                    //console.warn("Couldn't find Type for dto: " + JSON.stringify(dto));
                    Type = BASE.behaviors.data.Entity;
                }
                return Type;

            };

            return self;

        };

        BASE.extend(Service, Super);

        return Service;
    }(BASE.util.Observable));
});