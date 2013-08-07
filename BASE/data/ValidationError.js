BASE.require([
    "BASE.data.ErrorResponse"
], function () {
    BASE.namespace("BASE.data");

    BASE.data.ValidationError = (function (Super) {
        var ValidationError = function (message, validationErrors) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ValidationError(message, validationErrors);
            }

            Super.call(self, message);

            var _validationErrors = validationErrors;
            Object.defineProperty(self, "validationErrors", {
                get: function () {
                    return _validationErrors;
                }
            });

            self.throw = function (dataContext) {

            };

            return self;
        };

        BASE.extend(ValidationError, Super);

        return ValidationError;
    }(BASE.data.ErrorResponse));
});