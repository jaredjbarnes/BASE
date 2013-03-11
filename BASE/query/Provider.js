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

            var _Interpreter = Object;
            var _Builder = BASE.query.ExpressionBuilder;
            var _Queryable = BASE.query.Queryable;

            self.createInterpreter = function () {
                return new _Interpreter();
            };
            self.createBuilder = function () {
                return new _Builder(Type);
            };
            self.createQueryable = function () {
                return new _Queryable();
            };

            self.execute = function (filter) {
                var builder = self.createBuilder();
                var queryable = self.createQueryable();
                var query = new BASE.query.Query(filter, builder, queryable);
                var queryable = query.run(Type);
                var parser = new BASE.query.ExpressionParser();
                parser.interpreter = self.createInterpreter();
                var expressions = [];

                queryable.expression.children.forEach(function (expression) {
                    expressions[expression.nodeName] = parser.parse(expression);
                });

                return {
                    expressions: expressions,
                    interpreter: parser.interpreter,
                    builder: builder,
                    queryable: queryable
                };
            };
        };

        BASE.extend(Provider, Super);

        return Provider;
    }(BASE.Observable));

});