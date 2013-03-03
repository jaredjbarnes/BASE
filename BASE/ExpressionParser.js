BASE.require(["BASE.Observable"], function () {
    BASE.namespace("BASE");

    BASE.ExpressionParser = (function (Super) {
        var ExpressionParser = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ExpressionParser();
            }

            Super.call(self);

            Object.defineProperties(self, {
                "symbols": {
                    configurable: true,
                    enumerable: true,
                    get: function () {
                        return {};
                    }
                }
            });

            self.parse = function (expression) {

            };

            return self;
        };

        BASE.extend(ExpressionParser, Super);

        return ExpressionParser;
    }(BASE.Observable));
});