BASE.require(["LG.core.dataModel.core.CompanyRoleClosureType"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.DisaffiliationClosureType = (function (Super) {
        var DisaffiliationClosureType = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("DisaffiliationClosureType constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
                                                  

            return self;
        };

        BASE.extend(DisaffiliationClosureType, Super);

        return DisaffiliationClosureType;
    }(LG.core.dataModel.core.CompanyRoleClosureType));
});