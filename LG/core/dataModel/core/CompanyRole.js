BASE.require(["LG.core.dataModel.core.BaseRole"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.CompanyRole = (function (Super) {
        var CompanyRole = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("CompanyRole constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['companyId'] = null;
            self['company'] = null;
            self['closureTypeId'] = null;
            self['closureType'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(CompanyRole, Super);

        return CompanyRole;
    }(LG.core.dataModel.core.BaseRole));
});