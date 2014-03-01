BASE.require([
    "BASE.data.ErrorResponse"
], function () {
    BASE.namespace("BASE.data");

    BASE.data.EntityNotFoundError = (function (Super) {
        var EntityNotFoundError = function (message, entity) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new EntityNotFoundError(message);
            }

            Super.call(self, message);

            self.entity = entity;

            return self;
        };

        BASE.extend(EntityNotFoundError, Super);

        return EntityNotFoundError;
    }(BASE.data.ErrorResponse));
});