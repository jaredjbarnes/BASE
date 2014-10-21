BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.benefitsToGo");

    var _globalObject = this;

    LG.core.dataModel.benefitsToGo.Plan = (function (Super) {
        var Plan = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Plan constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['planType'] = null;
            self['CRMPolicyId'] = null;
            self['category'] = null;
            self['name'] = null;
            self['benefitsToGoCompanyRoleId'] = null;
            self['benefitsToGoCompanyRole'] = null;
            self['planDetails'] = [];
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Plan, Super);

        return Plan;
    }(Object));
});