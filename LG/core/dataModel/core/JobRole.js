BASE.require(["LG.core.dataModel.core.BaseRole"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.JobRole = (function (Super) {
        var JobRole = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("JobRole constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['companyId'] = null;
            self['company'] = null;
            self['jobRoleTypeId'] = null;
            self['jobRoleType'] = null;
            self['LGEmployeeRoleId'] = null;
            self['LGEmployeeRole'] = null;
            self['percentOfFullTimeEquivalents'] = [];
            self['jobRoleToDivisions'] = [];
            self['jobRoleToDepartments'] = [];
            self['jobRoleToTeams'] = [];
            self['supervisorJobRoles'] = [];
            self['directReports'] = [];
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(JobRole, Super);

        return JobRole;
    }(LG.core.dataModel.core.BaseRole));
});