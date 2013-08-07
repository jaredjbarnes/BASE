BASE.require([
    "BASE.data.ErrorResponse"
], function () {
    BASE.namespace("BASE.data");

    BASE.data.UnauthorizedError = (function (Super) {
        var UnauthorizedError = function (message) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new UnauthorizedError(message);
            }

            Super.call(self, message);

            self.throw = function (dataContext) {
                self.type = "unauthorized";

                dataContext.notify(self);
            };

            return self;
        };

        BASE.extend(UnauthorizedError, Super);

        return UnauthorizedError;
    }(BASE.data.ErrorResponse));
});