BASE.require([
    "BASE.data.responses.ErrorResponse"
], function () {
    BASE.namespace("BASE.data.responses");

    BASE.data.responses.UnauthorizedErrorResponse = (function (Super) {
        var UnauthorizedErrorResponse = function (message) {
            var self = this;
            BASE.assertNotGlobal(self);

            Super.call(self, message);

            return self;
        };

        BASE.extend(UnauthorizedErrorResponse, Super);

        return UnauthorizedErrorResponse;
    }(BASE.data.responses.ErrorResponse));
});