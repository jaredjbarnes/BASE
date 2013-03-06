BASE.require(["BASE.Observable", "BASE.query.Queryable", "BASE.query.ExpressionBuilder"], function () {
    BASE.namespace("BASE.query");

    BASE.query.Query = (function () {
        var Query = function (filter) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Query(filter);
            }

            self.getExpressions = function (Type) {
                var expressions = [];

                var builder = new BASE.query.ExpressionBuilder(Type);
                var queryable = new BASE.query.Queryable();

                try {
                    filter.call(queryable, builder);
                } catch(e){
                    throw new Error("Invalid where clause.");
                }
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