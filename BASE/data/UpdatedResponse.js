BASE.require([
    "BASE.data.ServiceResponse"
], function () {
    BASE.namespace("BASE.data");

    BASE.data.UpdatedResponse = (function (Super) {
        var UpdatedResponse = function (message) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new UpdatedResponse(message);
            }

            Super.call(self, message);

            return self;
        };

        BASE.extend(UpdatedResponse, Super);

        return UpdatedResponse;
    }(BASE.data.ServiceResponse));
});