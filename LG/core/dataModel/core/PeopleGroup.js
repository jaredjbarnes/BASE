BASE.require(["LG.core.dataModel.core.Group"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.PeopleGroup = (function (Super) {
        var PeopleGroup = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PeopleGroup constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['type'] = null;
            self['people'] = [];
            self['permissions'] = [];
            self['permissionGroups'] = [];
                                                  

            return self;
        };

        BASE.extend(PeopleGroup, Super);

        return PeopleGroup;
    }(LG.core.dataModel.core.Group));
});