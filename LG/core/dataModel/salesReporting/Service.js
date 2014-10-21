BASE.require([
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
    "LG.core.dataModel.sales.SalesAppUserPersonRole",
    "LG.data.services.ODataService"
], function () {
    BASE.namespace("LG.core.dataModel.salesReporting");

    LG.core.dataModel.salesReporting.Service = function (edm, appId, token) {
        var self = this;

        var core = LG.core.dataModel.core;
        var sales = LG.core.dataModel.sales;
        var salesReporting = LG.core.dataModel.salesReporting;
        var host = "https://api.leavitt.com";
        
        LG.data.services.ODataService.call(self, edm, appId, token);

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

        Object.keys(serverUrisToTypes).forEach(function (key) {
            self.addEndPoint(serverUrisToTypes[key], host + key);
        });
    };

});