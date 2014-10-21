BASE.require([
    "BASE.query.Provider",
    "BASE.query.ArrayVisitor",
    "BASE.query.Queryable",
    "BASE.async.Future",
    "BASE.async.Task",
    "BASE.web.ajax"
], function () {
    BASE.namespace("BASE.query");
    
    var ArrayVisitor = BASE.query.ArrayVisitor;
    var Queryable = BASE.query.Queryable;
    var Provider = BASE.query.Provider;
    var Future = BASE.async.Future;
    var defaultAjax = BASE.web.ajax;
    
    BASE.query.ODataProvider = (function (Super) {
        
        var ODataProvider = function (config) {
            var self = this;
            BASE.assertNotGlobal(self);
            
            Super.call(self);
            
            config = config || {};
            var endPoint = config.endPoint || null;
            var model = config.model || { properties: {} };
            var headers = config.headers || {};
            var ajax = config.ajax || defaultAjax;
            
            if (endPoint === null) {
                throw new Error("Provider needs a endPoint.");
            }
            
            self.count = function (queryable) {
                var expression = queryable.getExpression();
                return new Future(function (setValue, setError) {
                    var visitor = new ODataVisitor(model);
                    
                    var where = "";
                    var take = "";
                    var skip = "";
                    var orderBy = "";
                    var atIndex = 0;
                    
                    if (expression.where) {
                        where = visitor.parse(expression.where);
                    }
                    
                    if (expression.skip) {
                        skip = visitor.parse(expression.skip);
                        atIndex = expression.skip.children[0].value;
                    }
                    
                    if (expression.orderBy) {
                        orderBy = visitor.parse(expression.orderBy);
                    }
                    
                    var odataString = where + "&$top=0" + orderBy;
                    var url = BASE.concatPaths(self.baseUrl, "?" + odataString + "&$inlinecount=allpages");
                    
                    var settings = {
                        headers: headers
                    };
                    
                    ajax.GET(url + skip, settings).then(function (ajaxResponse) {
                        setValue(ajaxResponse.data.Count);
                    }).ifError(function (e) {
                        setError(e);
                    });
                });
            };
            
            self.execute = self.toArray = function (queryable) {
                var expression = queryable.getExpression();
                var visitor = new ODataVisitor();
                var dtos = [];
                
                var where = "";
                var take = "";
                var skip = "";
                var orderBy = "";
                var defaultTake = 100;
                var atIndex = 0;
                
                if (expression.where) {
                    where = visitor.parse(expression.where);
                }
                
                if (expression.skip) {
                    skip = visitor.parse(expression.skip);
                    atIndex = expression.skip.children[0].value;
                }
                
                if (expression.take) {
                    take = visitor.parse(expression.take);
                    defaultTake = expression.take.children[0].value
                }
                
                if (expression.orderBy) {
                    orderBy = visitor.parse(expression.orderBy);
                }
                
                return new Future(function (setValue, setError) {
                    
                    var odataString = where + take + orderBy;
                    var url = BASE.concatPaths(self.baseUrl, "?" + odataString + "&$inlinecount=allpages");
                    
                    ajax.GET(url, {
                        headers: headers
                    }).then(function (ajaxResponse) {
                        dtos = ajaxResponse.data.Data;
                        
                        if (ajaxResponse.data.Error) {
                            setError(new Error(ajaxResponse.data.message));
                        } else {
                            
                            // return the dtos we have all of the dtos, otherwise get the rest.
                            if (dtos.length === ajaxResponse.data.Count) {
                                setValue(dtos);
                            } else {
                                var task = new Task();
                                var collectionCount = ajaxResponse.data.Count;
                                for (x = dtos.length; (atIndex + x) < collectionCount && x < defaultTake ; x += ajaxResponse.data.Data.length) {
                                    task.add(ajax.GET(url + "&$skip=" + (atIndex + x), settings));
                                }
                                
                                task.start().whenAll(function (futures) {
                                    futures.forEach(function (future) {
                                        var data = future.value.data;
                                        
                                        // This handles xhr errors.
                                        if (future.error) {
                                            var err = future.error;
                                            setError(err);
                                            return;
                                        }
                                        
                                        // The server may not return a data object.
                                        if (!data) {
                                            setValue(dtos);
                                            return;
                                        }
                                        
                                        //This handles server errors.
                                        if (data.Error) {
                                            setError(data.Error);
                                            return false;
                                        } else {
                                            data.Data.forEach(function (item) {
                                                if (dtos.length < defaultTake) {
                                                    dtos.push(item);
                                                }
                                            });
                                        }
                                    });
                                    
                                    setValue(dtos);
                                });
                            }
                        }

                    }).ifError(setError);
                });
            };
        };
        
        BASE.extend(ODataProvider, Super);
        
        return ODataProvider;
    }(BASE.query.Provider));

});