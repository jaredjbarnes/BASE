BASE.require([
    "BASE.data.Edm",
    "LG.core.dataModel.core.Person",
    "LG.core.dataModel.core.PersonRole",
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
    "LG.core.dataModel.sales.OpportunityContestDetail"
], function () {

    BASE.namespace("LG.core.dataModel.sales");

    LG.core.dataModel.sales.DenormalizedClient = function () {
        var self = this;
        self.id = null;
        self.clientId = null;
        self.coldCount = 0;
        self.conversationCount = 0;
        self.warmCount = 0;
        self.submittedCount = 0;
        self.presentationCount = 0;
        self.soldCount = 0;
        self.deletedCount = 0;
        self.longitude = null;
        self.latitude = null;
        self.expiring = null;
        self.firstName = null;
        self.lastName = null;
        self.clientName = null;
        self.phoneNumber = null;
    };


    LG.core.dataModel.sales.Edm = (function () {

        var Edm = function () {
            var self = this;
            BASE.data.Edm.call(self);
            var core = LG.core.dataModel.core;
            var sales = LG.core.dataModel.sales;

            self.addModel({
                type: core.Person,
                collectionName: "people",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    firstName: {
                        type: String
                    },
                    lastName: {
                        type: String
                    },
                    middleName: {
                        type: String
                    },
                    dateOfBirth: {
                        type: Date
                    },
                    biography: {
                        type: String
                    },
                    dateCreated: {
                        type: Date
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    },
                    gender: {
                        type: String
                    }
                }
            });



            self.addModel({
                type: core.BaseRole,
                collectionName: "baseRoles",
                abstract: true,
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    startDate: {
                        type: Date
                    },
                    endDate: {
                        type: Date
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    }
                }
            });

            self.addModel({
                type: core.PersonRole,
                collectionName: "personRoles",
                baseType: core.BaseRole,
                abstract: true,
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    personId: {
                        type: Integer,
                    },
                    person: {
                        type: core.Person
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    }
                }
            });


            self.addModel({
                type: core.Attachment,
                collectionName: "attachments",
                abstract: true,
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    name: {
                        type: String
                    },
                    description: {
                        type: String
                    },
                    fileName: {
                        type: String
                    },
                    extension: {
                        type: String
                    },
                    contentType: {
                        type: String
                    },
                    owner: {
                        type: core.Person
                    },
                    ownerId: {
                        type: Integer
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    }
                }
            });

            self.addModel({
                type: core.ProfilePictureAttachment,
                collectionName: "profilePictureAttachments",
                baseType: core.Attachment,
                properties: {}
            });

            self.addModel({
                type: core.PersonAddress,
                collectionName: "personAddresses",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    street1: {
                        type: String
                    },
                    street2: {
                        type: String
                    },
                    city: {
                        type: String
                    },
                    state: {
                        type: String
                    },
                    zip: {
                        type: String
                    },
                    country: {
                        type: String
                    },
                    longitude: {
                        type: Decimal
                    },
                    latitude: {
                        type: Decimal
                    },
                    addressType: {
                        type: String
                    },
                    startDate: {
                        type: Date
                    },
                    endDate: {
                        type: Date
                    },
                    personId: {
                        type: Integer
                    },
                    person: {
                        type: core.Person
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    }
                }
            });

            self.addModel({
                type: core.PersonEmailAddress,
                collectionName: "personEmailAddresses",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    person: {
                        type: core.Person
                    },
                    personId: {
                        type: Integer
                    },
                    emailAddressType: {
                        type: String
                    },
                    address: {
                        type: String
                    },
                    startDate: {
                        type: Date
                    },
                    endDate: {
                        type: Date
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    }
                }
            });

            self.addModel({
                type: core.PersonPhoneNumber,
                collectionName: "personPhoneNumbers",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    person: {
                        type: core.Person
                    },
                    personId: {
                        type: Integer
                    },
                    phoneNumberType: {
                        type: String
                    },
                    countryCode: {
                        type: String
                    },
                    areaCode: {
                        type: String
                    },
                    lineNumber: {
                        type: String
                    },
                    extension: {
                        type: String
                    },
                    startDate: {
                        type: Date
                    },
                    endDate: {
                        type: Date
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    }
                }
            });

            self.addModel({
                type: sales.Client,
                collectionName: "clients",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    name: {
                        type: String
                    },
                    owner: {
                        type: sales.Person
                    },
                    ownerId: {
                        type: Integer
                    },
                    denormalizedClient: {
                        type: sales.DenormalizedClient
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    },
                    startDate: {
                        type: Date
                    },
                    endDate: {
                        type: Date
                    }
                }
            });



            self.addModel({
                type: LG.core.dataModel.sales.DenormalizedClient,
                collectionName: "denormalizedClients",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    clientId: {
                        type: Integer
                    },
                    coldCount: {
                        type: Integer
                    },
                    conversationCount: {
                        type: Integer
                    },
                    warmCount: {
                        type: Integer
                    },
                    submittedCount: {
                        type: Integer
                    },
                    presentationCount: {
                        type: Integer
                    },
                    soldCount: {
                        type: Integer
                    },
                    deletedCount: {
                        type: Integer
                    },
                    longitude: {
                        type: Float
                    },
                    latitude: {
                        type: Float
                    },
                    firstName: {
                        type: String
                    },
                    lastName: {
                        type: String
                    },
                    expiring: {
                        type: Date
                    },
                    clientName: {
                        type: String
                    },
                    phoneNumber: {
                        type: String
                    }
                }
            });

            self.addModel({
                type: sales.ClientTag,
                collectionName: "clientTags",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    name: {
                        type: String
                    },
                    person: {
                        type: sales.Person
                    },
                    personId: {
                        type: Integer
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    }
                }
            });

            self.addModel({
                type: sales.ClientAttachment,
                baseType: core.Attachment,
                collectionName: "clientAttachments",
                properties: {
                    client: {
                        type: sales.Client
                    },
                    clientId: {
                        type: Integer
                    }
                }
            });

            self.addModel({
                type: sales.ClientContactPersonRole,
                collectionName: "clientContactPersonRoles",
                baseType: core.PersonRole,
                properties: {
                    client: {
                        type: sales.Client
                    },
                    clientId: {
                        type: Integer
                    },
                    type: {
                        type: String,
                        defaultValue: "Other"
                    },
                    title: {
                        type: String
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    }
                }
            });

            self.addModel({
                type: core.Note,
                abstract: true,
                collectionName: "notes",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    text: {
                        type: String
                    },
                    creator: {
                        type: core.Person
                    },
                    creatorId: {
                        type: Integer
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    }
                }
            });

            self.addModel({
                type: sales.ClientNote,
                baseType: core.Note,
                collectionName: "clientNotes",
                properties: {
                    client: {
                        type: sales.Client
                    },
                    clientId: {
                        type: Integer
                    },
                    clientNoteReminder: {
                        type: sales.ClientNoteReminder
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    },
                    text: {
                        type: String
                    }
                }
            });

            self.addModel({
                type: sales.ClientNoteReminder,
                collectionName: "clientNoteReminders",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    reminderDateTime: {
                        type: Date
                    },
                    reminderSentDateTime: {
                        type: Date
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    },
                    note: {
                        type: sales.ClientNote
                    },
                    noteId: {
                        type: String
                    }
                }
            });

            self.addModel({
                type: sales.ClientPartner,
                collectionName: "clientPartners",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    client: {
                        type: sales.Client
                    },
                    clientId: {
                        type: Integer
                    },
                    salesAppUserPersonRole: {
                        type: sales.SalesAppUserPersonRole
                    },
                    salesAppUserPersonRoleId: {
                        type: Integer
                    },
                    startDate: {
                        type: Date
                    },
                    endDate: {
                        type: Date
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    }
                }
            });

            self.addModel({
                type: sales.Opportunity,
                collectionName: "opportunities",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    ownerId: {
                        type: Integer
                    },
                    owner: {
                        type: sales.SalesAppUserPersonRole
                    },
                    name: {
                        type: String
                    },
                    dateCreated: {
                        type: Date
                    },
                    expectedPremium: {
                        type: Decimal
                    },
                    policyExpirationDate: {
                        type: Date
                    },
                    clientId: {
                        type: Integer
                    },
                    client: {
                        type: sales.Client
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    }
                }
            });

            self.addModel({
                type: sales.OpportunityStatus,
                collectionName: "opportunityStatuses",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    type: {
                        type: String
                    },
                    opportunity: {
                        type: sales.Opportunity
                    },
                    opportunityId: {
                        type: Integer
                    },
                    startDate: {
                        type: Date
                    },
                    endDate: {
                        type: Date
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    }
                }
            });

            self.addModel({
                type: sales.OpportunityContestDetail,
                collectionName: "opportunityContestDetails",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    opportunityId: {
                        type: Integer
                    },
                    opportunity: {
                        type: sales.Opportunity
                    },
                    type: {
                        type: String
                    },
                    value: {
                        type: String
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    }
                }
            });

            self.addModel({
                type: sales.SalesAppUserPersonRole,
                collectionName: "salesAppUserPersonRoles",
                baseType: core.PersonRole,
                properties: {
                }
            });

            self.addModel({
                type: sales.PremiumSplit,
                collectionName: "premiumSplits",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    opportunity: {
                        type: sales.Opportunity
                    },
                    opportunityId: {
                        type: Integer
                    },
                    salesAppUserPersonRoleId: {
                        type: Integer
                    },
                    salesAppUserPersonRole: {
                        type: sales.SalesAppUserPersonRole
                    },
                    percent: {
                        type: Decimal
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    }
                }
            });

            self.addModel({
                type: sales.ClientAddress,
                collectionName: "clientAddresses",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    client: {
                        type: sales.Client
                    },
                    clientId: {
                        type: Integer
                    },
                    addressType: {
                        type: String
                    },
                    street1: {
                        type: String
                    },
                    street2: {
                        type: String
                    },
                    city: {
                        type: String
                    },
                    state: {
                        type: String
                    },
                    zip: {
                        type: String
                    },
                    country: {
                        type: String
                    },
                    longitude: {
                        type: Decimal
                    },
                    latitude: {
                        type: Decimal
                    },
                    startDate: {
                        type: Date
                    },
                    endDate: {
                        type: Date
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    }
                }
            });

            self.addModel({
                type: sales.ClientUserSetting,
                collectionName: "clientUserSettings",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    client: {
                        type: sales.Client
                    },
                    clientId: {
                        type: Integer
                    },
                    displayState: {
                        type: String
                    },
                    salesAppUserPersonRole: {
                        type: sales.SalesAppUserPersonRole
                    },
                    salesAppUserPersonRoleId: {
                        type: Integer
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    }
                }
            });

            self.addModel({
                type: sales.ClientToClientTag,
                collectionName: "clientToClientTags",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    client: {
                        type: sales.Client
                    },
                    clientId: {
                        type: Integer
                    },
                    clientTag: {
                        type: sales.ClientTag
                    },
                    clientTagId: {
                        type: Integer
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    }
                }
            });


            self.addOneToOne({
                type: sales.ClientNote,
                hasKey: "id",
                hasOne: "clientNoteReminder",
                ofType: sales.ClientNoteReminder,
                withKey: "id",
                withForeignKey: "id",
                withOne: "note",
                optional: true
            });

            self.addOneToOne({
                type: sales.Client,
                hasKey: "id",
                hasOne: "denormalizedClient",
                ofType: sales.DenormalizedClient,
                withKey: "id",
                withForeignKey: "clientId",
                withOne: "client",
                optional: true
            });

            self.addOneToMany({
                type: core.Person,
                hasKey: "id",
                hasMany: "roles",
                ofType: core.PersonRole,
                withKey: "id",
                withForeignKey: "personId",
                withOne: "person",
                optional: true
            });

            self.addOneToMany({
                type: core.Person,
                hasKey: "id",
                hasMany: "addresses",
                ofType: core.PersonAddress,
                withKey: "id",
                withForeignKey: "personId",
                withOne: "person",
                optional: true
            });

            self.addOneToMany({
                type: core.Person,
                hasKey: "id",
                hasMany: "emailAddresses",
                ofType: core.PersonEmailAddress,
                withKey: "id",
                withForeignKey: "personId",
                withOne: "person",
                optional: true
            });

            self.addOneToMany({
                type: core.Person,
                hasKey: "id",
                hasMany: "phoneNumbers",
                ofType: core.PersonPhoneNumber,
                withKey: "id",
                withForeignKey: "personId",
                withOne: "person",
                optional: true
            });

            self.addOneToMany({
                type: sales.Client,
                hasKey: "id",
                hasMany: "attachments",
                ofType: sales.ClientAttachment,
                withKey: "id",
                withForeignKey: "clientId",
                withOne: "client",
                optional: true
            });

            self.addOneToMany({
                type: core.Person,
                hasKey: "id",
                hasMany: "myAttachments",
                ofType: core.Attachment,
                withKey: "id",
                withForeignKey: "ownerId",
                withOne: "owner",
                optional: true
            });

            self.addOneToMany({
                type: sales.Client,
                hasKey: "id",
                hasMany: "contacts",
                ofType: sales.ClientContactPersonRole,
                withKey: "id",
                withForeignKey: "clientId",
                withOne: "client",
                optional: true
            });

            self.addOneToMany({
                type: sales.Client,
                hasKey: "id",
                hasMany: "notes",
                ofType: sales.ClientNote,
                withKey: "id",
                withForeignKey: "clientId",
                withOne: "client",
                optional: true
            });

            self.addOneToMany({
                type: sales.Client,
                hasKey: "id",
                hasMany: "partners",
                ofType: sales.ClientPartner,
                withKey: "id",
                withForeignKey: "clientId",
                withOne: "client",
                optional: true
            });

            self.addOneToMany({
                type: sales.Client,
                hasKey: "id",
                hasMany: "opportunities",
                ofType: sales.Opportunity,
                withKey: "id",
                withForeignKey: "clientId",
                withOne: "client",
                optional: true
            });

            self.addOneToMany({
                type: sales.Client,
                hasKey: "id",
                hasMany: "clientAddresses",
                ofType: sales.ClientAddress,
                withKey: "id",
                withForeignKey: "clientId",
                withOne: "client",
                optional: true
            });

            self.addOneToMany({
                type: sales.Client,
                hasKey: "id",
                hasMany: "clientUserSettings",
                ofType: sales.ClientUserSetting,
                withKey: "id",
                withForeignKey: "clientId",
                withOne: "client",
                optional: true
            });

            self.addOneToMany({
                type: sales.SalesAppUserPersonRole,
                hasKey: "id",
                hasMany: "opportunities",
                ofType: sales.Opportunity,
                withKey: "id",
                withForeignKey: "ownerId",
                withOne: "owner",
                optional: true
            });

            self.addOneToMany({
                type: sales.Opportunity,
                hasKey: "id",
                hasMany: "statuses",
                ofType: sales.OpportunityStatus,
                withKey: "id",
                withForeignKey: "opportunityId",
                withOne: "opportunity",
                optional: true
            });

            self.addOneToMany({
                type: sales.SalesAppUserPersonRole,
                hasKey: "id",
                hasMany: "opportunities",
                ofType: sales.Opportunity,
                withKey: "id",
                withForeignKey: "ownerId",
                withOne: "owner",
                optional: true
            });

            self.addOneToMany({
                type: sales.SalesAppUserPersonRole,
                hasKey: "id",
                hasMany: "clients",
                ofType: sales.Client,
                withKey: "id",
                withForeignKey: "ownerId",
                withOne: "owner",
                optional: true
            });

            self.addOneToMany({
                type: sales.SalesAppUserPersonRole,
                hasKey: "id",
                hasMany: "clientPartners",
                ofType: sales.ClientPartner,
                withKey: "id",
                withForeignKey: "salesAppUserPersonRoleId",
                withOne: "salesAppUserPersonRole",
                optional: true
            });

            self.addOneToMany({
                type: core.Person,
                hasKey: "id",
                hasMany: "tags",
                ofType: sales.ClientTag,
                withKey: "id",
                withForeignKey: "personId",
                withOne: "person",
                optional: true
            });

            self.addOneToMany({
                type: sales.SalesAppUserPersonRole,
                hasKey: "id",
                hasMany: "premiumSplits",
                ofType: sales.PremiumSplit,
                withKey: "id",
                withForeignKey: "salesAppUserPersonRoleId",
                withOne: "salesAppUserPersonRole",
                optional: true
            });

            self.addOneToMany({
                type: sales.SalesAppUserPersonRole,
                hasKey: "id",
                hasMany: "clientUserSettings",
                ofType: sales.ClientUserSetting,
                withKey: "id",
                withForeignKey: "salesAppUserPersonRoleId",
                withOne: "salesAppUserPersonRole",
                optional: true
            });

            self.addOneToMany({
                type: sales.Opportunity,
                hasKey: "id",
                hasMany: "premiumSplits",
                ofType: sales.PremiumSplit,
                withKey: "id",
                withForeignKey: "opportunityId",
                withOne: "opportunity",
                optional: true
            });

            self.addOneToMany({
                type: sales.Client,
                hasKey: "id",
                hasMany: "clientToClientTags",
                ofType: sales.ClientToClientTag,
                withKey: "id",
                withForeignKey: "clientId",
                withOne: "client",
                optional: true
            });

            self.addOneToMany({
                type: sales.ClientTag,
                hasKey: "id",
                hasMany: "clientToClientTags",
                ofType: sales.ClientToClientTag,
                withKey: "id",
                withForeignKey: "clientTagId",
                withOne: "clientTag",
                optional: true
            });

            self.addOneToMany({
                type: sales.Opportunity,
                hasKey: "id",
                hasMany: "contestDetails",
                ofType: sales.OpportunityContestDetail,
                withKey: "id",
                withForeignKey: "opportunityId",
                withOne: "opportunity",
                optional: true
            });
        }

        BASE.extend(Edm, BASE.data.Edm);

        return Edm;

    })();




});