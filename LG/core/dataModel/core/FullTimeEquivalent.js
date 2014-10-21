BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.FullTimeEquivalent = (function (Super) {
        var FullTimeEquivalent = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("FullTimeEquivalent constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['LGEmployeeRoleId'] = null;
            self['LGEmployeeRole'] = null;
            self['value'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(FullTimeEquivalent, Super);

        return FullTimeEquivalent;
    }(Object));
});