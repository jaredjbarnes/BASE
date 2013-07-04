BASE.require([
    "Object",
    "BASE.query.Expression",
    "BASE.query.ExpressionBuilder"
], function () {
    BASE.namespace("BASE.query");

    var Expression = BASE.query.Expression;
    var ExpressionBuilder = BASE.query.ExpressionBuilder;

    BASE.query.Queryable = (function (Super) {
        var Queryable = function (Type, expression) {
            var self = this;
            var expression = expression || {};

            if (!(self instanceof arguments.callee)) {
                return new Queryable(Type, expression);
            }

            Super.call(self);

            var _Type = null;
            Object.defineProperty(self, "Type", {
                get: function () {
                    return Type;
                }
            });

            var _provider = null;
            Object.defineProperty(self, "provider", {
                get: function () {
                    return _provider;
                },
                set: function (value) {
                    var oldValue = _provider;
                    if (value !== _provider) {
                        _provider = value;
                    }
                }
            });

            var _whereExpression = expression.where || null;
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
                var rightExpression;

                if (fn instanceof Expression) {
                    rightExpression = Expression.or.apply(Expression, arguments);
                } else {
                    fn = fn || function () { };
                    rightExpression = fn.call(self, new ExpressionBuilder(Type));
                }

                if (_whereExpression) {
                    var expressions = _whereExpression.children;
                    expressions.push(rightExpression);

                    _whereExpression = Expression.where(Expression.or.apply(Expression, expressions));
                } else {
                    _whereExpression = Expression.where(rightExpression);
                }

                return self;
            };

            var _and = function (fn) {
                if (fn instanceof Expression) {
                    rightExpression = Expression.and.apply(Expression, arguments);
                } else {
                    fn = fn || function () { };
                    rightExpression = fn.call(self, new ExpressionBuilder(Type));
                }

                if (_whereExpression) {
                    var expressions = _whereExpression.children;
                    expressions.push(rightExpression);

                    _whereExpression = Expression.where(Expression.and.apply(Expression, expressions));
                } else {
                    _whereExpression = Expression.where(rightExpression);
                }

                return self;
            };

            var _takeExpression = expression.take || null;
            var _take = function (value) {
                if (_takeExpression === null) {
                    _takeExpression = Expression.take(Expression.constant(value));
                } else {
                    throw new Error("Cannot call \"take\" twice.");
                }
                return self;
            };

            var _skipExpression = expression.skip || null;
            var _skip = function (value) {
                if (_skipExpression === null) {
                    _skipExpression = Expression.skip(Expression.constant(value));
                } else {
                    throw new Error("Cannot call \"skip\" twice.");
                }
                return self;
            };

            var _orderByExpression = expression.orderBy ? expression.orderBy.children : [];
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
                /// <summary>Executes the queryable.</summary>
                /// <returns type="BASE.Future"></returns>
                if (_provider === null) {
                    throw new Error("The queryable needs a provider property.");
                } else {
                    return _provider.execute(self.expression);
                }
            };

            var _toArray = function () {
                /// <summary>Executes the queryable.</summary>
                /// <returns type="BASE.Future"></returns>
                return _provider.execute(self);
            };

            var _count = function () {
                return _provider.count(self);
            };

            var _all = function () {
                return _provider.all(self);
            };

            var _any = function () {
                return _provider.any(self);
            };

            var _firstOrDefault = function () {
                return _provider.firstOrDefault(self);
            };

            var _lastOrDefault = function () {
                return _provider.lastOrDefault(self);
            };

            var _first = function () {
                return _provider.first(self);
            };

            var _last = function () {
                return _provider.last(self);
            };

            var _copy = function () {
                var queryable = new Queryable(Type, self.expression);
                return queryable;
            };

            var _merge = function (queryable) {
                var whereChildren = queryable.expression.where.children;
                var rightExpression = Expression.and.apply(Expression, whereChildren);
                if (_whereExpression) {
                    var expressions = _whereExpression.children;
                    expressions.push(rightExpression);

                    _whereExpression = Expression.where(Expression.and.apply(Expression, expressions));
                } else {
                    _whereExpression = Expression.where(rightExpression);
                }

                return self;
            }

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
                merge: {
                    enumerable: false,
                    configurable: false,
                    value: _merge
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
                all: {
                    enumerable: false,
                    configurable: false,
                    value: _all
                },
                any: {
                    enumerable: false,
                    configurable: false,
                    value: _any
                },
                first: {
                    enumerable: false,
                    configurable: false,
                    value: _first
                },
                last: {
                    enumerable: false,
                    configurable: false,
                    value: _last
                },
                firstOrDefault: {
                    enumerable: false,
                    configurable: false,
                    value: _firstOrDefault
                },
                lastOrDefault: {
                    enumerable: false,
                    configurable: false,
                    value: _lastOrDefault
                },
                count: {
                    enumerable: false,
                    configurable: false,
                    value: _count
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
                toArray: {
                    enumerable: false,
                    configurable: false,
                    value: _toArray
                },
                copy: {
                    enumerable: false,
                    configurable: false,
                    value: _copy
                }
            });


            return self;
        };

        BASE.extend(Queryable, Super);

        var q = new Queryable();

        return Queryable;
    }(Object));
});