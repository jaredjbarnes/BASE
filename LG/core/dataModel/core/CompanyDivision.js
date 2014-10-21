BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.CompanyDivision = (function (Super) {
        var CompanyDivision = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("CompanyDivision constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['companyId'] = null;
            self['company'] = null;
            self['jobRoleToDivisions'] = [];
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(CompanyDivision, Super);

        return CompanyDivision;
    }(Object));
});