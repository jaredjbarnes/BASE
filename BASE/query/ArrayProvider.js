BASE.require([
    "BASE.query.Provider",
    "BASE.query.ArrayQueryBuilder",
    "BASE.query.Queryable",
    "BASE.query.ExpressionParser",
    "BASE.Future"
], function () {
    BASE.namespace("LEAVITT.query");

    var ArrayQueryBuilder = BASE.query.ArrayQueryBuilder;
    var ExpressionParser = BASE.query.ExpressionParser;
    var Queryable = BASE.query.Queryable;
    var Provider = BASE.query.Provider;
    var Future = BASE.Future;

    BASE.query.ArrayProvider = (function (Super) {
        var ArrayProvider = function (array) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ArrayProvider(array);
            }

            Super.call(self, array);

            self.count = function (queryable) {
                return new Future(function (setValue, setError) {
                    self.toArray(queryable).then(function (array) {
                        setValue(array.length);
                    });
                });
            };

            self.any = function (queryable) {
                return new Future(function (setValue, setError) {
                    self.toArray(queryable).then(function (array) {
                        setValue(array.length > 0);
                    });
                });
            };

            self.all = function (queryable) {
                return new Future(function (setValue, setError) {
                    self.toArray(queryable).then(function (result) {
                        setValue(array.length === result.length);
                    });
                });
            };

            self.firstOrDefault = function (queryable) {
                return new Future(function (setValue, setError) {
                    self.toArray(queryable).then(function (array) {
                        setValue(array[0] || null);
                    });
                });
            };

            self.lastOrDefault = function (queryable) {
                return new Future(function (setValue, setError) {
                    self.toArray(queryable).then(function (array) {
                        setValue(array[array.length - 1] || null);
                    });
                });
            };

            self.last = function (queryable) {
                return new Future(function (setValue, setError) {
                    self.toArray(queryable).then(function (array) {
                        if (array.length === 0) {
                            setError(Error("Out of range error."));
                        }

                        setValue(array[array.length - 1]);
                    });
                });

            };

            self.first = function (queryable) {
                return new Future(function (setValue, setError) {

                    self.toArray(queryable).then(function (array) {
                        if (array.length === 0) {
                            setError(Error("Out of range error."));
                        }

                        setValue(array[0]);
                    });

                });
            };

            self.toArray = function (queryable) {
                var self = this;
                return new Future(function (setValue, setError) {
                    var Type = queryable.Type;
                    var builder = new ArrayQueryBuilder(array);
                    var parser = new ExpressionParser(builder);

                    parser.parse(queryable.expression.where);
                    parser.parse(queryable.expression.skip);
                    parser.parse(queryable.expression.take);
                    parser.parse(queryable.expression.orderBy);

                    setTimeout(function () {
                        setValue(builder.value);
                    }, 0);
                });
            };

            self.execute = self.toArray;
        };

        BASE.extend(ArrayProvider, Super);

        return ArrayProvider;
    }(BASE.query.Provider));

});