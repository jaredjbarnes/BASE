BASE.require(["BASE.query.Expression"], function () {
    var Expression = BASE.query.Expression;

    BASE.namespace("BASE.query");

    var OperationExpressionBuilder = function (propertyName, setExpression) {
        var self = this;

        setExpression = setExpression || function (expression) {
            return expression;
        };

        self.any = function (fn) {
            var expressionBuilder = new ExpressionBuilder();
            var expression = fn(expressionBuilder);
            return setExpression(Expression.any(propertyName, expression));
        };

        self.all = function (fn) {
            var expressionBuilder = new ExpressionBuilder();
            var expression = fn(expressionBuilder);
            return setExpression(Expression.all(propertyName, expression));
        };

        self.isEqualTo = function (value) {
            var property = Expression.property(propertyName);
            var constant = Expression.getExpressionType(value);
            return setExpression(Expression.equalTo(property, constant));
        };

        self.isNotEqualTo = function (value) {
            var property = Expression.property(propertyName);
            var constant = Expression.getExpressionType(value);
            return setExpression(Expression.notEqualTo(property, constant));
        };

        self.contains = function (value) {
            return setExpression(Expression.substringOf(Expression.property(propertyName), Expression.string(value)));
        }

        self.isSubstringOf = function (value) {
            console.warn("isSubstringOf is deprecated, please us contains.");
            return setExpression(Expression.substringOf(Expression.property(propertyName), Expression.string(value)));
        };

        self.isGreaterThan = function (value) {
            var property = Expression.property(propertyName);
            var constant = Expression.getExpressionType(value);
            return setExpression(Expression.greaterThan(property, constant));
        };

        self.isGreaterThanOrEqualTo = function (value) {
            var property = Expression.property(propertyName);
            var constant = Expression.getExpressionType(value);
            return setExpression(Expression.greaterThanOrEqualTo(property, constant));
        };

        self.isLessThanOrEqualTo = function (value) {
            var property = Expression.property(propertyName);
            var constant = Expression.getExpressionType(value);
            return setExpression(Expression.lessThanOrEqualTo(property, constant));
        };

        self.isLessThan = function (value) {
            var property = Expression.property(propertyName);
            var constant = Expression.getExpressionType(value);
            return setExpression(Expression.lessThan(property, constant));
        };

        self.endsWith = function (value) {
            return setExpression(Expression.endsWith(Expression.property(propertyName), Expression.string(value)));
        };

        self.startsWith = function (value) {
            return setExpression(Expression.startsWith(Expression.property(propertyName), Expression.string(value)));
        };

        self.property = function (value) {
            return new OperationExpressionBuilder(value, function (expression) {
                return Expression.propertyAccess(propertyName, expression);
            });
        };

        self.getPropertyName = function () {
            return propertyName;
        };

    };

    var ExpressionBuilder = function () {
        var self = this;
        BASE.assertNotGlobal(self);

        self.property = function (property) {
            return new OperationExpressionBuilder(property);
        };

        self.and = function () {
            return Expression.and.apply(Expression, arguments);
        };

        self.or = function () {
            return Expression.or.apply(Expression, arguments);
        };

        self.any = function (fn) {
            var expressionBuilder = new ExpressionBuilder();
            var expression = fn(expressionBuilder);
            return setExpression(Expression.any("", expression));
        };

        self.all = function () {
            var expressionBuilder = new ExpressionBuilder();
            var expression = fn(expressionBuilder);
            return setExpression(Expression.all("", expression));
        };

        self.value = function () {
            return new OperationExpressionBuilder("");
        }

    };

    BASE.query.ExpressionBuilder = ExpressionBuilder;
});
