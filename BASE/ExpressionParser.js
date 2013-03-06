BASE.require(["BASE.Observable", "BASE.Expression"], function () {
    BASE.namespace("BASE");

    BASE.ExpressionParser = (function (Super) {
        var ExpressionParser = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ExpressionParser();
            }

            Super.call(self);
            self.interpreter = {};

            self.parse = function (expression) {
                if (!expression) {
                    return null;
                }
                var children = [];

                expression.children.forEach(function (expression) {
                    if (!expression.children) {
                        children.push(expression.value);
                    } else {
                        children.push(self.parse(expression));
                    }
                });

                var func = self.interpreter[expression.nodeName];
                if (!func) {
                    throw new Error("The parser doesn't support the \"" + expression.nodeName + "\" expression.");
                }

                return func.apply(self.interpreter, children);
            };

            return self;
        };

        BASE.extend(ExpressionParser, Super);

        return ExpressionParser;
    }(BASE.Observable));
});