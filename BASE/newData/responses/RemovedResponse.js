BASE.require([
    "BASE.data.responses.ServiceResponse"
], function () {
    BASE.namespace("BASE.data.responses");

    BASE.data.responses.RemovedResponse = (function (Super) {
        var RemovedResponse = function (message) {
            var self = this;

            BASE.assertNotGlobal(self);

            Super.call(self, message);

            return self;
        };

        BASE.extend(RemovedResponse, Super);

        return RemovedResponse;
    }(BASE.data.responses.ServiceResponse));
});