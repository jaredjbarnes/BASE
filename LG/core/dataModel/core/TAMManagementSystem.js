BASE.require(["LG.core.dataModel.core.ManagementSystem"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.TAMManagementSystem = (function (Super) {
        var TAMManagementSystem = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("TAMManagementSystem constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['TAMDatabaseId'] = null;
            self['TAMDatabase'] = null;
            self['TAMAgencyIds'] = null;
                                                  

            return self;
        };

        BASE.extend(TAMManagementSystem, Super);

        return TAMManagementSystem;
    }(LG.core.dataModel.core.ManagementSystem));
});