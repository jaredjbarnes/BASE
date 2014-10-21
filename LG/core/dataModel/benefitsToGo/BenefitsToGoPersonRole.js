BASE.require(["LG.core.dataModel.core.PersonRole"], function () {
    BASE.namespace("LG.core.dataModel.benefitsToGo");

    var _globalObject = this;

    LG.core.dataModel.benefitsToGo.BenefitsToGoPersonRole = (function (Super) {
        var BenefitsToGoPersonRole = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("BenefitsToGoPersonRole constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['benefitsToGoCompanyRoleId'] = null;
            self['benefitsToGoCompanyRole'] = null;
                                                  

            return self;
        };

        BASE.extend(BenefitsToGoPersonRole, Super);

        return BenefitsToGoPersonRole;
    }(LG.core.dataModel.core.PersonRole));
});