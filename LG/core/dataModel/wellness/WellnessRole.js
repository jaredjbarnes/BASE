BASE.require(["LG.core.dataModel.core.PersonRole"], function () {
    BASE.namespace("LG.core.dataModel.wellness");

    var _globalObject = this;

    LG.core.dataModel.wellness.WellnessRole = (function (Super) {
        var WellnessRole = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("WellnessRole constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['heightInInches'] = null;
            self['goals'] = [];
            self['activityLogs'] = [];
            self['weightLogs'] = [];
                                                  

            return self;
        };

        BASE.extend(WellnessRole, Super);

        return WellnessRole;
    }(LG.core.dataModel.core.PersonRole));
});