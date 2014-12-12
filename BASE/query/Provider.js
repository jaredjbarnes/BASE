BASE.require([
    "BASE.async.Future",
    "BASE.query.ArrayVisitor",
    "BASE.query.ExpressionBuilder",
    "BASE.query.Expression"
], function () {
    BASE.namespace("BASE.query");
    
    var Future = BASE.async.Future;
    var ExpressionBuilder = BASE.query.ExpressionBuilder;
    var ArrayVisitor = BASE.query.ArrayVisitor;
    var Expression = BASE.query.Expression;
    
    BASE.query.Provider = (function (Super) {
        var Provider = function () {
            var self = this;
            
            Super.call(self);
            
            var executeFilter = function (queryable, func) {
                return new Future(function (setValue, setError) {
                    self.toArray(queryable).then(function (array) {
                        var visitor = new ArrayVisitor(array);
                        var results;
                        
                        if (typeof func === "function") {
                            var whereExpression = Expression.where(func.call(self, new ExpressionBuilder(self.Type)));
                            var filter = visitor.parse(whereExpression);
                            results = array.filter(filter);
                        } else {
                            results = array;
                        }
                        
                        setValue(results);
                    });
                }).then();
            };
            
            self.count = function (queryable) {
                return new Future(function (setValue, setError) {
                    self.toArray(queryable).then(function (array) {
                        setValue(array.length);
                    });
                });
            };
            
            self.any = function (queryable, func) {
                return new Future(function (setValue, setError) {
                    queryable = queryable.take(1);
                    executeFilter(queryable, func).then(function (results) {
                        if (results.length > 0) {
                            setValue(true);
                        } else {
                            setValue(false);
                        }
                    });
                });
            };
            
            self.all = function (queryable, func) {
                return new Future(function (setValue, setError) {
                    executeFilter(queryable, func).then(function (results) {
                        setValue(results.length === array.length);
                    });
                });
            };
            
            self.firstOrDefault = function (queryable, func) {
                return new Future(function (setValue, setError) {
                    queryable = queryable.take(1);
                    executeFilter(queryable, func).then(function (results) {
                        setValue(results[0] || null);
                    });
                });
            };
            
            self.lastOrDefault = function (queryable, func) {
                return new Future(function (setValue, setError) {
                    self.count(queryable).then(function (count) {
                        if (count > 0) {
                            queryable = queryable.skip(count - 1).take(1);
                            executeFilter(queryable, func).then(function (results) {
                                setValue(results[0]);
                            });
                        } else {
                            setError(null);
                        }
                    });
                });
            };
            
            self.first = function (queryable, func) {
                return new Future(function (setValue, setError) {
                    queryable = queryable.take(1);
                    executeFilter(queryable, func).then(function (results) {
                        var result = results[0];
                        
                        if (result) {
                            setValue(result);
                        } else {
                            setError(new Error("Couldn't find a match."));
                        }
                    });
                });
            };
            
            self.last = function (queryable, func) {
                return new Future(function (setValue, setError) {
                    self.count(queryable).then(function (count) {
                        if (count > 0) {
                            queryable = queryable.skip(count - 1).take(1);
                            executeFilter(queryable, func).then(function (results) {
                                setValue(results[0]);
                            });
                        } else {
                            setError(new Error("Couldn't find a match."));
                        }
                    });
                });
            };
            
            self.contains = function (queryable, func) {
                return new Future(function (setValue, setError) {
                    executeFilter(queryable, func).then(function (results) {
                        setValue(results > 0);
                    });
                });
            };
            
            self.select = function (queryable, forEachFunc) {
                return new Future(function (setValue, setError) {
                    self.toArray(queryable).then(function (array) {
                        var objects = [];
                        
                        array.forEach(function (item) {
                            objects.push(forEachFunc(item));
                        });
                        
                        setValue(objects);
                    });
                });
            };
            
            self.include = function (queryable, func) {
                return new Future(function (setValue, setError) {
                    queryable.toArray().then(function (results) {
                        // This is probably not a great idea to be here, but we need it now.
                        var builder = new ExpressionBuilder(queryable.Type);
                        var propertyExpression = func.call(queryable, builder);

                    }).ifError(setError);
                });
            };
            
            self.intersects = function (queryable, compareToQueryable) {
                return new Future(function (setValue, setError) {
                    var task = new BASE.async.Task();
                    task.add(self.toArray(queryable));
                    task.add(compareToQueryable.toArray());
                    task.start().whenAll(function (futures) {
                        var intersects = [];
                        var array1 = futures[0].value;
                        var array2 = futures[1].value;
                        
                        array1.forEach(function (item) {
                            if (array2.indexOf(item) > -1) {
                                intersects.push(item);
                            }
                        });
                        
                        setValue(intersects);
                    });
                });
            };
            
            self.toArray = function (queryable) {
                return new BASE.async.Future(function (setValue, setError) {
                    setTimeout(function () {
                        setValue([]);
                    }, 0);
                });
            };
            
            //This should always return a Future of an array of objects.
            self.execute = self.toArray;
        };
        
        BASE.extend(Provider, Super);
        
        return Provider;
    }(Object));

});