BASE.require([
    "LG.rest.Service",
    "LG.JsonAjaxProvider",
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
    "LG.core.dataModel.sales.SalesAppUserPersonRole"
], function () {
    BASE.namespace("LG.core.dataModel.sales");

    LG.core.dataModel.sales.Service = (function (Super) {
        var Service = function (appId, token) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Service(appId, token);
            }

            var core = LG.core.dataModel.core;
            var sales = LG.core.dataModel.sales;

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
                "/Sales/ClientToClientTag": sales.ClientToClientTag,
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
                "/Sales/ClientUserSettings": sales.ClientUserSetting
            };

            for (var uri in serverUrisToTypes) {
                self.typeUri.add(serverUrisToTypes[uri], uri);
            }

            var serverTypesToClientTypes = {
                "Person": core.Person,
                "JobRole": core.JobRole,
                "LGEmployeeRole": core.LGEmployeeRole,
                "Attachment": core.Attachment,
                "PersonAddress": core.PersonAddress,
                "PersonEmailAddress": core.PersonEmailAddress,
                "PersonPhoneNumber": core.PersonPhoneNumber,
                "PersonLdapAccount": core.PersonLdapAccount,
                "ProfilePictureAttachment": core.ProfilePersonAttachment,
                "Client": sales.Client,
                "ClientAttachment": sales.ClientAttachment,
                "ClientContactPersonRole": sales.ClientContactPersonRole,
                "ClientNote": sales.ClientNote,
                "ClientNoteReminder": sales.ClientNoteReminder,
                "ClientPartner": sales.ClientPartner,
                "ClientTag": sales.ClientTag,
                "ClientToClientTag": sales.ClientToClientTag,
                "Opportunity": sales.Opportunity,
                "OpportunityStatus": sales.OpportunityStatus,
                "SalesAppUserPersonRole": sales.SalesAppUserPersonRole,
                "PremiumSplit": sales.PremiumSplit,
                "ClientAddress": sales.ClientAddress,
                "ClientUserSetting": sales.ClientUserSetting

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
                }, {
                    type: sales.ClientNote,
                    hasKey: "id",
                    hasOne: "clientNoteReminder",
                    ofType: sales.ClientNoteReminder,
                    withKey: "id",
                    withForeignKey: "id",
                    withOne: "note"
                }],
                oneToMany: [{
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
                    type: sales.Client,
                    hasKey: "id",
                    hasMany: "attachments",
                    ofType: sales.ClientAttachment,
                    withForeignKey: "clientId",
                    withOne: "client"
                }, {
                    type: sales.Client,
                    hasKey: "id",
                    hasMany: "contacts",
                    ofType: sales.ClientContactPersonRole,
                    withForeignKey: "clientId",
                    withOne: "client"
                }, {
                    type: sales.Client,
                    hasKey: "id",
                    hasMany: "notes",
                    ofType: sales.ClientNote,
                    withForeignKey: "clientId",
                    withOne: "client"
                }, {
                    type: sales.Client,
                    hasKey: "id",
                    hasMany: "partners",
                    ofType: sales.ClientPartner,
                    withForeignKey: "clientId",
                    withOne: "client"
                }, {
                    type: sales.Client,
                    hasKey: "id",
                    hasMany: "clientUserSettings",
                    ofType: sales.ClientUserSetting,
                    withForeignKey: "clientId",
                    withOne: "client"
                }, {
                    type: sales.Client,
                    hasKey: "id",
                    hasMany: "clientAddresses",
                    ofType: sales.ClientAddress,
                    withForeignKey: "clientId",
                    withOne: "client"
                }, {
                    type: sales.Opportunity,
                    hasKey: "id",
                    hasMany: "statuses",
                    ofType: sales.OpportunityStatus,
                    withForeignKey: "opportunityId",
                    withOne: "opportunity"
                }, {
                    type: sales.Opportunity,
                    hasKey: "id",
                    hasMany: "premiumSplits",
                    ofType: sales.PremiumSplit,
                    withForeignKey: "opportunityId",
                    withOne: "opportunity"
                }, {
                    type: sales.SalesAppUserPersonRole,
                    hasKey: "id",
                    hasMany: "opportunities",
                    ofType: sales.Opportunity,
                    withForeignKey: "ownerId",
                    withOne: "owner"
                }, {
                    type: sales.Client,
                    hasKey: "id",
                    hasMany: "opportunities",
                    ofType: sales.Opportunity,
                    withForeignKey: "clientId",
                    withOne: "client"
                }, {
                    type: sales.SalesAppUserPersonRole,
                    hasKey: "id",
                    hasMany: "clients",
                    ofType: sales.Client,
                    withForeignKey: "ownerId",
                    withOne: "owner"
                }, {
                    type: sales.SalesAppUserPersonRole,
                    hasKey: "id",
                    hasMany: "clientPartners",
                    ofType: sales.ClientPartner,
                    withForeignKey: "salesAppUserPersonRoleId",
                    withOne: "salesAppUserPersonRole"
                }, {
                    type: sales.SalesAppUserPersonRole,
                    hasKey: "id",
                    hasMany: "tags",
                    ofType: sales.ClientTag,
                    withForeignKey: "salesAppUserPersonRoleId",
                    withOne: "salesAppUserPersonRole"
                }, {
                    type: sales.SalesAppUserPersonRole,
                    hasKey: "id",
                    hasMany: "premiumSplits",
                    ofType: sales.PremiumSplit,
                    withForeignKey: "salesAppUserPersonRoleId",
                    withOne: "salesAppUserPersonRole"
                }, {
                    type: sales.SalesAppUserPersonRole,
                    hasKey: "id",
                    hasMany: "clientUserSettings",
                    ofType: sales.ClientUserSetting,
                    withForeignKey: "salesAppUserPersonRoleId",
                    withOne: "salesAppUserPersonRole"
                }, {
                    type: core.Person,
                    hasKey: "id",
                    hasMany: "roles",
                    ofType: core.PersonRole,
                    withForeignKey: "personId",
                    withOne: "person"
                }],
                manyToMany: [{
                    type: sales.Client,
                    hasKey: "id",
                    hasForeignKey: "clientTagId",
                    hasMany: "tags",
                    ofType: sales.ClientTag,
                    withKey: "id",
                    withForeignKey: "clientId",
                    withMany: "clients",
                    usingMappingType: sales.ClientToClientTag
                }]
            };

            self.rpc = function (rpcName, params) {
                return new BASE.async.Future(function (setValue, setError) {
                    var ajaxProvider = self.ajaxProvider;
                    ajaxProvider.ajax(self.host + "/" + rpcName, { type: "POST", data: params }).then(function (result) {
                        setValue(result.data);
                    });
                });
            };

            return self;
        };

        BASE.extend(Service, Super);

        return Service;
    }(LG.rest.Service));
});