BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.LGEmployeeRoleToCompanyAddress = (function (Super) {
        var LGEmployeeRoleToCompanyAddress = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("LGEmployeeRoleToCompanyAddress constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['LGEmployeeRoleId'] = null;
            self['LGEmployeeRole'] = null;
            self['companyAddressId'] = null;
            self['companyAddress'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(LGEmployeeRoleToCompanyAddress, Super);

        return LGEmployeeRoleToCompanyAddress;
    }(Object));
});