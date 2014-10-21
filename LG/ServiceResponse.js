BASE.namespace("LG");

LG.ServiceResponse = (function (Super) {
    function ServiceResponse(message, body) {
        var self = this;
        Super.call(self)
        self.message = message;
        self.body = body;
    }
    return ServiceResponse;
})(Object);