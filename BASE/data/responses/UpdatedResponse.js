BASE.require([
    "BASE.data.responses.ServiceResponse"
], function () {
    BASE.namespace("BASE.data.responses");

    BASE.data.responses.UpdatedResponse = (function (Super) {
        var UpdatedResponse = function (message) {
            var self = this;

            BASE.assertNotGlobal(self);

            Super.call(self, message);

            return self;
        };

        BASE.extend(UpdatedResponse, Super);

        return UpdatedResponse;
    }(BASE.data.responses.ServiceResponse));
});