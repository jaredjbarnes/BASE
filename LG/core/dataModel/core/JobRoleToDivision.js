BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.JobRoleToDivision = (function (Super) {
        var JobRoleToDivision = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("JobRoleToDivision constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['jobRoleId'] = null;
            self['jobRole'] = null;
            self['companyDivisionId'] = null;
            self['companyDivision'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(JobRoleToDivision, Super);

        return JobRoleToDivision;
    }(Object));
});