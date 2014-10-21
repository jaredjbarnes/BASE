BASE.require([
    "BASE.data.DataContext",
    "LG.core.dataModel.core.AgencyRole",
    "LG.core.dataModel.core.LGEmployeeRole",
    "LG.core.dataModel.core.Company",
    "LG.core.dataModel.core.Person",
    "LG.core.dataModel.salesExpectation.AssignedExpectedBook",
    "LG.core.dataModel.salesExpectation.Investment",
    "LG.core.dataModel.salesExpectation.NewExpectedBook",
    "LG.core.dataModel.salesExpectation.RenewExpectedBook",
    "LG.core.dataModel.salesExpectation.SalesContract",
    "LG.core.dataModel.salesExpectation.Expectation",
    "LG.core.dataModel.salesExpectation.Service",
    "LG.core.dataModel.core.LGEmployeeRoleUltiProAccount"
], function () {

    BASE.namespace("LG.core.dataModel.salesExpectation");

    var DataSet = BASE.data.DataSet;

    LG.core.dataModel.salesExpectation.DataContext = (function (Super) {

        var DataContext = function (appId, userToken) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new DataContext(appId, userToken);
            }

            Super.call(self, appId, userToken);

            self.setService(new LG.core.dataModel.salesExpectation.Service(appId, userToken));

            self.assignedExpectedBooks = new DataSet(LG.core.dataModel.salesExpectation.AssignedExpectedBook, self);
            self.investments = new DataSet(LG.core.dataModel.salesExpectation.Investment, self);
            self.newExpectedBooks = new DataSet(LG.core.dataModel.salesExpectation.NewExpectedBook, self);
            self.renewExpectedBooks = new DataSet(LG.core.dataModel.salesExpectation.RenewExpectedBook, self);
            self.salesContracts = new DataSet(LG.core.dataModel.salesExpectation.SalesContract, self);
            self.expectations = new DataSet(LG.core.dataModel.salesExpectation.Expectation, self);
            self.companies = new DataSet(LG.core.dataModel.core.Company, self);
            self.agencyRoles = new DataSet(LG.core.dataModel.core.AgencyRole, self);
            self.LGEmployeeRoles = new DataSet(LG.core.dataModel.core.LGEmployeeRole, self);
            self.LGEmployeeRoleUltiProAccounts = new DataSet(LG.core.dataModel.core.LGEmployeeRoleUltiProAccount, self);
            self.people = new DataSet(LG.core.dataModel.core.Person, self);

            return self;
        };
        BASE.extend(DataContext, Super);
        return DataContext;
    }(BASE.data.DataContext));
});