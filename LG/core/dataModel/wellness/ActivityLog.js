BASE.require(["LG.core.dataModel.wellness.WellnessLog"], function () {
    BASE.namespace("LG.core.dataModel.wellness");

    var _globalObject = this;

    LG.core.dataModel.wellness.ActivityLog = (function (Super) {
        var ActivityLog = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("ActivityLog constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['minutes'] = null;
            self['strenuousLevel'] = null;
            self['distanceInMiles'] = null;
            self['caloriesBurned'] = null;
            self['activityId'] = null;
            self['activity'] = null;
                                                  

            return self;
        };

        BASE.extend(ActivityLog, Super);

        return ActivityLog;
    }(LG.core.dataModel.wellness.WellnessLog));
});