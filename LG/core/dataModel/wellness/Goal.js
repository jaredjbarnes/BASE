BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.wellness");

    var _globalObject = this;

    LG.core.dataModel.wellness.Goal = (function (Super) {
        var Goal = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Goal constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['minutes'] = null;
            self['wellnessRoleId'] = null;
            self['wellnessRole'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Goal, Super);

        return Goal;
    }(Object));
});