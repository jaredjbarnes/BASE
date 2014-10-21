BASE.require([
    "BASE.data.responses.ErrorResponse"
], function () {
    BASE.namespace("BASE.data.responses");

    BASE.data.responses.ForbiddenErrorResponse = (function (Super) {
        var ForbiddenErrorResponse = function (message) {
            var self = this;
            BASE.assertNotGlobal(self);

            Super.call(self, message);

            return self;
        };

        BASE.extend(ForbiddenErrorResponse, Super);

        return ForbiddenErrorResponse;
    }(BASE.data.responses.ErrorResponse));
});