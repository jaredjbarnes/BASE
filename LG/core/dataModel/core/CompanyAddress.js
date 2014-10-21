BASE.require(["LG.core.dataModel.core.Address"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.CompanyAddress = (function (Super) {
        var CompanyAddress = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("CompanyAddress constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['companyId'] = null;
            self['company'] = null;
            self['LGEmployeeRoleToCompanyAddresses'] = [];
            self['phoneNumbers'] = [];
            self['ultiProAccount'] = null;
                                                  

            return self;
        };

        BASE.extend(CompanyAddress, Super);

        return CompanyAddress;
    }(LG.core.dataModel.core.Address));
});