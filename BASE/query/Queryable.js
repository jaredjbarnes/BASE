BASE.require(["BASE.Observable", "BASE.query.Expression", "BASE.Hashmap"], function () {
    BASE.namespace("BASE.query");

    BASE.query.Queryable = (function (Super) {
        var Queryable = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Queryable();
            }

            Super.call(self);

            var _whereExpression = null;
            var _orderByExpression = null;
            var _skipExpression = null;
            var _takeExpression = null;
            var _provider = null;
            var _expressions = [];
            var Expression = BASE.query.Expression;

            Object.defineProperties(self, {
                "expression": {
                    get: function () {
                        return Expression.and.apply(Expression, _expressions);
                    }
                }
            });

            self.toGuid = function (value) {
                return Expression.guid(Expression.constant(value));
            };

            self.where = function () {
                _expressions.push(Expression.where.apply(Expression, arguments));
                return this;
            };
            self.and = function () {
                return Expression.and.apply(Expression, arguments);
            };
            self.or = function () {
                return Expression.or.apply(Expression, arguments);
            };
            self.orderBy = function () {
                var ascendingAndDescending = [];
                var args = Array.prototype.slice.call(arguments, 0);

                args.forEach(function (expression) {
                    if (expression.nodeName === "ascending" || expression.nodeName === "descending") {
                        ascendingAndDescending.push(expression);
                    }
                });

                _expressions.push(Expression.orderBy.apply(Expression, ascendingAndDescending));
                return this;
            };
            self.descending = function (expression) {
                return Expression.descending.call(Expression, Expression.constant(expression.toString()));
            };
            self.ascending = function (expression) {
                return Expression.ascending.call(Expression, Expression.constant(expression.toString()));
            };
            self.take = function (value) {
                _expressions.push(Expression.take.call(Expression, Expression.constant(value)));
                return this;
            };
            self.skip = function (value) {
                _expressions.push(Expression.skip.call(Expression, Expression.constant(value)));
                return this;
            };
            self.load = function (namespace, id) {
                var nConstant = Expression.constant(namespace.toString());
                var idConstant = Expression.constant(id);
                _expressions.push(Expression.load(nConstant, idConstant));
                return this;
            };

            return self;
        };

        BASE.extend(Queryable, Super);

        return Queryable;
    }(BASE.Observable));
});