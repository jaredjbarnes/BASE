BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.CompanyDepartment = (function (Super) {
        var CompanyDepartment = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("CompanyDepartment constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['companyId'] = null;
            self['company'] = null;
            self['jobRoleToDepartments'] = [];
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(CompanyDepartment, Super);

        return CompanyDepartment;
    }(Object));
});