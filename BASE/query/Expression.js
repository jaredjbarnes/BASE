BASE.require(["BASE.Observable"], function () {
    BASE.namespace("BASE.query");

    BASE.query.Expression = (function (Super) {
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



        BASE.extend(Expression, Super);

        return Expression;
    }(BASE.Observable));

    var Expression = BASE.query.Expression;

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
            if (!(self instanceof arguments.callee)) {
                return new OperationExpression();
            }
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

    BASE.query.OperationExpression = OperationExpression;
    BASE.PropertyExpression = ValueExpression;


    Expression.getExpressionType = function (value) {
        if (value instanceof BASE.query.Expression) {
            return value;
        } if (typeof value === "string") {
            return Expression.string(Expression.constant(value));
        } else if (typeof value === "number") {
            return Expression.number(Expression.constant(value));
        } else if (typeof value === "boolean") {
            return Expression.boolean(Expression.constant(value));
        } else if (value === null) {
            return Expression["null"](Expression.constant(value));
        } else if (typeof value === undefined) {
            return Expression["undefined"](Expression.constant(value));
        } else if (Array.isArray(value)) {
            returnExpression.array(Expression.constant(value));
        } else {
            return Expression.object(Expression.constant(value));
        }
    };

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

    Expression.guid = function () {
        var expression = new OperationExpression("guid");
        Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
            expression.children.push(arg);
        });
        return expression;
    };

    Expression.substring = function () {
        var expression = new OperationExpression("substring");
        Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
            expression.children.push(arg);
        });
        return expression;
    };

    Expression.substringOf = function () {
        var expression = new OperationExpression("substringOf");
        Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
            expression.children.push(arg);
        });
        return expression;
    };

    Expression.boolean = function () {
        var expression = new OperationExpression("boolean");
        Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
            expression.children.push(arg);
        });
        return expression;
    };

    Expression.string = function () {
        var expression = new OperationExpression("string");
        Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
            expression.children.push(arg);
        });
        return expression;
    };

    Expression.number = function () {
        var expression = new OperationExpression("number");
        Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
            expression.children.push(arg);
        });
        return expression;
    };

    Expression.object = function () {
        var expression = new OperationExpression("object");
        Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
            expression.children.push(arg);
        });
        return expression;
    };

    Expression["null"] = function () {
        var expression = new OperationExpression("null");
        Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
            expression.children.push(arg);
        });
        return expression;
    };

    Expression["undefined"] = function () {
        var expression = new OperationExpression("undefined");
        Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
            expression.children.push(arg);
        });
        return expression;
    };

    Expression.array = function () {
        var expression = new OperationExpression("array");
        Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
            expression.children.push(arg);
        });
        return expression;
    };

    Expression.startsWith = function () {
        var expression = new OperationExpression("startsWith");
        Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
            expression.children.push(arg);
        });
        return expression;
    };

    Expression.endsWith = function () {
        var expression = new OperationExpression("endsWith");
        Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
            expression.children.push(arg);
        });
        return expression;
    };
});