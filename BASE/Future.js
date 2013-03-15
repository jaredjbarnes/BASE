BASE.Future = (function () {

    var Future = function (getValue) {
        var self = this;
        if (!(self instanceof Future)) {
            return new Future(getValue);
        }

        var isLoaded = false;
        var _value = null;
        Object.defineProperties(self, {
            "value": {
                get: function () {
                    return _value;
                }
            }
        });

        self.then = function (callback) {
            if (!isLoaded) {
                getValue(function (val) {
                    _value = val;
                    callback(_val);
                });
            } else {
                setTimeout(function () {
                    callback(_value);
                }, 0);
            }
        };

        self.error = function () { };

    };

}());
