BASE.Parser = (function (Super) {
    var Parser = function (parser) {
        var self = this;
        if (!(self instanceof arguments.callee)) {
            return new Parser(parser);
        }
        Super.call(self);

        var _charArrary = [];

        Object.defineProperties(self, {
            "token": {
                get: function () {
                    return _charArrary.join("");
                }
            }
        });

        self.run = function () {

        };

    };
    BASE.extend(Parser, Super);
}(Object));