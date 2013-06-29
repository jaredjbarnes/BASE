BASE.require([
    "BASE.data.ServiceResponse"
], function () {
    BASE.namespace("BASE.data");

    BASE.data.ErrorResponse = (function (Super) {
        var ErrorResponse = function (message, error) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ErrorResponse(message);
            }

            Super.call(self, message);

            var _error = error;
            Object.defineProperty(self, "error", {
                get: function () {
                    return _error;
                }
            });

            return self;
        };

        BASE.extend(ErrorResponse, Super);

        return ErrorResponse;
    }(BASE.data.ServiceResponse));
});