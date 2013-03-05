BASE.require(["BASE.Query", "BASE.ODataExpressionParser"], function () {
    BASE.ODataQuery = (function (Super) {
        var ODataQuery = function (filter) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ODataQuery(filter);
            }

            Super.call(self, filter);

            self.toString = function (Type) {
                var expressions = self.getExpressions(Type);
                var parser = new BASE.ODataExpressionParser();
                var where = parser.parse(expressions.where);
                var orderBy = parser.parse(expressions.orderBy);

                var result = "";
                result += where ? "$filter=" + where : "";
                result += orderBy ? " &$orderby=" + orderBy : "";
                return result !== "" ? "?" + result : result;
            };
        };

        BASE.extend(ODataQuery, Super);

        return ODataQuery;
    }(BASE.Query));

});