BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.JobRoleType = (function (Super) {
        var JobRoleType = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("JobRoleType constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['jobRoles'] = [];
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(JobRoleType, Super);

        return JobRoleType;
    }(Object));
});