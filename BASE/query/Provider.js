BASE.require([
    "BASE.query.Query",
    "BASE.query.ExpressionParser",
    "BASE.query.ExpressionBuilder",
    "BASE.query.Queryable"
], function () {
    BASE.namespace("LEAVITT.query");

    BASE.query.Provider = (function (Super) {
        var Provider = function (Type) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Provider(Type);
            }

            Super.call(self);

            var _QueryBuilder = Object;
            var _Builder = BASE.query.ExpressionBuilder;
            var _Queryable = BASE.query.Queryable;

            self.createQueryBuilder = function () {
                return new _QueryBuilder();
            };
            self.createExpressionBuilder = function () {
                return new _Builder(Type);
            };
            self.createQueryable = function () {
                return new _Queryable();
            };

            self.execute = function (filter) {
                var builder = self.createExpressionBuilder();
                var queryable = self.createQueryable();
                var query = new BASE.query.Query(filter, builder, queryable);
                query.run(Type);

                var parser = new BASE.query.ExpressionParser();
                parser.queryBuilder = self.createQueryBuilder();
                var expressions = [];

                queryable.expression.children.forEach(function (expression) {
                    expressions[expression.nodeName] = parser.parse(expression);
                });

                return {
                    expressions: expressions,
                    queryBuilder: parser.queryBuilder,
                    builder: builder,
                    queryable: queryable
                };
            };
        };

        BASE.extend(Provider, Super);

        return Provider;
    }(BASE.Observable));

});