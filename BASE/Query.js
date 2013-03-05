BASE.require(["BASE.Observable", "BASE.Queryable", "BASE.ExpressionBuilder"], function () {

    BASE.Query = (function () {
        var Query = function (filter) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Query(filter);
            }

            self.getExpressions = function (Type) {
                var expressions = [];

                var builder = new BASE.ExpressionBuilder(Type);
                var queryable = new BASE.Queryable();

                filter.call(queryable, builder);

                return {
                    "where": queryable.whereExpression,
                    "orderBy": queryable.orderByExpression,
                    "take": queryable.takeExpression,
                    "skip": queryable.skipExpression
                }
            };
        };

        return Query;
    }());

});