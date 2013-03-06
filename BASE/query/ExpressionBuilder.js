BASE.require(["BASE.Observable", "BASE.query.Expression"], function () {
    BASE.namespace("BASE.query");

    BASE.query.ExpressionBuilder = (function (Super) {
        var ExpressionBuilder = function (Type, namespace) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ExpressionBuilder(Type, namespace);
            }

            Super.call(self);

            var Expression = BASE.query.Expression;

            var findExpressionType = function (value) {
                if (value instanceof BASE.query.Expression) {
                    return value;
                } if (typeof value === "string") {
                    return Expression.string(Expression.constant(value));
                } else if (typeof value === "number") {
                    return Expression.number(Expression.constant(value));
                } else if (typeof value === null) {
                    return Expression["null"](Expression.constant(value));
                } else if (typeof value === undefined) {
                    return Expression["undefined"](Expression.constant(value));
                } else if (Array.isArray(value)) {
                    returnExpression.array(Expression.constant(value));
                } else {
                    return Expression.object(Expression.constant(value));
                }
            }

            self.equals = function (value) {
                var property = Expression.property(namespace);
                var constant = findExpressionType(value);
                return Expression.equal(property, constant);
            };

            self.notEqualTo = function (value) {
                var property = Expression.property(namespace);
                var constant = findExpressionType(value);
                return Expression.notEqual(property, constant);
            };

            self.greaterThan = function (value) {
                var property = Expression.property(namespace);
                var constant = findExpressionType(value);
                return Expression.greaterThan(property, constant);
            };

            self.lessThan = function (value) {
                var property = Expression.property(namespace);
                var constant = findExpressionType(value);
                return Expression.lessThan(property, constant);
            };

            self.greaterThanOrEqualTo = function (value) {
                var property = Expression.property(namespace);
                var constant = findExpressionType(value);
                return Expression.greaterThanOrEqual(property, constant);
            };

            self.lessThanOrEqualTo = function (value) {
                var property = Expression.property(namespace);
                var constant = findExpressionType(value);
                return Expression.lessThanOrEqual(property, constant);
            };

            self.not = function (expression) {
                // ????
            };

            var mapping;
            if (typeof Type === "function") {
                mapping = new Type();
            } else {
                mapping = Type;
            }

            for (var property in mapping) (function (property) {
                Object.defineProperty(self, property, {
                    get: function () {
                        var ChildType;
                        if (mapping[property] === null) {
                            ChildType = Object;
                        } else {
                            if (typeof Type === "function") {
                                ChildType = mapping[property].constructor;
                            } else {
                                mapping[property];
                            }
                        }

                        var expressionBuilder = new ExpressionBuilder(ChildType, (namespace ? (namespace + ".") : "") + property);
                        return expressionBuilder;
                    }
                });
            }(property));

            self.toString = function () {
                return namespace;
            };

            return self;
        };

        BASE.extend(ExpressionBuilder, Super);

        return ExpressionBuilder;
    }(BASE.Observable));
});