BASE.require(["LG.core.dataModel.core.CompanyRole"], function () {
    BASE.namespace("LG.core.dataModel.benefitsToGo");

    var _globalObject = this;

    LG.core.dataModel.benefitsToGo.BenefitsToGoCompanyRole = (function (Super) {
        var BenefitsToGoCompanyRole = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("BenefitsToGoCompanyRole constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['registrationKey'] = null;
            self['CRMAccountId'] = null;
            self['benefitsToGoCompanyRoleDetails'] = [];
            self['plans'] = [];
            self['peopleRoles'] = [];
                                                  

            return self;
        };

        BASE.extend(BenefitsToGoCompanyRole, Super);

        return BenefitsToGoCompanyRole;
    }(LG.core.dataModel.core.CompanyRole));
});