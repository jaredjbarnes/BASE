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

            var _Type = Type || Object;
            Object.defineProperty(self, "Type", {
                enumerable: false,
                get: function () {
                    return _Type;
                },
                set: function (value) {
                    if (value !== _Type) {
                        _Type = value;
                    }
                }
            });

            var _provider = null;
            Object.defineProperty(self, "provider", {
                enumerable: false,
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
                enumerable: false,
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
                var expression = fn.call(ExpressionBuilder, new ExpressionBuilder(Type));

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
                    rightExpression = fn.call(ExpressionBuilder, new ExpressionBuilder(Type));
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
                    rightExpression = fn.call(ExpressionBuilder, new ExpressionBuilder(Type));
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
                /// <summary>Executes the queryable on the provider.</summary>
                /// <returns type="BASE.Future"></returns>
                return _provider.execute(self);
            };

            var _count = function () {
                return _provider.count(self);
            };

            var _all = function (func) {
                return _provider.all(self, func);
            };

            var _any = function (func) {
                return _provider.any(self, func);
            };

            var _firstOrDefault = function (func) {
                return _provider.firstOrDefault(self, func);
            };

            var _lastOrDefault = function (func) {
                return _provider.lastOrDefault(self, func);
            };

            var _first = function (func) {
                return _provider.first(self, func);
            };

            var _last = function (func) {
                return _provider.last(self, func);
            };

            var _select = function (forEachFunc) {
                return _provider.select(self, forEachFunc);
            };

            var _contains = function (item) {
                return _provider.contains(self, item);
            };

            var _include = function () {
                return _provider.include(self, item);
            };

            var _intersects = function (compareToQueryable) {
                if (compareToQueryable instanceof Array) {
                    compareToQueryable = compareToQueryable.asQueryable();
                }
                return _provider.intersects(self, compareToQueryable);
            };

            var _ofType = function (Type) {
                var queryable = new Queryable(Type);
                queryable.provider = _provider;
                return queryable;
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
                select: {
                    enumerable: false,
                    configurable: false,
                    value: _select
                },
                contains: {
                    enumerable: false,
                    configurable: false,
                    value: _contains
                },
                intersects: {
                    enumerable: false,
                    configurable: false,
                    value: _intersects
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
                ofType: {
                    enumerable: false,
                    configurable: false,
                    value: _ofType
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