BASE.require([
    "BASE.data.Edm",
    "LG.core.dataModel.core.Person",
    "LG.core.dataModel.core.PersonRole",
    "LG.core.dataModel.core.LGEmployeeRole",
    "LG.core.dataModel.core.JobRole",
    "LG.core.dataModel.core.BaseRole",
    "LG.core.dataModel.core.PersonAddress",
    "LG.core.dataModel.core.PersonEmailAddress",
    "LG.core.dataModel.core.PersonPhoneNumber",
    "LG.core.dataModel.core.PersonLdapAccount",
    "LG.core.dataModel.sales.SalesAppUserPersonRole",
    "LG.core.dataModel.salesReporting.OverviewReportFavoriteSetting",
    "LG.core.dataModel.salesReporting.ReportSetting",
    "LG.core.dataModel.salesReporting.SalesAppUserReportingPersonRole"

], function () {

    BASE.namespace("LG.core.dataModel.salesReporting");

    LG.core.dataModel.salesReporting.Edm = (function () {

        var Edm = function () {
            var self = this;
            BASE.data.Edm.call(self);
            var core = LG.core.dataModel.core;
            var sales = LG.core.dataModel.sales;
            var salesReporting = LG.core.dataModel.salesReporting;

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
                        type: Date,
                        defaultValue: function () {
                            return new Date();
                        }
                    },
                    gender: {
                        type: String
                    },
                    ldapAccount: {
                        type: core.PersonLdapAccount
                    }
                }
            });

            self.addModel({
                type: core.PersonLdapAccount,
                collectionName: "personLdapAccounts",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    sid: {
                        type: String
                    },
                    guid: {
                        type: String
                    },
                    person: {
                        type: core.Person
                    }
                }
            });

            self.addModel({
                type: core.BaseRole,
                collectionName: "baseRoles",
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
                    }
                }
            });

            self.addModel({
                type: core.PersonRole,
                collectionName: "personRoles",
                baseType: core.BaseRole,
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
                    }
                }
            });

            self.addModel({
                type: core.Attachment,
                collectionName: "attachments",
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
                    }
                }
            });

            self.addModel({
                type: core.ProfilePictureAttachment,
                collectionName: "profilePictureAttachments",
                baseType: core.Attachment,
                properties: {

                }
            });

            self.addModel({
                type: core.LGEmployeeRole,
                collectionName: "LGEmployeeRoles",
                baseType: core.PersonRole,
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
                    }
                }
            });

            self.addModel({
                type: salesReporting.SalesAppUserReportingPersonRole,
                collectionName: "salesAppUserReportingPersonRole",
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
                type: sales.SalesAppUserPersonRole,
                collectionName: "salesAppUserPersonRoles",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    },
                    createdDate: {
                        type: Date
                    },
                    lastModifiedDate: {
                        type: Date
                    },
                    personId: {
                        type: Integer
                    },
                    person: {
                        type: core.Person
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
                type: salesReporting.ReportSetting,
                collectionName: "reportSettings",
                properties: {
                    id: {
                        type: Integer,
                        primaryKey: true
                    }
                }
            });

            self.addModel({
                type: salesReporting.OverviewReportFavoriteSetting,
                collectionName: "overviewReportFavoriteSettings",
                baseType: salesReporting.ReportSetting,
                properties: {
                    salesAppUserReportingPersonRoleId: {
                        type: Integer
                    },
                    salesAppUserReportingPersonRole: {
                        type: salesReporting.SalesAppUserReportingPersonRole
                    },
                    favorite: {
                        type: sales.SalesAppUserPersonRole
                    },
                    favoriteId: {
                        type: Integer
                    }
                }
            });


            self.addOneToOne({
                type: core.Person,
                hasKey: "id",
                hasOne: "ldapAccount",
                ofType: core.PersonLdapAccount,
                withKey: "id",
                withForeignKey: "id",
                withOne: "person"
            });


            self.addOneToMany({
                type: core.Person,
                hasKey: "id",
                hasMany: "roles",
                ofType: core.PersonRole,
                withKey: "id",
                withForeignKey: "personId",
                withOne: "person"
            });

            self.addOneToMany({
                type: core.Person,
                hasKey: "id",
                hasMany: "addresses",
                ofType: core.PersonAddress,
                withKey: "id",
                withForeignKey: "personId",
                withOne: "person"
            });

            self.addOneToMany({
                type: core.Person,
                hasKey: "id",
                hasMany: "emailAddresses",
                ofType: core.PersonEmailAddress,
                withKey: "id",
                withForeignKey: "personId",
                withOne: "person"
            });

            self.addOneToMany({
                type: core.Person,
                hasKey: "id",
                hasMany: "phoneNumbers",
                ofType: core.PersonPhoneNumber,
                withKey: "id",
                withForeignKey: "personId",
                withOne: "person"
            });




        }

        BASE.extend(Edm, BASE.data.Edm);

        return Edm;

    })();




});