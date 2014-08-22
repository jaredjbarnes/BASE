BASE.require([
    "BASE.query.ExpressionVisitor",
    "BASE.query.Expression",
    "BASE.query.ArrayVisitor",
    "BASE.collections.Hashmap"
], function () {
    BASE.namespace("BASE.query");

    var Hashmap = BASE.collections.Hashmap;
    var Expression = BASE.query.Expression;
    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var arrayVisitor = new BASE.query.ArrayVisitor([]);

    BASE.query.QueryableVisitor = (function (Super) {
        var QueryableVisitor = function (queryable, config) {
            var self = this;
            BASE.assertNotGlobal(self);

            Super.call(self);

            self.ascending = function (namespace) {

            };

            self.descending = function (namespace) {

            };

            self.orderBy = function (expression) {

            };

            self.greaterThan = function (left, right) {
                return new Future(function (setValue, setError) {
                    queryable.where(function (e) {
                        return e.property(left).isGreaterThan(right);
                    }).toArray(function (array) {
                        setValue(array);
                    });
                });
            };

            self.lessThan = function (left, right) {
                return new Future(function (setValue, setError) {
                    queryable.where(function (e) {
                        return e.property(left).isLessThan(right);
                    }).toArray(function (array) {
                        setValue(array);
                    });
                });
            };

            self.greaterThanOrEqualTo = function (left, right) {
                return new Future(function (setValue, setError) {
                    queryable.where(function (e) {
                        return e.property(left).isGreaterThanOrEqualTo(right);
                    }).toArray(function (array) {
                        setValue(array);
                    });
                });
            };

            self.lessThanOrEqualTo = function (left, right) {
                return new Future(function (setValue, setError) {
                    queryable.where(function (e) {
                        return e.property(left).isLessThanOrEqualTo(right);
                    }).toArray(function (array) {
                        setValue(array);
                    });
                });
            };

            self.startsWith = function (left, right) {
                return new Future(function (setValue, setError) {
                    queryable.where(function (e) {
                        return e.property(left).startsWith(right);
                    }).toArray(function (array) {
                        setValue(array);
                    });
                });

            };

            self.endsWith = function (left, right) {
                return new Future(function (setValue, setError) {
                    queryable.where(function (e) {
                        return e.property(left).endsWith(right);
                    }).toArray(function (array) {
                        setValue(array);
                    });
                });
            };

            self.substringOf = function (left, right) {
                return new Future(function (setValue, setError) {
                    queryable.where(function (e) {
                        return e.property(left).isSubstringOf(right);
                    }).toArray(function (array) {
                        setValue(array);
                    });
                });
            };

            self.equalTo = function (left, right) {
                return new Future(function (setValue, setError) {
                    queryable.where(function (e) {
                        return e.property(left).isEqualTo(right);
                    }).toArray(function (array) {
                        setValue(array);
                    });
                });
            };

            self.notEqualTo = function (left, right) {
                return new Future(function (setValue, setError) {
                    queryable.where(function (e) {
                        return e.property(left).isNotEqualTo(right);
                    }).toArray(function (array) {
                        setValue(array);
                    });
                });
            };

            self.and = function () {
                var args = Array.prototype.slice.call(arguments, 0);

                return new Future(function (setValue, setError) {
                    var task = new Task();
                    task.add.apply(task, args);
                    task.start().whenAll(function (futures) {
                        arrays = futures.map(function (future) {
                            return future.value;
                        });

                        setValue(arrayVisitor.and.apply(null, arrays));
                    });
                });
            };

            self.where = function () {
                return self.and.apply(self, arguments);
            };

            self.or = function () {
                var args = Array.prototype.slice.call(arguments, 0);

                return new Future(function (setValue, setError) {
                    var task = new Task();
                    task.add.apply(task, args);
                    task.start().whenAll(function (futures) {
                        arrays = futures.map(function (future) {
                            return future.value;
                        });

                        setValue(arrayVisitor.or.apply(null, arrays));
                    });
                });
            };

            self.any = function (property, expression) {
                throw new Error("Visitor doesn't support any.");
            };

            self.all = function (property, expression) {
                throw new Error("Visitor doesn't support all.");
            };

            self.expression = function (expression) {
                return value;
            };

            self.string = function (expression) {
                return expression.value;
            };

            self.constant = function (expression) {
                return expression.value;
            };

            self.property = function (expression) {
                return expression.value;
            };

            self.guid = function (expression) {
                return expression.value;
            };

            self["null"] = function (expression) {
                return expression.value;
            };

            self["undefined"] = function (expression) {
                return expression.value;
            };

            self.number = function (expression) {
                return expression.value;
            };

            self.object = function (expression) {
                return expression.value;
            };

            self.date = function (expression) {
                return expression.value;
            };

            self["function"] = function (value) {
                return Expression.function(value);
            };

            self.boolean = function (value) {
                return Expression.boolean(value);
            };

            self.array = function (value) {
                return Expression.array(value);
            };

            self.skip = function (valueExpression) {
                queryable = queryable.skip(valueExpression.value);
            };

            self.take = function (valueExpression) {
                queryable = queryable.take(valueExpression.value);
            };

            return self;
        };

        BASE.extend(QueryableVisitor, Super);

        return QueryableVisitor;
    }(BASE.query.ExpressionVisitor));
});

