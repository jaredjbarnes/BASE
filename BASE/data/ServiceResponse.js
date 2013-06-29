BASE.require([
    "Object"
], function () {
    BASE.namespace("BASE.data");

    BASE.data.ServiceResponse = (function (Super) {
        var ServiceResponse = function (message) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ServiceResponse(message);
            }

            Super.call(self);

            var _message = message;
            Object.defineProperty(self, "message", {
                get: function () {
                    return _message;
                }
            });

            return self;
        };

        BASE.extend(ServiceResponse, Super);

        return ServiceResponse;
    }(Object));
});