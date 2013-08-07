BASE.require(["BASE.util.Observable", "BASE.query.Expression"], function () {
    BASE.namespace("BASE.query");

    BASE.query.ExpressionParser = (function (Super) {
        var ExpressionParser = function (queryBuilder) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ExpressionParser(queryBuilder);
            }

            Super.call(self);
            self.queryBuilder = queryBuilder || {};

            self.parse = function (expression) {
                if (!expression) {
                    return null;
                }
                var children = [];

                expression.children.forEach(function (expression) {
                    if (!expression.children) {
                        children.push(expression);
                    } else {
                        children.push(self.parse(expression));
                    }
                });

                var func = self.queryBuilder[expression.nodeName];
                if (!func) {
                    throw new Error("The parser doesn't support the \"" + expression.nodeName + "\" expression.");
                }

                children.forEach(function (child, index) {
                    if (child instanceof BASE.query.Expression) {
                        var func = self.queryBuilder[child.nodeName];
                        if (!func) {
                            throw new Error("The parser doesn't support the \"" + child.nodeName + "\" expression.");
                        }
                        children[index] = func.call(self.queryBuilder, child);
                    }
                });
                return func.apply(self.queryBuilder, children);
            };

            return self;
        };

        BASE.extend(ExpressionParser, Super);

        return ExpressionParser;
    }(BASE.util.Observable));
});