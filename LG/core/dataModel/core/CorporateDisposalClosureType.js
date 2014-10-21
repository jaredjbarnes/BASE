BASE.require(["LG.core.dataModel.core.CompanyRoleClosureType"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.CorporateDisposalClosureType = (function (Super) {
        var CorporateDisposalClosureType = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("CorporateDisposalClosureType constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
                                                  

            return self;
        };

        BASE.extend(CorporateDisposalClosureType, Super);

        return CorporateDisposalClosureType;
    }(LG.core.dataModel.core.CompanyRoleClosureType));
});