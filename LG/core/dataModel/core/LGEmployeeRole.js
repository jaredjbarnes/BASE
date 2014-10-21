BASE.require(["LG.core.dataModel.core.PersonRole"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.LGEmployeeRole = (function (Super) {
        var LGEmployeeRole = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("LGEmployeeRole constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['LGEmployeeRoleToCompanyAddresses'] = [];
            self['titles'] = [];
            self['deductions'] = [];
            self['FTEs'] = [];
            self['jobRoles'] = [];
            self['LGEmployeeRoleUltiProAccount'] = null;
                                                  

            return self;
        };

        BASE.extend(LGEmployeeRole, Super);

        return LGEmployeeRole;
    }(LG.core.dataModel.core.PersonRole));
});