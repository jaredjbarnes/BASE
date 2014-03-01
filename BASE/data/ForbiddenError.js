BASE.require([
    "BASE.data.ErrorResponse"
], function () {
    BASE.namespace("BASE.data");

    BASE.data.ForbiddenError = (function (Super) {
        var ForbiddenError = function (message) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ForbiddenError(message);
            }

            Super.call(self, message);

            self["throw"] = function (dataContext) {
                self.type = "forbidden";

                dataContext.notify(self);
            };

            return self;
        };

        BASE.extend(ForbiddenError, Super);

        return ForbiddenError;
    }(BASE.data.ErrorResponse));
});