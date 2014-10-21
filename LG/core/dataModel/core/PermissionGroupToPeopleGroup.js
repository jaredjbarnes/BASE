BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    LG.core.dataModel.core.PermissionGroupToPeopleGroup = (function (Super) {
        var PermissionGroupToPeopleGroup = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new PermissionGroupToPeopleGroup();
            }

            Super.call(self);

            return self;
        };

        BASE.extend(PermissionGroupToPeopleGroup, Super);

        return PermissionGroupToPeopleGroup;
    }(Object));
});
