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

            self.Type = Type || Object;

            self.provider = null;

            self.whereExpression = expression.where || null;

            self.getExpression = function() {
                return {
                    where: self.whereExpression,
                    take: self.takeExpression,
                    skip: self.skipExpression,
                    orderBy: self.orderByExpression.length === 0 ? null : Expression.orderBy.apply(Expression, self.orderByExpression)
                };
            };

            self.where = function (fn) {
                fn = fn || function () { };
                var expression = fn.call(null, new ExpressionBuilder(Type));

                if (!(expression instanceof Expression)) {
                    return self;
                }

                if (self.whereExpression === null) {
                    self.whereExpression = Expression.where(expression);
                } else {
                    throw new Error("Cannot call \"where\" twice.");
                }
                return self;
            };

            self.or = function (fn) {
                var rightExpression;

                if (fn instanceof Expression) {
                    rightExpression = Expression.or.apply(Expression, arguments);
                } else {
                    fn = fn || function () { };
                    rightExpression = fn.call(ExpressionBuilder, new ExpressionBuilder(Type));
                }

                if (self.whereExpression) {
                    var expressions = self.whereExpression.children;
                    expressions.push(rightExpression);

                    self.whereExpression = Expression.where(Expression.or.apply(Expression, expressions));
                } else {
                    self.whereExpression = Expression.where(rightExpression);
                }

                return self;
            };

            self.and = function (fn) {
                if (fn instanceof Expression) {
                    rightExpression = Expression.and.apply(Expression, arguments);
                } else {
                    fn = fn || function () { };
                    rightExpression = fn.call(ExpressionBuilder, new ExpressionBuilder(Type));
                }

                if (self.whereExpression) {
                    var expressions = self.whereExpression.children;
                    expressions.push(rightExpression);

                    self.whereExpression = Expression.where(Expression.and.apply(Expression, expressions));
                } else {
                    self.whereExpression = Expression.where(rightExpression);
                }

                return self;
            };

            self.takeExpression = expression.take || null;
            self.take = function (value) {
                var expression = copyExpressionObject(self.getExpression());
                expression.take = Expression.take(Expression.constant(value));
                var copy = createCopy(expression);

                return copy;
            };

            self.skipExpression = expression.skip || null;
            self.skip = function (value) {
                var expression = copyExpressionObject(self.getExpression());
                expression.skip = Expression.skip(Expression.constant(value));

                var copy = createCopy(expression);

                return copy;
            };

            self.orderByExpression = expression.orderBy ? expression.orderBy.children : [];
            self.orderByDesc = function (fn) {
                var expression = copyExpressionObject(self.getExpression());

                var orderBy = { children: [] };
                self.orderByExpression.forEach(function (expression) {
                    orderBy.children.push(expression.copy());
                });

                orderBy.children.push(Expression.descending(Expression.property(fn.call(self, new ExpressionBuilder(Type)).toString())));

                expression.orderBy = orderBy;

                var copy = createCopy(expression);

                return copy;
            };

            self.orderBy = function (fn) {
                var expression = copyExpressionObject(self.getExpression());

                var orderBy = { children: [] };
                self.orderByExpression.forEach(function (expression) {
                    orderBy.children.push(expression.copy());
                });

                orderBy.children.push(Expression.ascending(Expression.property(fn.call(self, new ExpressionBuilder(Type)).toString())));

                expression.orderBy = orderBy;

                var copy = createCopy(expression);

                return copy;

            };

            self.toGuid = function (value) {
                return Expression.guid(Expression.constant(value));
            };

            self.toArray = function (callback) {
                var future = self.provider.execute(self);
                if (typeof callback === "function") {
                    future.then(callback);
                }

                return future;
            };

            self.count = function () {
                return self.provider.count(self);
            };

            self.all = function (func) {
                return self.provider.all(self, func);
            };

            self.any = function (func) {
                return self.provider.any(self, func);
            };

            self.firstOrDefault = function (func) {
                return self.provider.firstOrDefault(self, func);
            };

            self.lastOrDefault = function (func) {
                return self.provider.lastOrDefault(self, func);
            };

            self.first = function (func) {
                return self.provider.first(self, func);
            };

            self.last = function (func) {
                return self.provider.last(self, func);
            };

            self.select = function (forEachFunc) {
                return self.provider.select(self, forEachFunc);
            };

            self.contains = function (item) {
                return self.provider.contains(self, item);
            };

            self.include = function () {
                return self.provider.include(self, item);
            };

            self.ifNone = function (callback) {
                self.count().then(function (count) {
                    if (count === 0) {
                        callback();
                    }
                });

                return self;
            };

            self.ifAny = function (callback) {
                self.toArray(function (a) {
                    if (a.length > 0) {
                        callback(a);
                    }
                });

                return self;
            };

            self.intersects = function (compareToQueryable) {
                if (compareToQueryable instanceof Array) {
                    compareToQueryable = compareToQueryable.asQueryable();
                }
                return self.provider.intersects(self, compareToQueryable);
            };

            self.ofType = function (Type) {
                var queryable = new Queryable(Type);
                queryable.provider = self.provider;
                return queryable;
            };

            var createCopy = function (expression) {
                var queryable = new Queryable(Type, expression);
                queryable.provider = self.provider;
                return queryable;
            };

            var copyExpressionObject = function (expressionObject) {
                var expression = {};
                Object.keys(expressionObject).forEach(function (key) {
                    var value = expressionObject[key];
                    if (value) {
                        expression[key] = value.copy();
                    } else {
                        expression[key] = null;
                    }
                });

                return expression;
            };

            self.copy = function () {
                return createCopy(self.getExpression());
            };

            self.merge = function (queryable) {
                var whereChildren = queryable.getExpression().where.children;
                var rightExpression = Expression.and.apply(Expression, whereChildren);
                if (self.whereExpression) {
                    var expressions = self.whereExpression.children;
                    expressions.push(rightExpression);

                    self.whereExpression = Expression.where(Expression.and.apply(Expression, expressions));
                } else {
                    self.whereExpression = Expression.where(rightExpression);
                }

                return self;
            };


            return self;
        };

        BASE.extend(Queryable, Super);

        return Queryable;
    }(Object));
});