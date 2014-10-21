BASE.require(["LG.core.dataModel.core.EmailAddress"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.CompanyEmailAddress = (function (Super) {
        var CompanyEmailAddress = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("CompanyEmailAddress constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['companyId'] = null;
            self['company'] = null;
                                                  

            return self;
        };

        BASE.extend(CompanyEmailAddress, Super);

        return CompanyEmailAddress;
    }(LG.core.dataModel.core.EmailAddress));
});