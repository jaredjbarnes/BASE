BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.CompanyRoleClosureType = (function (Super) {
        var CompanyRoleClosureType = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("CompanyRoleClosureType constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['id'] = null;
            self['companyRole'] = null;
                                                  

            return self;
        };

        BASE.extend(CompanyRoleClosureType, Super);

        return CompanyRoleClosureType;
    }(Object));
});