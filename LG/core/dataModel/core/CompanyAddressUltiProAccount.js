BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.CompanyAddressUltiProAccount = (function (Super) {
        var CompanyAddressUltiProAccount = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("CompanyAddressUltiProAccount constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['companyAddress'] = null;
            self['locCode'] = null;
            self['locCodePlusCoId'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(CompanyAddressUltiProAccount, Super);

        return CompanyAddressUltiProAccount;
    }(Object));
});