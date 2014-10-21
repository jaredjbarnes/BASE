BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    LG.core.dataModel.core.PermissionGroupToPermission = (function (Super) {
        var PermissionGroupToPermission = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new PermissionGroupToPermission();
            }

            Super.call(self);

            return self;
        };

        BASE.extend(PermissionGroupToPermission, Super);

        return PermissionGroupToPermission;
    }(Object));
});
