BASE.require(["BASE.Observable", "BASE.Expression"], function () {
    BASE.namespace("BASE");

    BASE.ExpressionParser = (function (Super) {
        var ExpressionParser = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ExpressionParser();
            }

            Super.call(self);
            var _parsers = {};
            Object.defineProperties(self, {
                "parsers": {
                    configurable: true,
                    enumerable: true,
                    get: function () {
                        return _parsers;
                    }
                }
            });

            self.parse = function (expression) {
                var children = [];

                expression.children.forEach(function (expression) {
                    if (!expression.children) {
                        children.push(expression.value);
                    } else {
                        children.push(self.parse(expression));
                    }
                });

                var func = self.parsers[expression.nodeName] || function () { };

                return func.apply(self, children);
            };

            return self;
        };

        BASE.extend(ExpressionParser, Super);

        return ExpressionParser;
    }(BASE.Observable));
});