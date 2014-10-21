BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    LG.core.dataModel.core.PersonToPermissionGroup = (function (Super) {
        var PersonToPermissionGroup = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new PersonToPermissionGroup();
            }

            Super.call(self);

            return self;
        };

        BASE.extend(PersonToPermissionGroup, Super);

        return PersonToPermissionGroup;
    }(Object));
});
