BASE.require([
    "LG.rest.Service",
    "LG.JsonAjaxProvider",
    "LG.core.dataModel.core.Person",
    "LG.core.dataModel.core.PersonRole",
    "LG.core.dataModel.core.BaseRole",
    "LG.core.dataModel.core.PersonAddress",
    "LG.core.dataModel.core.PersonEmailAddress",
    "LG.core.dataModel.core.PersonPhoneNumber",
    "LG.core.dataModel.core.PersonLdapAccount",
    "LG.core.dataModel.core.ProfilePictureAttachment",
    "LG.core.dataModel.salesReporting.ReportSetting",
    "LG.core.dataModel.salesReporting.OverviewReportFavoriteSetting",
    "LG.core.dataModel.salesReporting.SalesAppUserReportingPersonRole",
    "LG.core.dataModel.sales.SalesAppUserPersonRole"
], function () {
    BASE.namespace("LG.core.dataModel.salesReporting");

    LG.core.dataModel.salesReporting.Service = (function (Super) {
        var Service = function (appId, token) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Service(appId, token);
            }

            var core = LG.core.dataModel.core;
            var sales = LG.core.dataModel.sales;
            var salesReporting = LG.core.dataModel.salesReporting;

            Super.call(self);

            // If the app is being served at my.leavitt.com, proxy
            // api requests through my.leavitt.com/webapi/ because
            // of some CORS issues on iOS.
            if (document.location.href.indexOf("https://my.leavitt.com/") === 0) {
                self.host = "https://my.leavitt.com/webapi";
            } else {
                // Otherwise, use api.leavitt.com for development.
                self.host = "https://api.leavitt.com";
            }
            
            self.ajaxProvider = new LG.JsonAjaxProvider(appId, token);

            var serverUrisToTypes = {
                "/Core/People": core.Person,
                "/Core/PersonAddresses": core.PersonAddress,
                "/Core/PersonEmailAddresses": core.PersonEmailAddress,
                "/Core/PersonPhoneNumbers": core.PersonPhoneNumber,
                "/Core/PersonLdapAccounts": core.PersonLdapAccount,
                "/Core/ProfilePictureAttachments": core.ProfilePictureAttachment,
                "/Sales/SalesAppUserPersonRoles": sales.SalesAppUserPersonRole,
                "/SalesReports/OverviewReportFavoriteSettings": salesReporting.OverviewReportFavoriteSetting,
                "/SalesReports/ReportSettings": salesReporting.ReportSetting,
                "/SalesReports/SalesAppUserReportingPersonRoles": salesReporting.SalesAppUserReportingPersonRole

            };

            for (var uri in serverUrisToTypes) {
                self.typeUri.add(serverUrisToTypes[uri], uri);
            }

            var serverTypesToClientTypes = {
                "Person": core.Person,
                "PersonAddress": core.PersonAddress,
                "PersonEmailAddress": core.PersonEmailAddress,
                "PersonPhoneNumber": core.PersonPhoneNumber,
                "PersonLdapAccount": core.PersonLdapAccount,
                "ProfilePictureAttachment": core.ProfilePersonAttachment,
                "OverviewReportFavoriteSetting": salesReporting.OverviewReportFavoriteSetting,
                "ReportSetting": salesReporting.ReportSetting,
                "SalesAppUserReportingPersonRole": salesReporting.SalesAppUserReportingPersonRole,
                "SalesAppUserPersonRole": sales.SalesAppUserPersonRole
            };

            for (var type in serverTypesToClientTypes) {
                self.serverTypeToClientType.add(type, serverTypesToClientTypes[type]);
            }

            self.relationships = {
                oneToOne: [{
                    type: core.Person,
                    hasKey: "id",
                    hasOne: "ldapAccount",
                    ofType: core.PersonLdapAccount,
                    withKey: "id",
                    withForeignKey: "id",
                    withOne: "person"
                }],
                oneToMany: [{
                    type: core.Person,
                    hasKey: "id",
                    hasMany: "roles",
                    ofType: core.PersonRole,
                    withForeignKey: "personId",
                    withOne: "person"
                },{
                    type: core.Person,
                    hasKey: "id",
                    hasMany: "addresses",
                    ofType: core.PersonAddress,
                    withForeignKey: "personId",
                    withOne: "person"
                }, {
                    type: core.Person,
                    hasKey: "id",
                    hasMany: "emailAddresses",
                    ofType: core.PersonEmailAddress,
                    withForeignKey: "personId",
                    withOne: "person"
                }, {
                    type: core.Person,
                    hasKey: "id",
                    hasMany: "phoneNumbers",
                    ofType: core.PersonPhoneNumber,
                    withForeignKey: "personId",
                    withOne: "person"
                }, {
                    type: salesReporting.SalesAppUserReportingPersonRole,
                    hasKey: "id",
                    hasMany: "reportSettings",
                    ofType: salesReporting.ReportSetting,
                    withForeignKey: "salesAppUserReportingPersonRoleId",
                    withOne: "salesAppUserReportingPersonRole"
                }],
                manyToMany: []
            };

            return self;
        };

        BASE.extend(Service, Super);

        return Service;
    }(LG.rest.Service));
});