BASE.require(["LG.core.dataModel.wellness.WellnessLog"], function () {
    BASE.namespace("LG.core.dataModel.wellness");

    var _globalObject = this;

    LG.core.dataModel.wellness.WeightLog = (function (Super) {
        var WeightLog = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("WeightLog constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['weightinPounds'] = null;
                                                  

            return self;
        };

        BASE.extend(WeightLog, Super);

        return WeightLog;
    }(LG.core.dataModel.wellness.WellnessLog));
});