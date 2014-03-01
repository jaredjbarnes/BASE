BASE.require([
    "BASE.data.ServiceResponse"
], function () {
    BASE.namespace("BASE.data");

    BASE.data.AddedResponse = (function (Super) {
        var AddedResponse = function (message, dto) {
            var self = this;

            BASE.assertNotGlobal(self);
            Super.call(self, message);

            self.dto = dto;

            return self;
        };

        BASE.extend(AddedResponse, Super);

        return AddedResponse;
    }(BASE.data.ServiceResponse));
});