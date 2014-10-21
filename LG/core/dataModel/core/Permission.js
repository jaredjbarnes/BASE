BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.Permission = (function (Super) {
        var Permission = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Permission constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['applicationId'] = null;
            self['application'] = null;
            self['description'] = null;
            self['people'] = [];
            self['peopleGroups'] = [];
            self['permissionGroups'] = [];
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Permission, Super);

        return Permission;
    }(Object));
});