BASE.require(["LG.core.dataModel.core.PhoneNumber"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.CompanyAddressPhoneNumber = (function (Super) {
        var CompanyAddressPhoneNumber = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("CompanyAddressPhoneNumber constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['companyAddressId'] = null;
            self['companyAddress'] = null;
                                                  

            return self;
        };

        BASE.extend(CompanyAddressPhoneNumber, Super);

        return CompanyAddressPhoneNumber;
    }(LG.core.dataModel.core.PhoneNumber));
});