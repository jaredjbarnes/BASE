BASE.require([
    "BASE.data.DataContext",
    "LG.core.dataModel.core.AgencyRole",
    "LG.core.dataModel.core.CompanyRole",
    "LG.core.dataModel.core.App",
    "LG.core.dataModel.core.Authentication",
    "LG.core.dataModel.core.AuthenticationFactor",
    "LG.core.dataModel.core.Company",
    "LG.core.dataModel.core.CompanyAddress",
    "LG.core.dataModel.core.CompanyAddressPhoneNumber",
    "LG.core.dataModel.core.CompanyEmailAddress",
    "LG.core.dataModel.core.CompanyName",
    "LG.core.dataModel.core.CompanyPhoneNumber",
    "LG.core.dataModel.core.CompanyUltiProAccount",
    "LG.core.dataModel.core.DatabaseCredential",
    "LG.core.dataModel.core.GoogleAuthFactor",
    "LG.core.dataModel.core.PeopleGroup",
    "LG.core.dataModel.core.LdapCredential",
    "LG.core.dataModel.core.Permission",
    "LG.core.dataModel.core.PermissionGroup",
    "LG.core.dataModel.core.Person",
    "LG.core.dataModel.core.PersonEmailAddress",
    "LG.core.dataModel.core.PersonLdapAccount",
    "LG.core.dataModel.core.PersonPhoneNumber",
    "LG.core.dataModel.core.PersonUltiProAccount",
    "LG.core.dataModel.core.ProfilePictureAttachment",
    "LG.core.dataModel.core.Service",
    "LG.core.dataModel.core.PermissionGroupToPermission",
    "LG.core.dataModel.core.PersonToPeopleGroup",
    "LG.core.dataModel.core.PersonToPermission",
    "LG.core.dataModel.core.PersonToPermissionGroup",
    "LG.core.dataModel.core.PermissionGroupToPeopleGroup",
    "LG.core.dataModel.core.PeopleGroupToPermission",
    "LG.core.dataModel.core.AppCategory",
    "LG.core.dataModel.core.LGEmployeeRole",
    "LG.core.dataModel.core.FullTimeEquivalent",
    "LG.core.dataModel.core.JobRole",
    "LG.core.dataModel.core.JobRoleToDepartment",
    "LG.core.dataModel.core.JobRoleToDivision",
    "LG.core.dataModel.core.JobRoleToTeam",
    "LG.core.dataModel.core.JobRoleType",
    "LG.core.dataModel.core.LGEmployeeRoleTitle",
    "LG.core.dataModel.core.PercentOfFullTimeEquivalent",
    "LG.core.dataModel.core.SupervisorJobRole",
    "LG.core.dataModel.core.CompanyDivision",
    "LG.core.dataModel.core.CompanyTeam",
    "LG.core.dataModel.core.CompanyDepartment",
    "LG.core.dataModel.core.LGEmployeeRoleUltiProAccount"
], function () {

    BASE.namespace("LG.core.dataModel.core");

    LG.core.dataModel.core.DataContext = (function (Super) {

        var DataContext = function (appId, userToken) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new DataContext(appId, userToken);
            }

            Super.call(self);

            self.setService(new LG.core.dataModel.core.Service(appId, userToken, self.relationships));

            self.agencyRoles = new BASE.data.DataSet(LG.core.dataModel.core.AgencyRole, self);
            self.companyRoles = new BASE.data.DataSet(LG.core.dataModel.core.CompanyRole, self);
            self.apps = new BASE.data.DataSet(LG.core.dataModel.core.App, self);
            self.appCategories = new BASE.data.DataSet(LG.core.dataModel.core.AppCategory, self);
            self.authentications = new BASE.data.DataSet(LG.core.dataModel.core.Authentication, self);
            self.authenticationFactors = new BASE.data.DataSet(LG.core.dataModel.core.AuthenticationFactor, self);
            self.companies = new BASE.data.DataSet(LG.core.dataModel.core.Company, self);
            self.companyAddresses = new BASE.data.DataSet(LG.core.dataModel.core.CompanyAddress, self);
            self.companyAddressPhoneNumbers = new BASE.data.DataSet(LG.core.dataModel.core.CompanyAddressPhoneNumber, self);
            self.companyEmailAddresses = new BASE.data.DataSet(LG.core.dataModel.core.CompanyEmailAddress, self);
            self.companyNames = new BASE.data.DataSet(LG.core.dataModel.core.CompanyName, self);
            self.companyPhoneNumbers = new BASE.data.DataSet(LG.core.dataModel.core.CompanyPhoneNumber, self);
            self.companyUltiProAccounts = new BASE.data.DataSet(LG.core.dataModel.core.CompanyUltiProAccount, self);
            self.databaseCredentials = new BASE.data.DataSet(LG.core.dataModel.core.DatabaseCredential, self);
            self.LGEmployeeRoles = new BASE.data.DataSet(LG.core.dataModel.core.LGEmployeeRole, self);
            self.googleAuthFactors = new BASE.data.DataSet(LG.core.dataModel.core.GoogleAuthFactor, self);
            self.peopleGroups = new BASE.data.DataSet(LG.core.dataModel.core.PeopleGroup, self);
            self.ldapCredentials = new BASE.data.DataSet(LG.core.dataModel.core.LdapCredential, self);
            self.permissions = new BASE.data.DataSet(LG.core.dataModel.core.Permission, self);
            self.permissionGroups = new BASE.data.DataSet(LG.core.dataModel.core.PermissionGroup, self);
            self.people = new BASE.data.DataSet(LG.core.dataModel.core.Person, self);
            self.personEmailAddresses = new BASE.data.DataSet(LG.core.dataModel.core.PersonEmailAddress, self);
            self.personLdapAccounts = new BASE.data.DataSet(LG.core.dataModel.core.PersonLdapAccount, self);
            self.personPhoneNumbers = new BASE.data.DataSet(LG.core.dataModel.core.PersonPhoneNumber, self);
            self.personUltiProAccounts = new BASE.data.DataSet(LG.core.dataModel.core.PersonUltiProAccount, self);
            self.profilePictureAttachments = new BASE.data.DataSet(LG.core.dataModel.core.ProfilePictureAttachment, self);
            self.jobRoles = new BASE.data.DataSet(LG.core.dataModel.core.JobRole, self);
            self.jobRoleToDepartments = new BASE.data.DataSet(LG.core.dataModel.core.JobRoleToDepartment, self);
            self.jobRoleToDivisions = new BASE.data.DataSet(LG.core.dataModel.core.JobRoleToDivision, self);
            self.jobRoleToTeams = new BASE.data.DataSet(LG.core.dataModel.core.JobRoleToTeam, self);
            self.jobRoleTypes = new BASE.data.DataSet(LG.core.dataModel.core.JobRoleType, self);
            self.jobRoleDataPoints = new BASE.data.DataSet(LG.core.dataModel.core.JobRoleDataPoint, self);
            self.producerRoleDataPoints = new BASE.data.DataSet(LG.core.dataModel.core.ProducerRoleDataPoint, self);
            self.LGEmployeeRoleTitles = new BASE.data.DataSet(LG.core.dataModel.core.LGEmployeeRoleTitle, self);
            self.percentOfFullTimeEquivalents = new BASE.data.DataSet(LG.core.dataModel.core.PercentOfFullTimeEquivalent, self);
            self.supervisorJobRoles = new BASE.data.DataSet(LG.core.dataModel.core.SupervisorJobRole, self);
            self.companyDivisions = new BASE.data.DataSet(LG.core.dataModel.core.CompanyDivision, self);
            self.companyTeams = new BASE.data.DataSet(LG.core.dataModel.core.CompanyTeam, self);
            self.companyDepartments = new BASE.data.DataSet(LG.core.dataModel.core.CompanyDepartment, self);
            self.fullTimeEquivalents = new BASE.data.DataSet(LG.core.dataModel.core.FullTimeEquivalent, self);
            

            return self;
        };
        BASE.extend(DataContext, Super);

        return DataContext;
    }(BASE.data.DataContext));
});