BASE.require(["BASE.util.Observable"], function () {
    BASE.namespace("BASE.query");

    BASE.query.Expression = (function (Super) {
        var Expression = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Expression();
            }

            Super.call(self);

            self.nodeName = "expression";

            self.copy = function () {
                throw new Error("Meant to be overriden");
            };

            return self;
        };

        BASE.extend(Expression, Super);

        return Expression;
    }(Object));

    var Expression = BASE.query.Expression;

    var ValueExpression = ((function (Super) {
        var ValueExpression = function (nodeName, value) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ValueExpression();
            }

            Super.call(self);

            self.value = value;
            self.nodeName = nodeName;

            self.copy = function () {
                return new ValueExpression(nodeName, self.value);
            };

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

            self.nodeName = nodeName;
            self.children = Array.prototype.slice.call(arguments, 1);

            self.copy = function () {
                var children = [];
                var copy = new OperationExpression(self.nodeName);

                self.children.forEach(function (expression) {
                    copy.children.push(expression.copy());
                });

                return copy;
            };

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
        }

        if (typeof value === "string") {
            return Expression.string(value);
        } else if (typeof value === "function") {
            return Expression["function"](value);
        } else if (typeof value === "number") {
            return Expression.number(value);
        } else if (typeof value === "boolean") {
            return Expression.boolean(value);
        } else if (value === null) {
            return Expression["null"](value);
        } else if (typeof value === "undefined") {
            return Expression["undefined"](value);
        } else if (Array.isArray(value)) {
            return Expression.array(value);
        } else if (value instanceof Date) {
            return Expression.date(value);
        } else {
            return Expression.object(value);
        }
    };

    Expression.property = function (value) {
        return new ValueExpression("property", value);
    };

    Expression.constant = function (value) {
        return new ValueExpression("constant", value);
    };

    //
    // ValueExpression helpers
    //

    Expression.boolean = function (value) {
        var expression = new ValueExpression("boolean");
        expression.value = value;
        return expression;
    };

    Expression.string = function (value) {
        var expression = new ValueExpression("string");
        expression.value = value;
        return expression;
    };

    Expression.number = function (value) {
        var expression = new ValueExpression("number");
        expression.value = value;
        return expression;
    };

    Expression.object = function (value) {
        var expression = new ValueExpression("object");
        expression.value = value;
        return expression;
    };

    Expression.date = function (value) {
        var expression = new ValueExpression("date");
        expression.value = value;
        return expression;
    };

    Expression["function"] = function (value) {
        var expression = new ValueExpression("function");
        expression.value = value;
        return expression;
    };

    Expression["null"] = function (value) {
        var expression = new ValueExpression("null");
        expression.value = value;
        return expression;
    };

    Expression["undefined"] = function (value) {
        var expression = new ValueExpression("undefined");
        expression.value = value;
        return expression;
    };

    Expression.array = function (value) {
        var expression = new ValueExpression("array");
        expression.value = value;
        return expression;
    };

    //
    // OperationExpression helpers
    //

    Expression.equalTo = function () {
        var expression = new OperationExpression("equalTo");
        Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
            expression.children.push(arg);
        });
        return expression;
    };

    Expression.notEqualTo = function () {
        var expression = new OperationExpression("notEqualTo");
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

    Expression.greaterThanOrEqualTo = function () {
        var expression = new OperationExpression("greaterThanOrEqualTo");
        Array.prototype.slice.call(arguments, 0).forEach(function (arg) {
            expression.children.push(arg);
        });
        return expression;
    };

    Expression.lessThanOrEqualTo = function () {
        var expression = new OperationExpression("lessThanOrEqualTo");
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

    Expression.any = function (Type, namespace, expression) {
        var anyExpression = new OperationExpression("any");
        var ofTypeExpression = new ValueExpression("ofType", Type);
        var propertyExpression = new ValueExpression("property", namespace);

        anyExpression.children.push(ofTypeExpression, propertyExpression, expression);

        return anyExpression;
    };

    Expression.all = function (Type, namespace, expression) {
        var allExpression = new OperationExpression("all");
        var ofTypeExpression = new ValueExpression("ofType", Type);
        var propertyExpression = new ValueExpression("property", namespace);

        allExpression.children.push(ofTypeExpression, propertyExpression, expression);

        return allExpression;
    };

    Expression.contains = function (Type, namespace, expression) {
        var containsExpression = new OperationExpression("contains");
        var ofTypeExpression = new ValueExpression("ofType", Type);
        var propertyExpression = new ValueExpression("property", namespace);

        containsExpression.children.push(ofTypeExpression, propertyExpression, expression);

        return containsExpression;
    };

    Expression.intersects = function (Type, namespace, expression) {
        var intersectsExpression = new OperationExpression("intersects");
        var ofTypeExpression = new ValueExpression("ofType", Type);
        var propertyExpression = new ValueExpression("property", namespace);

        intersectsExpression.children.push(ofTypeExpression, propertyExpression, expression);

        return intersectsExpression;
    };

});