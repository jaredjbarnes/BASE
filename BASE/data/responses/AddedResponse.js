BASE.require([
    "BASE.data.responses.ServiceResponse"
], function () {
    BASE.namespace("BASE.data.responses");

    BASE.data.responses.AddedResponse = (function (Super) {
        var AddedResponse = function (message, dto) {
            var self = this;

            BASE.assertNotGlobal(self);
            Super.call(self, message);

            self.entity = dto;

            return self;
        };

        BASE.extend(AddedResponse, Super);

        return AddedResponse;
    }(BASE.data.responses.ServiceResponse));
});