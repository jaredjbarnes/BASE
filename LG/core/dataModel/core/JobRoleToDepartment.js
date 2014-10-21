BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.JobRoleToDepartment = (function (Super) {
        var JobRoleToDepartment = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("JobRoleToDepartment constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['jobRoleId'] = null;
            self['jobRole'] = null;
            self['companyDepartmentId'] = null;
            self['companyDepartment'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(JobRoleToDepartment, Super);

        return JobRoleToDepartment;
    }(Object));
});