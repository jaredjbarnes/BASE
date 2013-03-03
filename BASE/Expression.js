BASE.require(["BASE.Observable"], function () {
    BASE.namespace("BASE");





    BASE.Expression = (function (Super) {
        var Expression = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Expression();
            }

            Super.call(self);

            var _left = null

            Object.defineProperties(self, {
                "left": {
                    get: function () { },
                    set: function () { }
                },
                "right": {
                    get: function () { },
                    set: function () { }
                }
            });

            return self;
        };

        Expression.property = function () { };
        Expression.constant = function () { };
        Expression.invoke = function () { };
        Expression.equal = function () { };
        Expression.notEqual = function () { };
        Expression.orElse = function () { };
        Expression.and = function () { };
        Expression.greaterThan = function () { };
        Expression.lessThan = function () { };
        Expression.greaterThanOrEqual = function () { };
        Expression.lessThanOrEqual = function () { };
        Expression.

        BASE.extend(Expression, Super);

        return Expression;
    }(BASE.Observable));
});