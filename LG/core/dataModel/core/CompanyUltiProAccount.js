BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.CompanyUltiProAccount = (function (Super) {
        var CompanyUltiProAccount = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("CompanyUltiProAccount constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['company'] = null;
            self['cmpCoId'] = null;
            self['cmpCompanyCode'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(CompanyUltiProAccount, Super);

        return CompanyUltiProAccount;
    }(Object));
});