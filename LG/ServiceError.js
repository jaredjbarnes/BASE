BASE.namespace("LG");

LG.ServiceError = (function (Super) {
    function ServiceError(message, validationErrors) {
        var self = this;
        Super.call(self, message)
        self.message = message;
        self.validationErrors = validationErrors;
    }
    return ServiceError;
})(Error);