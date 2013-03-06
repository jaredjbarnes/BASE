BASE.require(["BASE.query.Query", "BASE.query.ExpressionParser", "BASE.query.ArrayInterpreter"], function () {

    BASE.namespace("BASE.query");

    BASE.query.ArrayQuery = (function (Super) {
        var ArrayQuery = function (filter) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ArrayQuery(filter);
            }

            Super.call(self, filter);

        };

        BASE.extend(ArrayQuery, Super);

        ArrayQuery.prototype.run = function (Type, array) {
            var self = this;
            var expressions = self.getExpressions(Type);
            var parser = new BASE.query.ExpressionParser();
            parser.interpreter = new BASE.query.ArrayInterpreter(array || []);

            parser.parse(expressions.where);
            parser.parse(expressions.orderBy);
            parser.parse(expressions.skip);
            parser.parse(expressions.take);
            return parser.interpreter.filteredArray;
            
        };

        return ArrayQuery;
    }(BASE.query.Query));

});