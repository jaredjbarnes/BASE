BASE.require([
    "BASE.data.ServiceResponse"
], function () {
    BASE.namespace("BASE.data");

    BASE.data.RemovedResponse = (function (Super) {
        var RemovedResponse = function (message) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new RemovedResponse(message);
            }

            Super.call(self, message);

            return self;
        };

        BASE.extend(RemovedResponse, Super);

        return RemovedResponse;
    }(BASE.data.ServiceResponse));
});