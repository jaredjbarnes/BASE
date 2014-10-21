BASE.require([
    "BASE.data.DataContext",
    "LG.core.dataModel.benefitsToGo.BenefitsToGoCompanyRole",
    "LG.core.dataModel.benefitsToGo.BenefitsToGoCompanyRoleDetail",
    "LG.core.dataModel.benefitsToGo.BenefitsToGoPersonRole",
    "LG.core.dataModel.benefitsToGo.Plan",
    "LG.core.dataModel.benefitsToGo.PlanDetail",
    "LG.core.dataModel.benefitsToGo.Service",
    "LG.core.dataModel.core.Company",
    "LG.core.dataModel.core.CompanyName",
    "LG.core.dataModel.core.Person"
], function () {

    BASE.namespace("LG.core.dataModel.benefitsToGo");

    var DataSet = BASE.data.DataSet;

    LG.core.dataModel.benefitsToGo.DataContext = (function (Super) {

        var DataContext = function (appId, userToken) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new DataContext(appId, userToken);
            }

            Super.call(self, appId, userToken);

            self.setService(new LG.core.dataModel.benefitsToGo.Service(appId, userToken));

            var b2g = LG.core.dataModel.benefitsToGo;
            var core = LG.core.dataModel.core;

            self.benefitsToGoCompanyRoles = new DataSet(b2g.BenefitsToGoCompanyRole, self);
            self.benefitsToGoCompanyRoleDetails = new DataSet(b2g.BenefitsToGoCompanyRoleDetail, self);
            self.benefitsToGoPersonRoles = new DataSet(b2g.BenefitsToGoPersonRole, self);
            self.plans = new DataSet(b2g.Plan, self);
            self.planDetails = new DataSet(b2g.PlanDetail, self);
            self.companyNames = new DataSet(core.CompanyName, self);
            self.companies = new DataSet(core.Company, self);
            self.people = new DataSet(core.Person, self);

            return self;
        };
        BASE.extend(DataContext, Super);
        return DataContext;
    }(BASE.data.DataContext));
});