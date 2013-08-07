BASE.require([
    "BASE.data.ServiceResponse"
], function () {
    BASE.namespace("BASE.data");

    BASE.data.AddedResponse = (function (Super) {
        var AddedResponse = function (message, dto) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new AddedResponse(message, dto);
            }

            Super.call(self, message);

            var _dto = dto;
            Object.defineProperty(self, "dto", {
                get: function () {
                    return _dto;
                }
            });

            return self;
        };

        BASE.extend(AddedResponse, Super);

        return AddedResponse;
    }(BASE.data.ServiceResponse));
});