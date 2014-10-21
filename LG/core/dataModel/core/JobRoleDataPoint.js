BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.JobRoleDataPoint = (function (Super) {
        var JobRoleDataPoint = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("JobRoleDataPoint constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['jobRole'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(JobRoleDataPoint, Super);

        return JobRoleDataPoint;
    }(Object));
});