BASE.require(["LG.core.dataModel.core.PhoneNumber"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.CompanyPhoneNumber = (function (Super) {
        var CompanyPhoneNumber = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("CompanyPhoneNumber constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['companyId'] = null;
            self['company'] = null;
                                                  

            return self;
        };

        BASE.extend(CompanyPhoneNumber, Super);

        return CompanyPhoneNumber;
    }(LG.core.dataModel.core.PhoneNumber));
});