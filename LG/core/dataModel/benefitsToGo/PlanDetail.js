BASE.require(["LG.core.dataModel.Detail"], function () {
    BASE.namespace("LG.core.dataModel.benefitsToGo");

    var _globalObject = this;

    LG.core.dataModel.benefitsToGo.PlanDetail = (function (Super) {
        var PlanDetail = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PlanDetail constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['planId'] = null;
            self['plan'] = null;
            self['sortOrder'] = null;
                                                  

            return self;
        };

        BASE.extend(PlanDetail, Super);

        return PlanDetail;
    }(LG.core.dataModel.Detail));
});