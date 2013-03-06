BASE.require(["BASE.Observable"], function () {
    BASE.namespace("BASE");

    BASE.Expression = (function (Super) {
        var Expression = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Expression();
            }

            Super.call(self);

            Object.defineProperties(self, {
                "nodeName": {
                    enumerable: true,
                    configurable: true,
                    get: function () {
                        return "expression";
                    }
                }
            });

            return self;
        };

        var ValueExpression = ((function (Super) {
            var ValueExpression = function (nodeName, value) {
                var self = this;
                if (!(self instanceof arguments.callee)) {
                    return new ValueExpression();
                }

                Super.call(self);

                var _value = value;

                Object.defineProperties(self, {
                    "nodeName": {
                        enumerable: true,
                        configurable: true,
                        get: function () {
                            return nodeName;
                        }
                    },
                    "value": {
                        enumerable: true,
                        configurable: true,
                        get: function () {
                            return _value;
                        }
                    }
                });

                return self;
            };
            BASE.extend(ValueExpression, Super);
            return ValueExpression;
        })(Expression));

        var OperationExpression = ((function (Super) {
            var OperationExpression = function (nodeName) {
                var self = this;
                Super.call(self);

                var _children = Array.prototype.slice.call(arguments, 1);

                Object.defineProperties(self, {
                    "nodeName": {
                        enumerable: true,
                        configurable: true,
                        get: function () {
                            return nodeName;
                        }
                    },
                    "children": {
                        enumerable: true,
                        configurable: true,
                        get: function () {
                            return _children;
                        }
                    }
                });

                return self;
            };
            BASE.extend(OperationExpression, Super);
            return OperationExpression;
        })(Expression));

        Expression.property = function (value) {
            return new ValueExpression("property", value);
        };

        Expression.constant = function (value) {
            return new ValueExpression("constant", value);
        };

        Expression.equal = function () {
            var expression = new OperationExpression("equal");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        };

        Expression.notEqual = function () {
            var expression = new OperationExpression("notEqual");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        };

        Expression.or = function () {
            var expression = new OperationExpression("or");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        };

        Expression.and = function () {
            var expression = new OperationExpression("and");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        };

        Expression.where = function () {
            var expression = new OperationExpression("where");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        };

        Expression.greaterThan = function () {
            var expression = new OperationExpression("greaterThan");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        };
        Expression.lessThan = function () {
            var expression = new OperationExpression("lessThan");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        };

        Expression.greaterThanOrEqual = function () {
            var expression = new OperationExpression("greaterThanOrEqual");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        };

        Expression.lessThanOrEqual = function () {
            var expression = new OperationExpression("lessThanOrEqual");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        };

        Expression.orderBy = function () {
            var expression = new OperationExpression("orderBy");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        };

        Expression.descending = function () {
            var expression = new OperationExpression("descending");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        };

        Expression.ascending = function () {
            var expression = new OperationExpression("ascending");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        };

        Expression.skip = function () {
            var expression = new OperationExpression("skip");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        };

        Expression.take = function () {
            var expression = new OperationExpression("take");
            Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
                expression.children.push(arg);
            });
            return expression;
        };

        BASE.extend(Expression, Super);

        return Expression;
    }(BASE.Observable));
});