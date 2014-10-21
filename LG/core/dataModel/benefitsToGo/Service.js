BASE.require([
    "LG.rest.Service",
    "LG.core.dataModel.benefitsToGo.BenefitsToGoCompanyRole",
    "LG.core.dataModel.benefitsToGo.BenefitsToGoCompanyRoleDetail",
    "LG.core.dataModel.benefitsToGo.BenefitsToGoPersonRole",
    "LG.core.dataModel.benefitsToGo.Plan",
    "LG.core.dataModel.benefitsToGo.PlanDetail",
    "LG.core.dataModel.core.Company",
    "LG.core.dataModel.core.CompanyName",
    "LG.core.dataModel.core.Person",
    "LG.core.dataModel.core.PersonLdapAccount",
    "LG.JsonAjaxProvider"
], function () {
    BASE.namespace("LG.core.dataModel.benefitsToGo");

    var b2g = LG.core.dataModel.benefitsToGo;
    var core = LG.core.dataModel.core;

    LG.core.dataModel.benefitsToGo.Service = (function (Super) {
        var Service = function (appId, token) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Service(appId, token);
            }

            Super.call(self, appId, token);

            self.ajaxProvider = new LG.JsonAjaxProvider(appId, token);
            self.host = "https://api.leavitt.com";

            self.typeUri.add(b2g.BenefitsToGoCompanyRole, "/BenefitsToGo/BenefitsToGoCompanyRoles");
            self.serverTypeToClientType.add("BenefitsToGoCompanyRole", b2g.BenefitsToGoCompanyRole);

            self.typeUri.add(b2g.BenefitsToGoCompanyRoleDetail, "/BenefitsToGo/BenefitsToGoCompanyRoleDetails");
            self.serverTypeToClientType.add("BenefitsToGoCompanyRoleDetail", b2g.BenefitsToGoCompanyRoleDetail);

            self.typeUri.add(b2g.BenefitsToGoPersonRole, "/BenefitsToGo/BenefitsToGoPersonRoles");
            self.serverTypeToClientType.add("BenefitsToGoPersonRole", b2g.BenefitsToGoPersonRole);

            self.typeUri.add(b2g.Plan, "/BenefitsToGo/Plans");
            self.serverTypeToClientType.add("Plan", b2g.Plan);

            self.typeUri.add(b2g.PlanDetail, "/BenefitsToGo/PlanDetails");
            self.serverTypeToClientType.add("PlanDetail", b2g.PlanDetail);

            self.typeUri.add(core.Company, "/Core/Companies");
            self.serverTypeToClientType.add("Company", core.Company);

            self.typeUri.add(core.CompanyName, "/Core/CompanyNames");
            self.serverTypeToClientType.add("CompanyName", core.CompanyName);

            self.typeUri.add(core.Person, "/Core/People");
            self.serverTypeToClientType.add("Person", core.Person);

            self.typeUri.add(core.PersonLdapAccount, "/Core/PersonLdapAccount");
            self.serverTypeToClientType.add("PersonLdapAccount", core.PersonLdapAccount);


            self.relationships = {
                oneToOne: [],
                oneToMany: [{
                    type: b2g.BenefitsToGoCompanyRole,
                    hasKey: "id",
                    hasMany: "benefitsToGoCompanyRoleDetails",
                    ofType: b2g.BenefitsToGoCompanyRoleDetail,
                    withKey: "id",
                    withForeignKey: "benefitsToGoCompanyRoleId",
                    withOne: "benefitsToGoCompanyRole"
                }, {
                    type: b2g.BenefitsToGoCompanyRole,
                    hasKey: "id",
                    hasMany: "plans",
                    ofType: b2g.Plan,
                    withKey: "id",
                    withForeignKey: "benefitsToGoCompanyRoleId",
                    withOne: "benefitsToGoCompanyRole"
                }, {
                    type: b2g.BenefitsToGoCompanyRole,
                    hasKey: "id",
                    hasMany: "peopleRoles",
                    ofType: b2g.BenefitsToGoPersonRole,
                    withKey: "id",
                    withForeignKey: "benefitsToGoCompanyRoleId",
                    withOne: "benefitsToGoCompanyRole"
                }, {
                    type: b2g.Plan,
                    hasKey: "id",
                    hasMany: "planDetails",
                    ofType: b2g.PlanDetail,
                    withKey: "id",
                    withForeignKey: "planId",
                    withOne: "plan"
                }]
            };

            return self;
        };

        BASE.extend(Service, Super);

        return Service;
    }(LG.rest.Service));
});