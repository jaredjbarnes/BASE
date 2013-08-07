BASE.require([
    "BASE.data.ErrorResponse"
], function () {
    BASE.namespace("BASE.data");

    BASE.data.NetworkError = (function (Super) {
        var NetworkError = function (message) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new NetworkError(message);
            }

            Super.call(self, message);

            self.throw = function (dataContext) {

            };

            return self;
        };

        BASE.extend(NetworkError, Super);

        return NetworkError;
    }(BASE.data.ErrorResponse));
});