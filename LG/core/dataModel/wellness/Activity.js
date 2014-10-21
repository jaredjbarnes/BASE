BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.wellness");

    var _globalObject = this;

    LG.core.dataModel.wellness.Activity = (function (Super) {
        var Activity = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Activity constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['isAlvailable'] = null;
            self['defaultStrenuousLevel'] = null;
            self['activityLogs'] = [];
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Activity, Super);

        return Activity;
    }(Object));
});