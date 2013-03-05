BASE.require(["BASE.Observable", "BASE.Expression"], function () {
    BASE.namespace("BASE");

    BASE.ExpressionBuilder = (function (Super) {
        var ExpressionBuilder = function (Type, namespace) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ExpressionBuilder(Type, namespace);
            }

            Super.call(self);

            var Expression = BASE.Expression;

            self.equals = function (value) {
                var property = Expression.property(namespace);
                var constant = Expression.constant(value);
                return Expression.equal(property, constant);
            };

            self.notEqualTo = function (value) {
                var property = Expression.property(namespace);
                var constant = Expression.constant(value);
                return Expression.notEqual(property, constant);
            };

            self.greaterThan = function (value) {
                var property = Expression.property(namespace);
                var constant = Expression.constant(value);
                return Expression.greaterThan(property, constant);
            };

            self.lessThan = function (value) {
                var property = Expression.property(namespace);
                var constant = Expression.constant(value);
                return Expression.lessThan(property, constant);
            };

            self.greaterThanOrEqualTo = function (value) {
                var property = Expression.property(namespace);
                var constant = Expression.constant(value);
                return Expression.greaterThanOrEqual(property, constant);
            };

            self.lessThanOrEqualTo = function (value) {
                var property = Expression.property(namespace);
                var constant = Expression.constant(value);
                return Expression.lessThanOrEqual(property, constant);
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
                            ChildType = mapping[property].constructor;
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