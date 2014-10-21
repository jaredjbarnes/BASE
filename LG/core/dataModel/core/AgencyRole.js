BASE.require(["LG.core.dataModel.core.CompanyRole"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.AgencyRole = (function (Super) {
        var AgencyRole = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("AgencyRole constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['folderPath'] = null;
            self['salesContracts'] = [];
                                                  

            return self;
        };

        BASE.extend(AgencyRole, Super);

        return AgencyRole;
    }(LG.core.dataModel.core.CompanyRole));
});