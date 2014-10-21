BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    LG.core.dataModel.core.PersonToPermission = (function (Super) {
        var PersonToPermission = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new PersonToPermission();
            }

            Super.call(self);

            return self;
        };

        BASE.extend(PersonToPermission, Super);

        return PersonToPermission;
    }(Object));
});
