BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.JobRoleToTeam = (function (Super) {
        var JobRoleToTeam = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("JobRoleToTeam constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['jobRoleId'] = null;
            self['jobRole'] = null;
            self['companyTeamId'] = null;
            self['companyTeam'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(JobRoleToTeam, Super);

        return JobRoleToTeam;
    }(Object));
});