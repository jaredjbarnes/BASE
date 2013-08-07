BASE.require([
    "BASE.async.Future",
    "BASE.async.Task",
    "BASE.query.ExpressionParser",
    "BASE.query.ExpressionBuilder",
    "BASE.query.ODataQueryBuilder",
], function () {

    BASE.namespace("BASE.query");

    var ExpressionBuilder = BASE.query.ExpressionBuilder;
    var ExpressionParser = BASE.query.ExpressionParser;
    var ODataQueryBuilder = BASE.query.ODataQueryBuilder;
    var Future = BASE.async.Future;
    var Task = BASE.async.Task;

    BASE.query.odata = {
        toString: function (queryable) {
            var expression = queryable.expression;
            var parser = new ExpressionParser(new ODataQueryBuilder());

            var where = "";
            var take = "";
            var skip = "";
            var orderBy = "";

            if (expression.where) {
                where = parser.parse(expression.where);
            }

            if (expression.skip) {
                skip = parser.parse(expression.skip);
                atIndex = expression.skip.children[0].value;
            }

            if (expression.take) {
                take = parser.parse(expression.take);
                defaultTake = expression.take.children[0].value
            }

            if (expression.orderBy) {
                orderBy = parser.parse(expression.orderBy);
            }

            return where + skip + take + orderBy;
        }
    };

});