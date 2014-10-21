BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.LGEmployeeRoleUltiProAccount = (function (Super) {
        var LGEmployeeRoleUltiProAccount = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("LGEmployeeRoleUltiProAccount constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['LGEmployeeRole'] = null;
            self['empNo'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(LGEmployeeRoleUltiProAccount, Super);

        return LGEmployeeRoleUltiProAccount;
    }(Object));
});