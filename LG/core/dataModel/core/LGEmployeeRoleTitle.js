BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.LGEmployeeRoleTitle = (function (Super) {
        var LGEmployeeRoleTitle = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("LGEmployeeRoleTitle constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['LGEmployeeRoleId'] = null;
            self['LGEmployeeRole'] = null;
            self['title'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(LGEmployeeRoleTitle, Super);

        return LGEmployeeRoleTitle;
    }(Object));
});