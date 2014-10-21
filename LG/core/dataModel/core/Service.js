BASE.require([
    "LG.core.dataModel.core.AgencyRole",
    "LG.core.dataModel.core.App",
    "LG.core.dataModel.core.Authentication",
    "LG.core.dataModel.core.AuthenticationFactor",
    "LG.core.dataModel.core.Company",
    "LG.core.dataModel.core.CompanyAddress",
    "LG.core.dataModel.core.CompanyAddressPhoneNumber",
    "LG.core.dataModel.core.CompanyAddressUltiProAccount",
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
    "LG.core.dataModel.core.ProducerRoleDataPoint",
    "LG.core.dataModel.core.ProfilePictureAttachment",
    "LG.core.dataModel.core.PermissionGroupToPermission",
    "LG.core.dataModel.core.PersonToPeopleGroup",
    "LG.core.dataModel.core.PersonToPermission",
    "LG.core.dataModel.core.PersonToPermissionGroup",
    "LG.core.dataModel.core.PermissionGroupToPeopleGroup",
    "LG.core.dataModel.core.PeopleGroupToPermission",
    "LG.rest.Service",
    "LG.JsonAjaxProvider",
    "LG.core.dataModel.core.LGEmployeeRole",
    "LG.core.dataModel.core.FullTimeEquivalent",
    "LG.core.dataModel.core.JobRole",
    "LG.core.dataModel.core.JobRoleToDepartment",
    "LG.core.dataModel.core.JobRoleToDivision",
    "LG.core.dataModel.core.JobRoleToTeam",
    "LG.core.dataModel.core.JobRoleType",
    "LG.core.dataModel.core.JobRoleDataPoint",
    "LG.core.dataModel.core.LGEmployeeRoleTitle",
    "LG.core.dataModel.core.PercentOfFullTimeEquivalent",
    "LG.core.dataModel.core.SupervisorJobRole",
    "LG.core.dataModel.core.CompanyDivision",
    "LG.core.dataModel.core.CompanyTeam",
    "LG.core.dataModel.core.CompanyDepartment",
    "LG.core.dataModel.core.LGEmployeeRoleUltiProAccount",
    "BASE.web.Url"
    
], function () {
    BASE.namespace("LG.core.dataModel.core");

    LG.core.dataModel.core.Service = (function (Super) {
        var Service = function (appId, token) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Service(appId, token);
            }

            Super.call(self);

            if (document) {
                var location = new BASE.web.Url(document.location.href);

                if (location.getHost() === "localhost") { // local debugging
                    self.host = "https://api.leavitt.com";
                } else { // published on my.leavitt.com or in a node server
                    self.host = "/webapi";
                }
            } else {
                self.host = "https://api.leavitt.com";
            }

            
            self.ajaxProvider = new LG.JsonAjaxProvider(appId, token);

            self.typeUri.add(LG.core.dataModel.core.Authentication, "/Core/Authentications");
            self.serverTypeToClientType.add("Authentication", LG.core.dataModel.core.Authentication);

            self.typeUri.add(LG.core.dataModel.core.AuthenticationFactor, "/Core/AuthenticationFactors");
            self.serverTypeToClientType.add("AuthenticationFactor", LG.core.dataModel.core.AuthenticationFactor);

            self.typeUri.add(LG.core.dataModel.core.AgencyRole, "/Core/AgencyRoles");
            self.serverTypeToClientType.add("AgencyRole", LG.core.dataModel.core.AgencyRole);

            self.typeUri.add(LG.core.dataModel.core.App, "/Core/Apps");
            self.serverTypeToClientType.add("App", LG.core.dataModel.core.App);

            self.typeUri.add(LG.core.dataModel.core.AppCategory, "/Core/AppCategories");
            self.serverTypeToClientType.add("AppCategory", LG.core.dataModel.core.AppCategory);

            self.typeUri.add(LG.core.dataModel.core.CompanyAddress, "/Core/CompanyAddresses");
            self.serverTypeToClientType.add("CompanyAddress", LG.core.dataModel.core.CompanyAddress);

            self.typeUri.add(LG.core.dataModel.core.CompanyAddressPhoneNumber, "/Core/CompanyAddressPhoneNumbers");
            self.serverTypeToClientType.add("CompanyAddressPhoneNumber", LG.core.dataModel.core.CompanyAddressPhoneNumber);

            self.typeUri.add(LG.core.dataModel.core.CompanyAddressUltiProAccount, "/Core/CompanyAddressUltiProAccounts");
            self.serverTypeToClientType.add("CompanyAddressUltiProAccount", LG.core.dataModel.core.CompanyAddressUltiProAccount);

            self.typeUri.add(LG.core.dataModel.core.Company, "/Core/Companies");
            self.serverTypeToClientType.add("Company", LG.core.dataModel.core.Company);

            self.typeUri.add(LG.core.dataModel.core.CompanyEmailAddress, "/Core/CompanyEmailAddresses");
            self.serverTypeToClientType.add("CompanyEmailAddress", LG.core.dataModel.core.CompanyEmailAddress);

            self.typeUri.add(LG.core.dataModel.core.CompanyName, "/Core/CompanyNames");
            self.serverTypeToClientType.add("CompanyName", LG.core.dataModel.core.CompanyName);

            self.typeUri.add(LG.core.dataModel.core.CompanyPhoneNumber, "/Core/CompanyPhoneNumbers");
            self.serverTypeToClientType.add("CompanyPhoneNumber", LG.core.dataModel.core.CompanyPhoneNumber);

            self.typeUri.add(LG.core.dataModel.core.CompanyUltiProAccount, "/Core/CompanyUltiProAccounts");
            self.serverTypeToClientType.add("CompanyUltiProAccount", LG.core.dataModel.core.CompanyUltiProAccount);

            self.typeUri.add(LG.core.dataModel.core.DatabaseCredential, "/Core/DatabaseCredentials");
            self.serverTypeToClientType.add("DatabaseCredential", LG.core.dataModel.core.DatabaseCredential);

            self.typeUri.add(LG.core.dataModel.core.LGEmployeeRole, "/Core/LGEmployeeRoles");
            self.serverTypeToClientType.add("LGEmployeeRole", LG.core.dataModel.core.LGEmployeeRole);

            self.typeUri.add(LG.core.dataModel.core.LGEmployeeRoleUltiProAccount, "/Core/LGEmployeeRoleUltiProAccounts");
            self.serverTypeToClientType.add("LGEmployeeRoleUltiProAccount", LG.core.dataModel.core.LGEmployeeRoleUltiProAccount);

            self.typeUri.add(LG.core.dataModel.core.GoogleAuthFactor, "/Core/GoogleAuthFactors");
            self.serverTypeToClientType.add("GoogleAuthFactor", LG.core.dataModel.core.GoogleAuthFactor);

            self.typeUri.add(LG.core.dataModel.core.PeopleGroup, "/Core/PeopleGroups");
            self.serverTypeToClientType.add("PeopleGroup", LG.core.dataModel.core.PeopleGroup);

            self.typeUri.add(LG.core.dataModel.core.LdapCredential, "/Core/LdapCredentials");
            self.serverTypeToClientType.add("LdapCredential", LG.core.dataModel.core.LdapCredential);

            self.typeUri.add(LG.core.dataModel.core.Credential, "/Core/Credentials");
            self.serverTypeToClientType.add("Credential", LG.core.dataModel.core.Credential);

            self.typeUri.add(LG.core.dataModel.core.Permission, "/Core/Permissions");
            self.serverTypeToClientType.add("Permission", LG.core.dataModel.core.Permission);

            self.typeUri.add(LG.core.dataModel.core.Person, "/Core/People");
            self.serverTypeToClientType.add("Person", LG.core.dataModel.core.Person);

            self.typeUri.add(LG.core.dataModel.core.PersonEmailAddress, "/Core/PersonEmailAddresses");
            self.serverTypeToClientType.add("PersonEmailAddress", LG.core.dataModel.core.PersonEmailAddress);

            self.typeUri.add(LG.core.dataModel.core.PersonPhoneNumber, "/Core/PersonPhoneNumbers");
            self.serverTypeToClientType.add("PersonPhoneNumber", LG.core.dataModel.core.PersonPhoneNumber);

            self.typeUri.add(LG.core.dataModel.core.PersonLdapAccount, "/Core/PersonLdapAccounts");
            self.serverTypeToClientType.add("PersonLdapAccount", LG.core.dataModel.core.PersonLdapAccount);

            self.typeUri.add(LG.core.dataModel.core.PersonUltiProAccount, "/Core/PersonUltiProAccount");
            self.serverTypeToClientType.add("PersonUltiProAccount", LG.core.dataModel.core.PersonUltiProAccount);

            self.typeUri.add(LG.core.dataModel.core.ProfilePictureAttachment, "/Core/ProfilePictureAttachments");
            self.serverTypeToClientType.add("ProfilePictureAttachment", LG.core.dataModel.core.ProfilePictureAttachment);

            self.typeUri.add(LG.core.dataModel.core.PermissionGroup, "/Core/PermissionGroups");
            self.serverTypeToClientType.add("PermissionGroup", LG.core.dataModel.core.PermissionGroup);

            self.typeUri.add(LG.core.dataModel.core.PersonToPermission, "/Core/PersonToPermission");
            self.typeUri.add(LG.core.dataModel.core.PersonToPermissionGroup, "/Core/PersonToPermissionGroup");
            self.typeUri.add(LG.core.dataModel.core.PermissionGroupToPermission, "/Core/PermissionToPermissionGroup");
            self.typeUri.add(LG.core.dataModel.core.PeopleGroupToPermission, "/Core/PermissionToPeopleGroup");
            self.typeUri.add(LG.core.dataModel.core.PersonToPeopleGroup, "/Core/PersonToGroup");
            self.typeUri.add(LG.core.dataModel.core.PermissionGroupToPeopleGroup, "/Core/PeopleGroupToPermissionGroup");

            // This is the same as above, but I'm lazily doing it this way instead.
            var serverUrisToTypes = {
                "/Core/JobRoles": LG.core.dataModel.core.JobRole,
                "/Core/JobRoleToDepartments": LG.core.dataModel.core.JobRoleToDepartment,
                "/Core/JobRoleToDivisions": LG.core.dataModel.core.JobRoleToDivision,
                "/Core/JobRoleToTeams": LG.core.dataModel.core.JobRoleToTeam,
                "/Core/JobRoleTypes": LG.core.dataModel.core.JobRoleType,
                "/Core/LGEmployeeRoleTitles": LG.core.dataModel.core.LGEmployeeRoleTitle,
                "/Core/PercentOfFullTimeEquivalents": LG.core.dataModel.core.PercentOfFullTimeEquivalent,
                "/Core/FullTimeEquivalents": LG.core.dataModel.core.FullTimeEquivalent,
                "/Core/SupervisorJobRoles": LG.core.dataModel.core.SupervisorJobRole,
                "/Core/CompanyDivisions": LG.core.dataModel.core.CompanyDivision,
                "/Core/CompanyTeams": LG.core.dataModel.core.CompanyTeam,
                "/Core/CompanyDepartments": LG.core.dataModel.core.CompanyDepartment,
                "/Core/ProducerRoleDataPoints": LG.core.dataModel.core.ProducerRoleDataPoint,
                "/Core/JobRoleDataPoints": LG.core.dataModel.core.JobRoleDataPoint
            };

            for (var uri in serverUrisToTypes) {
                self.typeUri.add(serverUrisToTypes[uri], uri);
            }

            var serverTypesToClientTypes = {
                "JobRole": LG.core.dataModel.core.JobRole,
                "JobRoleToDivision": LG.core.dataModel.core.JobRoleToDivision,
                "JobRoleToDepartment": LG.core.dataModel.core.JobRoleToDepartment,
                "JobRoleToTeam": LG.core.dataModel.core.JobRoleToTeam,
                "JobRoleType": LG.core.dataModel.core.JobRoleType,
                "LGEmployeeRoleTitle": LG.core.dataModel.core.LGEmployeeRoleTitle,
                "PercentOfFullTimeEquivalent": LG.core.dataModel.core.PercentOfFullTimeEquivalent,
                "FullTimeEquivalent": LG.core.dataModel.core.FullTimeEquivalent,
                "SupervisorJobRole": LG.core.dataModel.core.SupervisorJobRole,
                "CompanyDivision": LG.core.dataModel.core.CompanyDivision,
                "CompanyTeam": LG.core.dataModel.core.CompanyTeam,
                "CompanyDepartment": LG.core.dataModel.core.CompanyDepartment,
                "ProducerRoleDataPoint": LG.core.dataModel.core.ProducerRoleDataPoint,
                "JobRoleDataPoint": LG.core.dataModel.core.JobRoleDataPoint
            };

            for (var type in serverTypesToClientTypes) {
                self.serverTypeToClientType.add(type, serverTypesToClientTypes[type]);
            }

            self.relationships = {
                oneToOne: [{
                    type: LG.core.dataModel.core.Person,
                    hasKey: "id",
                    hasOne: "ldapAccount",
                    ofType: LG.core.dataModel.core.PersonLdapAccount,
                    withKey: "id",
                    withForeignKey: "id",
                    withOne: "person"
                }, {
                    type: LG.core.dataModel.core.Company,
                    hasKey: "id",
                    hasOne: "ultiProAccount",
                    ofType: LG.core.dataModel.core.CompanyUltiProAccount,
                    withKey: "id",
                    withForeignKey: "id",
                    withOne: "company"
                }, {
                    type: LG.core.dataModel.core.LGEmployeeRole,
                    hasKey: "id",
                    hasOne: "LGEmployeeRoleUltiProAccount",
                    ofType: LG.core.dataModel.core.LGEmployeeRoleUltiProAccount,
                    withKey: "id",
                    withForeignKey: "id",
                    withOne: "LGEmployeeRole"
                }, {
                    type: LG.core.dataModel.core.JobRole,
                    hasKey: "id",
                    hasOne: "jobRoleDataPoint",
                    ofType: LG.core.dataModel.core.JobRoleDataPoint,
                    withKey: "id",
                    withForeignKey: "jobRoleId",
                    withOne: "jobRole"
                }],
                oneToMany: [{
                    type: LG.core.dataModel.core.Company,
                    hasKey: "id",
                    hasMany: "agencyRoles",
                    ofType: LG.core.dataModel.core.AgencyRole,
                    withKey: "id",
                    withForeignKey: "companyId",
                    withOne: "company"
                }, {
                    type: LG.core.dataModel.core.Person,
                    hasKey: "id",
                    hasMany: "ultiProAccounts",
                    ofType: LG.core.dataModel.core.PersonUltiProAccount,
                    withKey: "id",
                    withForeignKey: "personId",
                    withOne: "person"
                }, {
                    type: LG.core.dataModel.core.Company,
                    hasKey: "id",
                    hasMany: "addresses",
                    ofType: LG.core.dataModel.core.CompanyAddress,
                    withKey: "id",
                    withForeignKey: "companyId",
                    withOne: "company"
                }, {
                    type: LG.core.dataModel.core.Permission,
                    hasKey: "id",
                    hasMany: "applications",
                    ofType: LG.core.dataModel.core.App,
                    withKey: "id",
                    withForeignKey: "accessPermissionId",
                    withOne: "accessPermission",
                    optional: true
                }, {
                    type: LG.core.dataModel.core.Company,
                    hasKey: "id",
                    hasMany: "names",
                    ofType: LG.core.dataModel.core.CompanyName,
                    withKey: "id",
                    withForeignKey: "companyId",
                    withOne: "company"
                }, {
                    type: LG.core.dataModel.core.Company,
                    hasKey: "id",
                    hasMany: "emailAddresses",
                    ofType: LG.core.dataModel.core.CompanyEmailAddress,
                    withKey: "id",
                    withForeignKey: "companyId",
                    withOne: "company"
                }, {
                    type: LG.core.dataModel.core.Company,
                    hasKey: "id",
                    hasMany: "phoneNumbers",
                    ofType: LG.core.dataModel.core.CompanyPhoneNumber,
                    withKey: "id",
                    withForeignKey: "companyId",
                    withOne: "company"
                }, {
                    type: LG.core.dataModel.core.Company,
                    hasKey: "id",
                    hasMany: "roles",
                    ofType: LG.core.dataModel.core.CompanyRole,
                    withKey: "id",
                    withForeignKey: "companyId",
                    withOne: "company"
                }, {
                    type: LG.core.dataModel.core.CompanyAddress,
                    hasKey: "id",
                    hasMany: "LGEmployeeRoles",
                    ofType: LG.core.dataModel.core.LGEmployeeRole,
                    withKey: "id",
                    withForeignKey: "companyAddressId",
                    withOne: "companyAddress"
                }, {
                    type: LG.core.dataModel.core.LGEmployeeRole,
                    hasKey: "id",
                    hasMany: "FTEs",
                    ofType: LG.core.dataModel.core.FullTimeEquivalent,
                    withKey: "id",
                    withForeignKey: "LGEmployeeRoleId",
                    withOne: "LGEmployeeRole",
                    optional: true
                }, {
                    type: LG.core.dataModel.core.Person,
                    hasKey: "id",
                    hasMany: "credentials",
                    ofType: LG.core.dataModel.core.LdapCredential,
                    withKey: "id",
                    withForeignKey: "personId",
                    withOne: "person"
                }, {
                    type: LG.core.dataModel.core.LdapCredential,
                    hasKey: "id",
                    hasMany: "authenticationFactors",
                    ofType: LG.core.dataModel.core.AuthenticationFactor,
                    withKey: "id",
                    withForeignKey: "credentialId",
                    withOne: "credential"
                }, {
                    type: LG.core.dataModel.core.LdapCredential,
                    hasKey: "id",
                    hasMany: "authentications",
                    ofType: LG.core.dataModel.core.Authentication,
                    withKey: "id",
                    withForeignKey: "credentialId",
                    withOne: "credential"
                }, {
                    type: LG.core.dataModel.core.Person,
                    hasKey: "id",
                    hasMany: "emailAddresses",
                    ofType: LG.core.dataModel.core.PersonEmailAddress,
                    withKey: "id",
                    withForeignKey: "personId",
                    withOne: "person"
                }, {
                    type: LG.core.dataModel.core.Person,
                    hasKey: "id",
                    hasMany: "roles",
                    ofType: LG.core.dataModel.core.LGEmployeeRole,
                    withKey: "id",
                    withForeignKey: "personId",
                    withOne: "person"
                }, {
                    type: LG.core.dataModel.core.Person,
                    hasKey: "id",
                    hasMany: "phoneNumbers",
                    ofType: LG.core.dataModel.core.PersonPhoneNumber,
                    withKey: "id",
                    withForeignKey: "personId",
                    withOne: "person"
                }, {
                    type: LG.core.dataModel.core.App,
                    hasKey: "id",
                    hasMany: "permissions",
                    ofType: LG.core.dataModel.core.Permission,
                    withKey: "id",
                    withForeignKey: "applicationId",
                    withOne: "application"
                }, {
                    type: LG.core.dataModel.core.AppCategory,
                    hasKey: "id",
                    hasMany: "apps",
                    ofType: LG.core.dataModel.core.App,
                    withKey: "id",
                    withForeignKey: "categoryId",
                    withOne: "category"
                }, {
                    type: LG.core.dataModel.core.LGEmployeeRole,
                    hasKey: "id",
                    hasMany: "jobRoles",
                    ofType: LG.core.dataModel.core.JobRole,
                    withKey: "id",
                    withForeignKey: "LGEmployeeRoleId",
                    withOne: "LGEmployeeRole"
                }, {
                    type: LG.core.dataModel.core.JobRole,
                    hasKey: "id",
                    hasMany: "percentOfFullTimeEquivalents",
                    ofType: LG.core.dataModel.core.PercentOfFullTimeEquivalent,
                    withKey: "id",
                    withForeignKey: "jobRoleId",
                    withOne: "jobRole"
                }, {
                    type: LG.core.dataModel.core.JobRole,
                    hasKey: "id",
                    hasMany: "supervisorJobRoles",
                    ofType: LG.core.dataModel.core.SupervisorJobRole,
                    withKey: "id",
                    withForeignKey: "jobRoleId",
                    withOne: "jobRole"
                }, {
                    type: LG.core.dataModel.core.JobRole,
                    hasKey: "id",
                    hasMany: "directReports",
                    ofType: LG.core.dataModel.core.SupervisorJobRole,
                    withKey: "id",
                    withForeignKey: "supervisorRoleId",
                    withOne: "supervisorRole"
                }, {
                    type: LG.core.dataModel.core.JobRoleType,
                    hasKey: "id",
                    hasMany: "jobRoles",
                    ofType: LG.core.dataModel.core.JobRole,
                    withKey: "id",
                    withForeignKey: "jobRoleTypeId",
                    withOne: "jobRoleType"
                }, {
                    type: LG.core.dataModel.core.LGEmployeeRole,
                    hasKey: "id",
                    hasMany: "titles",
                    ofType: LG.core.dataModel.core.LGEmployeeRoleTitle,
                    withKey: "id",
                    withForeignKey: "LGEmployeeRoleId",
                    withOne: "LGEmployeeRole"
                }, {
                    type: LG.core.dataModel.core.Company,
                    hasKey: "id",
                    hasMany: "companyDivisions",
                    ofType: LG.core.dataModel.core.CompanyDivision,
                    withKey: "id",
                    withForeignKey: "companyId",
                    withOne: "company"
                }, {
                    type: LG.core.dataModel.core.Company,
                    hasKey: "id",
                    hasMany: "companyTeams",
                    ofType: LG.core.dataModel.core.CompanyTeam,
                    withKey: "id",
                    withForeignKey: "companyId",
                    withOne: "company"
                }, {
                    type: LG.core.dataModel.core.Company,
                    hasKey: "id",
                    hasMany: "companyDepartments",
                    ofType: LG.core.dataModel.core.CompanyDepartment,
                    withKey: "id",
                    withForeignKey: "companyId",
                    withOne: "company"
                }, {
                    type: LG.core.dataModel.core.Company,
                    hasKey: "id",
                    hasMany: "jobRoles",
                    ofType: LG.core.dataModel.core.JobRole,
                    withKey: "id",
                    withForeignKey: "companyId",
                    withOne: "company"
                }, {
                    type: LG.core.dataModel.core.JobRole,
                    hasKey: "id",
                    hasMany: "jobRoleToDivisions",
                    ofType: LG.core.dataModel.core.JobRoleToDivision,
                    withKey: "id",
                    withForeignKey: "jobRoleId",
                    withOne: "jobRole"
                }, {
                    type: LG.core.dataModel.core.JobRole,
                    hasKey: "id",
                    hasMany: "jobRoleToDepartments",
                    ofType: LG.core.dataModel.core.JobRoleToDepartment,
                    withKey: "id",
                    withForeignKey: "jobRoleId",
                    withOne: "jobRole"
                }, {
                    type: LG.core.dataModel.core.JobRole,
                    hasKey: "id",
                    hasMany: "jobRoleToTeams",
                    ofType: LG.core.dataModel.core.JobRoleToTeam,
                    withKey: "id",
                    withForeignKey: "jobRoleId",
                    withOne: "jobRole"
                }, {
                    type: LG.core.dataModel.core.CompanyDivision,
                    hasKey: "id",
                    hasMany: "jobRoleToDivisions",
                    ofType: LG.core.dataModel.core.JobRoleToDivision,
                    withKey: "id",
                    withForeignKey: "companyDivisionId",
                    withOne: "companyDivision"
                }, {
                    type: LG.core.dataModel.core.CompanyDepartment,
                    hasKey: "id",
                    hasMany: "jobRoleToDepartments",
                    ofType: LG.core.dataModel.core.JobRoleToDepartment,
                    withKey: "id",
                    withForeignKey: "companyDepartmentId",
                    withOne: "companyDepartment"
                }, {
                    type: LG.core.dataModel.core.CompanyTeam,
                    hasKey: "id",
                    hasMany: "jobRoleToTeams",
                    ofType: LG.core.dataModel.core.JobRoleToTeam,
                    withKey: "id",
                    withForeignKey: "companyTeamId",
                    withOne: "companyTeam"
                }],
                manyToMany: [{
                    type: LG.core.dataModel.core.PermissionGroup,
                    hasKey: "id",
                    hasForeignKey: "permissionId",
                    hasMany: "permissions",
                    ofType: LG.core.dataModel.core.Permission,
                    withKey: "id",
                    withForeignKey: "permissionGroupId",
                    withMany: "permissionGroups",
                    usingMappingType: LG.core.dataModel.core.PermissionGroupToPermission
                }, {
                    type: LG.core.dataModel.core.Person,
                    hasKey: "id",
                    hasForeignKey: "peopleGroupId",
                    hasMany: "peopleGroups",
                    ofType: LG.core.dataModel.core.PeopleGroup,
                    withKey: "id",
                    withForeignKey: "personId",
                    withMany: "people",
                    usingMappingType: LG.core.dataModel.core.PersonToPeopleGroup
                }, {
                    type: LG.core.dataModel.core.Person,
                    hasKey: "id",
                    hasForeignKey: "permissionId",
                    hasMany: "permissions",
                    ofType: LG.core.dataModel.core.Permission,
                    withKey: "id",
                    withForeignKey: "personId",
                    withMany: "people",
                    usingMappingType: LG.core.dataModel.core.PersonToPermission
                }, {
                    type: LG.core.dataModel.core.Person,
                    hasKey: "id",
                    hasForeignKey: "permissionGroupId",
                    hasMany: "permissionGroups",
                    ofType: LG.core.dataModel.core.PermissionGroup,
                    withKey: "id",
                    withForeignKey: "personId",
                    withMany: "people",
                    usingMappingType: LG.core.dataModel.core.PersonToPermissionGroup
                }, {
                    type: LG.core.dataModel.core.PeopleGroup,
                    hasKey: "id",
                    hasForeignKey: "permissionGroupId",
                    hasMany: "permissionGroups",
                    ofType: LG.core.dataModel.core.PermissionGroup,
                    withKey: "id",
                    withForeignKey: "peopleGroupId",
                    withMany: "peopleGroups",
                    usingMappingType: LG.core.dataModel.core.PermissionGroupToPeopleGroup
                }, {
                    type: LG.core.dataModel.core.PeopleGroup,
                    hasKey: "id",
                    hasForeignKey: "permissionId",
                    hasMany: "permissions",
                    ofType: LG.core.dataModel.core.Permission,
                    withKey: "id",
                    withForeignKey: "peopleGroupId",
                    withMany: "peopleGroups",
                    usingMappingType: LG.core.dataModel.core.PeopleGroupToPermission
                }]
            };

            return self;
        };

        BASE.extend(Service, Super);

        return Service;
    }(LG.rest.Service));
});