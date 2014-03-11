BASE.require(["BASE.query.Expression"], function () {
    var Expression = BASE.query.Expression;

    BASE.namespace("BASE.query");

    var PropertyExpression = function (namespace) {
        var self = this;

        self.isEqualTo = function (value) {
            var property = Expression.property(namespace);
            var constant = Expression.getExpressionType(value);
            return Expression.equalTo(property, constant);
        };

        self.isSubstring = function (value) {
            return Expression.equalTo(Expression.substring(Expression.property(namespace)), Expression.getExpressionType(value));
        };

        self.isSubstringOf = function (value) {
            return Expression.substringOf(Expression.property(namespace), Expression.string(value));
        };

        self.isGreaterThan = function (value) {
            var property = Expression.property(namespace);
            var constant = Expression.getExpressionType(value);
            return Expression.greaterThan(property, constant);
        };

        self.isGreaterThanOrEqualTo = function (value) {
            var property = Expression.property(namespace);
            var constant = Expression.getExpressionType(value);
            return Expression.greaterThanOrEqualTo(property, constant);
        };

        self.isLessThanOrEqualTo = function (value) {
            var property = Expression.property(namespace);
            var constant = Expression.getExpressionType(value);
            return Expression.lessThanOrEqualTo(property, constant);
        };

        self.isLessThan = function (value) {
            var property = Expression.property(namespace);
            var constant = Expression.getExpressionType(value);
            return Expression.lessThan(property, constant);
        };

        self.endsWith = function (value) {
            return Expression.endsWith(Expression.property(namespace), Expression.string(value));
        };

        self.startsWith = function (value) {
            return Expression.startsWith(Expression.property(namespace), Expression.string(value));
        };

        self.toString = function () {
            return namespace;
        };
    };

    var ExpressionBuilder = function () {
        var self = this;
        BASE.assertNotGlobal(self);

        self.property = function (property) {
            return new PropertyExpression(property);
        };

        self.and = function () {
            return Expression.and.apply(Expression, arguments);
        };

        self.or = function () {
            return Expression.or.apply(Expression, arguments);
        };

        self.value = function () {
            return new PropertyExpression("");
        }
    };

    BASE.query.ExpressionBuilder = ExpressionBuilder;
});
