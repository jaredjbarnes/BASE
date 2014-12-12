BASE.require([
    "BASE.query.Provider",
    "BASE.query.ArrayVisitor",
    "BASE.query.Queryable",
    "BASE.async.Future",
    "BASE.async.Task"
], function () {
    BASE.namespace("BASE.query");

    var ArrayVisitor = BASE.query.ArrayVisitor;
    var Queryable = BASE.query.Queryable;
    var Provider = BASE.query.Provider;
    var Future = BASE.async.Future;

    BASE.query.ArrayProvider = (function (Super) {
        var ArrayProvider = function (array) {
            var self = this;
            BASE.assertNotGlobal(self);

            Super.call(self, array);

            self.toArray = function (queryable) {
                var self = this;
                return new Future(function (setValue, setError) {
                    var Type = queryable.Type;
                    var visitor = new ArrayVisitor();

                    var expression = queryable.getExpression();

                    var filter = null;
                    var sort = null;
                    var skip = 0;
                    var take = null;
                    var results = null;

                    if (expression.where !== null) {
                        filter = visitor.parse(expression.where);
                    }

                    if (expression.orderBy !== null) {
                        sort = visitor.parse(expression.orderBy);
                    }

                    if (expression.skip !== null) {
                        skip = expression.skip.children[0].value;
                    }

                    if (expression.take !== null) {
                        take = expression.take.children[0].value;
                    }

                    if (filter) {
                        results = array.filter(filter);
                    } else {
                        results = array.slice(0);
                    }

                    if (sort) {
                        results = results.sort(sort);
                    }

                    if (take === null) {
                        take = undefined;
                    } else {
                        take = skip + take;
                    }

                    results = results.slice(skip, take);

                    setTimeout(function () {
                        setValue(results);
                    }, 0);
                });
            };

            self.execute = self.toArray;
        };

        BASE.extend(ArrayProvider, Super);

        return ArrayProvider;
    }(BASE.query.Provider));

});