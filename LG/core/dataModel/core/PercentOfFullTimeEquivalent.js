BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.PercentOfFullTimeEquivalent = (function (Super) {
        var PercentOfFullTimeEquivalent = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PercentOfFullTimeEquivalent constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['jobRoleId'] = null;
            self['jobRole'] = null;
            self['value'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(PercentOfFullTimeEquivalent, Super);

        return PercentOfFullTimeEquivalent;
    }(Object));
});