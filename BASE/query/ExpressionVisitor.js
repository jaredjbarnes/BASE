BASE.require([
    "BASE.query.Expression"
], function () {
    BASE.namespace("BASE.query");

    var Expression = BASE.query.Expression;

    BASE.query.ExpressionVisitor = (function (Super) {
        var ExpressionVisitor = function () {
            var self = this;

            BASE.assertNotGlobal(self);

            Super.call(self);

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

                var func = self[expression.nodeName];
                if (!func) {
                    throw new Error("The builder doesn't support the \"" + expression.nodeName + "\" expression.");
                }

                children.forEach(function (child, index) {
                    if (child instanceof BASE.query.Expression) {
                        var func = self[child.nodeName];
                        if (!func) {
                            throw new Error("The builder doesn't support the \"" + child.nodeName + "\" expression.");
                        }
                        children[index] = func.call(self, child);
                    }
                });
                return func.apply(self, children);
            };

           
            return self;
        };

        BASE.extend(ExpressionVisitor, Super);

        return ExpressionVisitor;
    }(Object));
});