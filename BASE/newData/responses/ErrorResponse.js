BASE.require([
    "BASE.data.responses.ServiceResponse"
], function () {
    BASE.namespace("BASE.data.responses");

    BASE.data.responses.ErrorResponse = (function (Super) {
        var ErrorResponse = function (message) {
            var self = this;
            BASE.assertNotGlobal(self);

            Super.call(self, message);

            return self;
        };

        BASE.extend(ErrorResponse, Super);

        return ErrorResponse;
    }(BASE.data.responses.ServiceResponse));
});