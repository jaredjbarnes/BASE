BASE.require([
    "LG.core.dataModel.core.Person",
    "LG.core.dataModel.core.PersonRole",
    "LG.core.dataModel.core.LGEmployeeRole",
    "LG.core.dataModel.core.JobRole",
    "LG.core.dataModel.core.Attachment",
    "LG.core.dataModel.core.Tag",
    "LG.core.dataModel.core.BaseRole",
    "LG.core.dataModel.core.PersonAddress",
    "LG.core.dataModel.core.PersonEmailAddress",
    "LG.core.dataModel.core.PersonPhoneNumber",
    "LG.core.dataModel.core.PersonLdapAccount",
    "LG.core.dataModel.core.ProfilePictureAttachment",
    "LG.core.dataModel.sales.Client",
    "LG.core.dataModel.sales.ClientTag",
    "LG.core.dataModel.sales.ClientToClientTag",
    "LG.core.dataModel.sales.ClientAttachment",
    "LG.core.dataModel.sales.ClientContactPersonRole",
    "LG.core.dataModel.sales.ClientNote",
    "LG.core.dataModel.sales.ClientNoteReminder",
    "LG.core.dataModel.sales.ClientPartner",
    "LG.core.dataModel.sales.Opportunity",
    "LG.core.dataModel.sales.OpportunityStatus",
    "LG.core.dataModel.sales.PremiumSplit",
    "LG.core.dataModel.sales.ClientUserSetting",
    "LG.core.dataModel.sales.ClientAddress",
    "LG.core.dataModel.sales.SalesAppUserPersonRole",
    "LG.data.services.ODataService",
    "LG.core.dataModel.sales.OpportunityContestDetail"
], function () {
    BASE.namespace("LG.core.dataModel.sales");

    LG.core.dataModel.sales.Service = function (edm, appId, token) {
        var self = this;

        var core = LG.core.dataModel.core;
        var sales = LG.core.dataModel.sales;
        var host = "https://api.leavitt.com";

        LG.data.services.ODataService.call(self, edm, appId, token);

        var serverUrisToTypes = {
            "/Core/People": core.Person,
            "/Core/LGEmployeeRoles": core.LGEmployeeRole,
            "/Core/JobRoles": core.JobRole,
            "/Core/Attachments": core.Attachment,
            "/Core/PersonAddresses": core.PersonAddress,
            "/Core/PersonEmailAddresses": core.PersonEmailAddress,
            "/Core/PersonPhoneNumbers": core.PersonPhoneNumber,
            "/Core/PersonLdapAccounts": core.PersonLdapAccount,
            "/Core/ProfilePictureAttachments": core.ProfilePictureAttachment,
            "/Sales/Clients": sales.Client,
            "/Sales/ClientTags": sales.ClientTag,
            "/Sales/ClientToClientTags": sales.ClientToClientTag,
            "/Sales/ClientAttachments": sales.ClientAttachment,
            "/Sales/ClientContactPersonRoles": sales.ClientContactPersonRole,
            "/Sales/ClientNotes": sales.ClientNote,
            "/Sales/ClientNoteReminders": sales.ClientNoteReminder,
            "/Sales/ClientPartners": sales.ClientPartner,
            "/Sales/Opportunities": sales.Opportunity,
            "/Sales/OpportunityStatuses": sales.OpportunityStatus,
            "/Sales/SalesAppUserPersonRoles": sales.SalesAppUserPersonRole,
            "/Sales/PremiumSplits": sales.PremiumSplit,
            "/Sales/ClientAddresses": sales.ClientAddress,
            "/Sales/ClientUserSettings": sales.ClientUserSetting,
            "/Sales/OpportunityContestDetails": LG.core.dataModel.sales.OpportunityContestDetail
        };

        Object.keys(serverUrisToTypes).forEach(function (key) {
            self.addEndPoint(serverUrisToTypes[key], host + key);
        });
    };

});