BASE.require([
    "BASE.data.ServiceResponse"
], function () {
    BASE.namespace("BASE.data");

    BASE.data.ErrorResponse = (function (Super) {
        var ErrorResponse = function (message) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ErrorResponse(message);
            }

            Super.call(self, message);

            self["throw"] = function (dataContext) { };

            return self;
        };

        BASE.extend(ErrorResponse, Super);

        return ErrorResponse;
    }(BASE.data.ServiceResponse));
});