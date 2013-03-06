BASE.require(["BASE.Query", "BASE.ExpressionParser", "BASE.ODataInterpreter"], function () {
    BASE.ODataQuery = (function (Super) {
        var ODataQuery = function (filter) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ODataQuery(filter);
            }

            Super.call(self, filter);

        };

        BASE.extend(ODataQuery, Super);

        ODataQuery.prototype.toString = function (Type) {
            var self = this;
            var expressions = self.getExpressions(Type);
            var parser = new BASE.ExpressionParser();
            parser.interpreter = new BASE.ODataInterpreter();

            var where = parser.parse(expressions.where);
            var orderBy = parser.parse(expressions.orderBy);
            var take = parser.parse(expressions.take);
            var skip = parser.parse(expressions.skip);

            var result = "";
            result += where ? "$filter=" + where : "";
            result += orderBy ? " &$orderby=" + orderBy : "";
            result += take ? " &$top=" + take : "";
            result += skip ? " &$skip=" + skip : "";
            return result !== "" ? "?" + result : result;
        };

        ODataQuery.prototype.run = ODataQuery.prototype.toString;

        return ODataQuery;
    }(BASE.Query));

});