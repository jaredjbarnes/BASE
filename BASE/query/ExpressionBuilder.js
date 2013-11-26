BASE.require([
    "BASE.util.Observable",
    "BASE.query.Expression",
], function () {
    BASE.namespace("BASE.query");



    var Expression = BASE.query.Expression;

    var ArrayExpressionBuilder = function (Type, namespace) {
        var self = this;

        self.any = function (func) {
            func = func || function () { };
            var expression = func.call(ExpressionBuilder, new ExpressionBuilder(Type));

            Expression.any(Type, namespace, expression)
        };

        self.all = function (func) {
            func = func || function () { };
            var expression = func.call(ExpressionBuilder, new ExpressionBuilder(Type));

            Expression.all(Type, namespace, expression)
        };

        self.contains = function (func) {
            func = func || function () { };
            var expression = func.call(ExpressionBuilder, new ExpressionBuilder(Type));

            Expression.contains(Type, namespace, expression)
        };

        self.intersects = function (func) {
            func = func || function () { };
            var expression = func.call(ExpressionBuilder, new ExpressionBuilder(Type));

            Expression.intersects(Type, namespace, expression)
        };
    };

    BASE.query.ExpressionBuilder = (function (Super) {
        var ExpressionBuilder = function (Type, namespace) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ExpressionBuilder(Type, namespace);
            }

            Super.call(self);
            namespace = namespace || "";

            var findExpressionType = Expression.getExpressionType;

            self.equals = function (value) {
                var property = Expression.property(namespace);
                var constant = Expression.getExpressionType(value);
                return Expression.equal(property, constant);
            };

            self.notEqualTo = function (value) {
                var property = Expression.property(namespace);
                var constant = Expression.getExpressionType(value);
                return Expression.notEqual(property, constant);
            };

            self.greaterThan = function (value) {
                var property = Expression.property(namespace);
                var constant = Expression.getExpressionType(value);
                return Expression.greaterThan(property, constant);
            };

            self.lessThan = function (value) {
                var property = Expression.property(namespace);
                var constant = Expression.getExpressionType(value);
                return Expression.lessThan(property, constant);
            };

            self.greaterThanOrEqualTo = function (value) {
                var property = Expression.property(namespace);
                var constant = Expression.getExpressionType(value);
                return Expression.greaterThanOrEqual(property, constant);
            };

            self.lessThanOrEqualTo = function (value) {
                var property = Expression.property(namespace);
                var constant = Expression.getExpressionType(value);
                return Expression.lessThanOrEqual(property, constant);
            };

            self.substring = function (value) {
                return Expression.equal(Expression.substring(Expression.property(namespace)), Expression.getExpressionType(value));
            };

            self.substringOf = function (value) {
                return Expression.substringOf(Expression.property(namespace), Expression.string(value));
            };

            self.startsWith = function (value) {
                return Expression.startsWith(Expression.property(namespace), Expression.string(value));
            }

            self.endsWith = function (value) {
                return Expression.endsWith(Expression.property(namespace), Expression.string(value));
            }

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
                        if (mapping[property] === null || typeof mapping[property] === "undefined") {
                            ChildType = Object;
                        } else {
                            if (typeof Type === "function") {
                                ChildType = mapping[property].constructor;
                            } else {
                                ChildType = mapping[property];
                            }
                        }

                        var expressionBuilder;
                        if (Array.isArray(mapping[property]) && (typeof mapping[property].Type === "function")) {
                            expressionBuilder = new ArrayExpressionBuilder(mapping[property].Type, property);
                        } else {
                            expressionBuilder = new ExpressionBuilder(ChildType, (namespace ? (namespace + ".") : "") + property);
                        }

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

        var _and = function () {
            return Expression.and.apply(Expression, arguments);
        }

        var _or = function () {
            return Expression.or.apply(Expression, arguments);
        }

        Object.defineProperties(ExpressionBuilder, {
            "and": {
                enumerable: false,
                configurable: false,
                value: _and
            },
            "or": {
                enumerable: false,
                configurable: false,
                value: _or
            }
        });

        return ExpressionBuilder;
    }(Object));
});