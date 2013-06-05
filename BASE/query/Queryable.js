BASE.require([
    "Object",
    "BASE.query.Expression",
    "BASE.query.ExpressionBuilder"
], function () {
    BASE.namespace("BASE.query");

    var Expression = BASE.query.Expression;
    var ExpressionBuilder = BASE.query.ExpressionBuilder;

    BASE.query.Queryable = (function (Super) {
        var Queryable = function (Type) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Queryable(Type);
            }

            Super.call(self);

            var _provider = null;
            Object.defineProperty(self, "provider", {
                get: function () {
                    return _provider;
                },
                set: function (value) {
                    var oldValue = _provider;
                    if (value !== _provider) {
                        if (_provider && _provider.queryable === self) {
                            _provider.queryable = null;
                        }

                        _provider = value;
                        _provider.queryable = self;
                    }
                }
            });

            var _whereExpression = null;
            Object.defineProperty(self, "expression", {
                get: function () {
                    return {
                        where: _whereExpression,
                        take: _takeExpression,
                        skip: _skipExpression,
                        orderBy: _orderByExpression.length === 0 ? null : Expression.orderBy.apply(Expression, _orderByExpression)
                    }
                }
            });

            var _where = function (fn) {
                fn = fn || function () { };
                var expression = fn.call(self, new ExpressionBuilder(Type));

                if (!(expression instanceof Expression)) {
                    return self;
                }

                if (_whereExpression === null) {
                    _whereExpression = Expression.where(expression);
                } else {
                    throw new Error("Cannot call \"where\" twice.");
                }
                return self;
            };

            var _or = function (fn) {
                fn = fn || function () { };
                var rightExpression = fn.call(self, new ExpressionBuilder(Type));

                if (_whereExpression) {
                    _whereExpression = Expression.or.apply(Expression, [_whereExpression, rightExpression]);
                } else {
                    _whereExpression = rightExpression;
                }

                return self;
            };

            var _and = function (fn) {
                fn = fn || function () { };
                var rightExpression = fn.call(self, new ExpressionBuilder(Type));

                if (!(rightExpression instanceof Expression)) {
                    throw new Error("");
                }

                if (_whereExpression) {
                    _whereExpression = Expression.or.apply(Expression, [_whereExpression, rightExpression]);
                } else {
                    _whereExpression = rightExpression;
                }

                return self;
            };

            var _takeExpression = null;
            var _take = function (value) {
                if (_takeExpression === null) {
                    _takeExpression = Expression.take(Expression.constant(value));
                } else {
                    throw new Error("Cannot call \"take\" twice.");
                }
                return self;
            };

            var _skipExpression = null;
            var _skip = function (value) {
                if (_skipExpression === null) {
                    _skipExpression = Expression.skip(Expression.constant(value));
                } else {
                    throw new Error("Cannot call \"skip\" twice.");
                }
                return self;
            };

            var _orderByExpression = [];
            var _orderByDesc = function (fn) {
                _orderByExpression.push(Expression.descending(Expression.property(fn.call(self, new ExpressionBuilder(Type)).toString())));
                return self;
            };

            var _orderBy = function (fn) {
                _orderByExpression.push(Expression.ascending(Expression.property(fn.call(self, new ExpressionBuilder(Type)).toString())));
                return self;
            };

            var _toGuid = function (value) {
                return Expression.guid(Expression.constant(value));
            };

            var _execute = function () {
                if (_provider === null) {
                    throw new Error("The queryable needs a provider property.");
                } else {
                    return _provider.execute(self.expression);
                }
            };

            Object.defineProperties(self, {
                toGuid: {
                    enumerable: false,
                    configurable: false,
                    value: _toGuid
                },
                where: {
                    enumerable: false,
                    configurable: false,
                    value: _where
                },
                or: {
                    enumerable: false,
                    configurable: false,
                    value: _or
                },
                and: {
                    enumerable: false,
                    configurable: false,
                    value: _and
                },
                take: {
                    enumerable: false,
                    configurable: false,
                    value: _take
                },
                skip: {
                    enumerable: false,
                    configurable: false,
                    value: _skip
                },
                orderBy: {
                    enumerable: false,
                    configurable: false,
                    value: _orderBy
                },
                orderByDesc: {
                    enumerable: false,
                    configurable: false,
                    value: _orderBy
                },
                execute: {
                    enumerable: false,
                    configurable: false,
                    value: _execute
                }
            });


            return self;
        };

        BASE.extend(Queryable, Super);

        return Queryable;
    }(Object));
});