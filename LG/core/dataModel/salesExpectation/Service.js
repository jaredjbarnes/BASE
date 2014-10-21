BASE.require([
    "LG.rest.Service",
    "LG.core.dataModel.core.AgencyRole",
    "LG.core.dataModel.core.Company",
    "LG.core.dataModel.core.LGEmployeeRole",
    "LG.core.dataModel.core.LGEmployeeRoleUltiProAccount",
    "LG.core.dataModel.salesExpectation.AssignedExpectedBook",
    "LG.core.dataModel.salesExpectation.Investment",
    "LG.core.dataModel.salesExpectation.NewExpectedBook",
    "LG.core.dataModel.salesExpectation.RenewExpectedBook",
    "LG.core.dataModel.salesExpectation.SalesContract",
    "LG.core.dataModel.salesExpectation.Expectation",
    "LG.JsonAjaxProvider"
], function () {
    BASE.namespace("LG.core.dataModel.salesExpectation");

    var AgencyRole = LG.core.dataModel.core.AgencyRole;
    var LGEmployeeRole = LG.core.dataModel.core.LGEmployeeRole;
    var Company = LG.core.dataModel.core.Company;
    var Person = LG.core.dataModel.core.Person;
    var AssignedExpectedBook = LG.core.dataModel.salesExpectation.AssignedExpectedBook;
    var ExpectedBook = LG.core.dataModel.salesExpectation.ExpectedBook;
    var Investment = LG.core.dataModel.salesExpectation.Investment;
    var NewExpectedBook = LG.core.dataModel.salesExpectation.NewExpectedBook;
    var RenewExpectedBook = LG.core.dataModel.salesExpectation.RenewExpectedBook;
    var SalesContract = LG.core.dataModel.salesExpectation.SalesContract;
    var Expectation = LG.core.dataModel.salesExpectation.Expectation;

    LG.core.dataModel.salesExpectation.Service = (function (Super) {
        var Service = function (appId, token) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Service(appId, token);
            }

            Super.call(self, appId, token);

            self.ajaxProvider = new LG.JsonAjaxProvider(appId, token);
            if (location.host.indexOf("localhost") === 0) {
                self.host = "https://api.leavitt.com";
            } else {
                self.host = "https://amc.leavitt.com/webapi";
            }

            self.typeUri.add(LG.core.dataModel.core.AgencyRole, "/Core/AgencyRoles");
            self.serverTypeToClientType.add("AgencyRole", LG.core.dataModel.core.AgencyRole);

            self.typeUri.add(LG.core.dataModel.core.Person, "/Core/People");
            self.serverTypeToClientType.add("Person", LG.core.dataModel.core.Person);

            self.typeUri.add(LG.core.dataModel.core.LGEmployeeRoleUltiProAccount, "/Core/LGEmployeeRoleUltiProAccounts");
            self.serverTypeToClientType.add("LGEmployeeRoleUltiProAccount", LG.core.dataModel.core.LGEmployeeRoleUltiProAccount);

            self.typeUri.add(LG.core.dataModel.core.LGEmployeeRole, "/Core/LGEmployeeRoles");
            self.serverTypeToClientType.add("LGEmployeeRole", LG.core.dataModel.core.LGEmployeeRole);

            self.typeUri.add(LG.core.dataModel.core.Company, "/Core/Companies");
            self.serverTypeToClientType.add("Company", LG.core.dataModel.core.Company);

            self.typeUri.add(AssignedExpectedBook, "/SalesExpectation/AssignedExpectedBooks");
            self.serverTypeToClientType.add("AssignedExpectedBook", AssignedExpectedBook);

            self.typeUri.add(Investment, "/SalesExpectation/Investments");
            self.serverTypeToClientType.add("Investment", Investment);

            self.typeUri.add(NewExpectedBook, "/SalesExpectation/NewExpectedBooks");
            self.serverTypeToClientType.add("NewExpectedBook", NewExpectedBook);

            self.typeUri.add(RenewExpectedBook, "/SalesExpectation/RenewExpectedBooks");
            self.serverTypeToClientType.add("RenewExpectedBook", RenewExpectedBook);

            self.typeUri.add(SalesContract, "/SalesExpectation/SalesContracts");
            self.serverTypeToClientType.add("SalesContract", SalesContract);

            self.typeUri.add(Expectation, "/SalesExpectation/Expectations");
            self.serverTypeToClientType.add("Expectation", Expectation);


            self.relationships = {
                oneToOne: [{
                    type: Expectation,
                    hasKey: "id",
                    hasOne: "assignedExpectedBook",
                    ofType: AssignedExpectedBook,
                    withKey: "id",
                    withForeignKey: "id",
                    withOne: "expectation",
                    cascadeDelete: true
                }, {
                    type: Expectation,
                    hasKey: "id",
                    hasOne: "newExpectedBook",
                    ofType: NewExpectedBook,
                    withKey: "id",
                    withForeignKey: "id",
                    withOne: "expectation",
                    cascadeDelete: true
                }, {
                    type: Expectation,
                    hasKey: "id",
                    hasOne: "renewExpectedBook",
                    ofType: RenewExpectedBook,
                    withKey: "id",
                    withForeignKey: "id",
                    withOne: "expectation",
                    cascadeDelete: true
                }, {
                    type: Expectation,
                    hasKey: "id",
                    hasOne: "investment",
                    ofType: Investment,
                    withKey: "id",
                    withForeignKey: "id",
                    withOne: "expectation",
                    cascadeDelete: true
                }],
                oneToMany: [{
                    type: SalesContract,
                    hasKey: "id",
                    hasMany: "expectations",
                    ofType: Expectation,
                    withKey: "id",
                    withForeignKey: "salesContractId",
                    withOne: "salesContract",
                    cascadeDelete: true
                }, {
                    type: AgencyRole,
                    hasKey: "id",
                    hasMany: "salesContracts",
                    ofType: SalesContract,
                    withKey: "id",
                    withForeignKey: "agencyRoleId",
                    withOne: "agencyRole"
                }]
            };

            return self;
        };

        BASE.extend(Service, Super);

        return Service;
    }(LG.rest.Service));
});