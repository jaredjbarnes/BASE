BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.wellness");

    var _globalObject = this;

    LG.core.dataModel.wellness.WellnessLog = (function (Super) {
        var WellnessLog = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("WellnessLog constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['dateEntered'] = null;
            self['wellnessRoleId'] = null;
            self['wellnessRole'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(WellnessLog, Super);

        return WellnessLog;
    }(Object));
});