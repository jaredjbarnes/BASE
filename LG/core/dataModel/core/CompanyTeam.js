BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.CompanyTeam = (function (Super) {
        var CompanyTeam = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("CompanyTeam constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['companyId'] = null;
            self['company'] = null;
            self['jobRoleToTeams'] = [];
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(CompanyTeam, Super);

        return CompanyTeam;
    }(Object));
});