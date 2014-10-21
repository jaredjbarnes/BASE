BASE.require(["LG.core.dataModel.Detail"], function () {
    BASE.namespace("LG.core.dataModel.benefitsToGo");

    var _globalObject = this;

    LG.core.dataModel.benefitsToGo.BenefitsToGoCompanyRoleDetail = (function (Super) {
        var BenefitsToGoCompanyRoleDetail = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("BenefitsToGoCompanyRoleDetail constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['benefitsToGoCompanyRoleId'] = null;
            self['benefitsToGoCompanyRole'] = null;
                                                  

            return self;
        };

        BASE.extend(BenefitsToGoCompanyRoleDetail, Super);

        return BenefitsToGoCompanyRoleDetail;
    }(LG.core.dataModel.Detail));
});