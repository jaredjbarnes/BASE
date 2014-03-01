BASE.require([
    "BASE.query.Provider",
    "BASE.query.ArrayQueryBuilder",
    "BASE.query.Queryable",
    "BASE.query.ExpressionParser",
    "BASE.async.Future",
    "BASE.async.Task"
], function () {
    BASE.namespace("LEAVITT.query");

    var ArrayQueryBuilder = BASE.query.ArrayQueryBuilder;
    var ExpressionParser = BASE.query.ExpressionParser;
    var Queryable = BASE.query.Queryable;
    var Provider = BASE.query.Provider;
    var Future = BASE.async.Future;

    BASE.query.ArrayProvider = (function (Super) {
        var ArrayProvider = function (array) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ArrayProvider(array);
            }

            Super.call(self, array);

            self.toArray = function (queryable) {
                var self = this;
                return new Future(function (setValue, setError) {
                    var Type = queryable.Type;
                    var builder = new ArrayQueryBuilder(array.slice(0));
                    var parser = new ExpressionParser(builder);

                    var expression = queryable.getExpression();

                    parser.parse(expression.where);
                    parser.parse(expression.skip);
                    parser.parse(expression.take);
                    parser.parse(expression.orderBy);

                    setTimeout(function () {
                        setValue(builder.getValue());
                    }, 0);
                });
            };

            self.execute = self.toArray;
        };

        BASE.extend(ArrayProvider, Super);

        return ArrayProvider;
    }(BASE.query.Provider));

});