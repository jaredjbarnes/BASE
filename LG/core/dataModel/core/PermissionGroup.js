BASE.require(["LG.core.dataModel.core.Group"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.PermissionGroup = (function (Super) {
        var PermissionGroup = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PermissionGroup constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['people'] = [];
            self['peopleGroups'] = [];
            self['permissions'] = [];
                                                  

            return self;
        };

        BASE.extend(PermissionGroup, Super);

        return PermissionGroup;
    }(LG.core.dataModel.core.Group));
});