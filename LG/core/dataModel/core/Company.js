BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.Company = (function (Super) {
        var Company = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Company constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['addresses'] = [];
            self['names'] = [];
            self['emailAddresses'] = [];
            self['phoneNumbers'] = [];
            self['roles'] = [];
            self['managementSystems'] = [];
            self['companyGroups'] = [];
            self['jobRoles'] = [];
            self['departments'] = [];
            self['divisions'] = [];
            self['teams'] = [];
            self['ultiProAccount'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Company, Super);

        return Company;
    }(Object));
});