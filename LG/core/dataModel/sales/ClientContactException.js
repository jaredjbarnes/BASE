BASE.require([
    "BASE.web.ajax",
    "LG.core.dataModel.sales.ClientContactPersonRole",
    "BASE.data.sync.Mutator",
    "BASE.data.DataContext",
    "BASE.data.utils",
    "BASE.collections.Hashmap",
    "salesApp.util.RPCService"
], function () {

    BASE.namespace("LG.core.dataModel.sales");

    var ClientContactPersonRole = LG.core.dataModel.sales.ClientContactPersonRole;
    var Client = LG.core.dataModel.sales.Client;
    var Person = LG.core.dataModel.core.Person;
    var EmailAddress = LG.core.dataModel.core.PersonEmailAddress;
    var PhoneNumber = LG.core.dataModel.core.PersonPhoneNumber;
    var Address = LG.core.dataModel.core.PersonAddress;
    var Task = BASE.async.Task;
    var Future = BASE.async.Future;
    var Mutator = BASE.data.sync.Mutator;
    var flattenEntity = BASE.data.utils.flattenEntity;
    var convertDto = BASE.data.utils.convertDtoToJavascriptEntity;
    var RPCService = salesApp.util.RPCService;
    var DataContext = BASE.data.DataContext;
    var Hashmap = new BASE.collections.Hashmap;

    var rpcService = new RPCService();

    var notExpired = function (e) {
        return e.property("endDate").isEqualTo(null);
    };

    LG.core.dataModel.sales.ClientContactException = function (syncer) {
        var self = this;

        BASE.assertNotGlobal(self);

        var localService = syncer.getLocalService();
        var remoteService = syncer.getRemoteService();
        var syncService = syncer.getSyncService();

        var edm = localService.getEdm();
        var clientContactModel = edm.getModelByType(ClientContactPersonRole);
        var tableName = clientContactModel.collectionName;
        var mutator = new Mutator(syncService, edm);

        var personModel = edm.getModelByType(Person);
        var phoneNumberModel = edm.getModelByType(PhoneNumber);
        var emailAddressModel = edm.getModelByType(EmailAddress);
        var addressModel = edm.getModelByType(Address);
        var clientModel = edm.getModelByType(Client);
        var clientContactPersonRoleModel = edm.getModelByType(ClientContactPersonRole);

        var getClientContactPersonRoles = function (dataContext, entity) {
            return new Future(function (setValue, setError) {
                var syncDataContext = new DataContext(syncService);
                dataContext.loadEntity(entity);

                return dataContext.clientContactPersonRoles.where(function (e) {
                    return e.property("personId").isEqualTo(entity.id);
                }).toArray(function (roles) {
                    var returnValue = [];

                    var task = new Task();
                    roles.forEach(function (role) {
                        task.add(new Future(function (setValue, setError) {
                            syncDataContext.primaryKeys.where(function (e) {
                                return e.and(e.property("tableName").isEqualTo(tableName),
                                    e.property("local").isEqualTo(role.id));
                            }).firstOrDefault().then(function (primaryKey) {
                                if (primaryKey.remote === null) {
                                    returnValue.push(role);
                                    setValue();
                                }
                            });
                        }));
                    });

                    task.start().whenAll(function () {
                        setValue(returnValue);
                    });
                });

            });
        };

        syncer.addSyncException(Person, "add", function (entity) {
            return new Future(function (setValue, setError) {
                var dataContext = new DataContext(localService);

                getClientContactPersonRoles(dataContext, entity).then(function (clientContactPersonRoles) {
                    if (clientContactPersonRoles.length > 0) {
                        var task = new Task();
                        clientContactPersonRoles.forEach(function (clientContact) {
                            task.add(new Future(function (setValue, setError) {
                                clientContact.load("person").then(function (person) {

                                    var remoteClient = null;
                                    var task = new Task();

                                    task.add(person.phoneNumbers.asQueryable().where(notExpired).firstOrDefault());
                                    task.add(person.emailAddresses.asQueryable().where(notExpired).firstOrDefault());
                                    task.add(person.addresses.asQueryable().where(notExpired).firstOrDefault());
                                    task.add(new Future(function (setValue, setError) {

                                        clientContact.load("client").then(function (client) {
                                            var syncDataContext = new DataContext(syncService);
                                            syncDataContext.primaryKeys.where(function (e) {
                                                return e.and(e.property("tableName").isEqualTo("clients"),
                                                    e.property("local").isEqualTo(client.id));
                                            }).firstOrDefault().then(function (primaryKey) {

                                                remoteClient = flattenEntity(client);


                                                if (primaryKey.remote === null) {
                                                    remoteClient.id = undefined;
                                                    mutator.toRemote(remoteClient).then(function () {

                                                        remoteService.add(remoteClient).then(function (response) {
                                                            var entity = response.entity;

                                                            syncDataContext.primaryKeys.where(function (e) {
                                                                return e.and(e.property("tableName").isEqualTo(clientModel.collectionName),
                                                                             e.property("local").isEqualTo(client.id));
                                                            }).firstOrDefault().then(function (primaryKey) {
                                                                primaryKey.remote = entity.id;
                                                                primaryKey.load("status").then(function (status) {
                                                                    status.status = "loaded";
                                                                    status.load("data").then(function (data) {
                                                                        syncDataContext.statusData.remove(data);
                                                                        syncDataContext.saveChanges().then(setValue);
                                                                    });
                                                                });
                                                            });

                                                        }).ifError(function (e) {
                                                            throw e;
                                                        });

                                                    });
                                                } else {
                                                    mutator.toRemote(remoteClient).then(function () {
                                                        mutator.swapPrimaryKeysToRemote(remoteClient).then(setValue);
                                                    });
                                                }
                                            });

                                        });
                                    }));

                                    task.start().whenAll(function () {
                                        var postData = {};

                                        var phoneNumber = person.phoneNumbers[0];
                                        var emailAddress = person.emailAddresses[0];
                                        var address = person.addresses[0];

                                        postData.SalesAppUserPersonRoleId = localStorage.salesAppUserPersonRoleRemoteId
                                        postData.ClientId = remoteClient.id;
                                        postData.FirstName = person.firstName;
                                        postData.LastName = person.lastName;

                                        if (phoneNumber) {
                                            postData.PhoneNumber = phoneNumber.areaCode + phoneNumber.lineNumber;
                                        }

                                        if (emailAddress) {
                                            postData.EmailAddress = emailAddress.address;
                                        }

                                        if (address) {
                                            postData.Street1 = address.street1;
                                            postData.Street2 = address.street2;
                                            postData.City = address.city;
                                            postData.State = address.state;
                                            postData.Zip = address.zip;
                                            postData.Country = address.country;
                                            postData.County = address.county;
                                        }

                                        rpcService.setAppIdAndToken(56, localStorage.token);
                                        rpcService.addClientContact(postData).then(function (response) {
                                            var data = response.data.Data;

                                            var remotePersonDto = data.filter(function (item) {
                                                return item._type === "Person";
                                            })[0];

                                            var remoteClientContactDto = data.filter(function (item) {
                                                return item._type === "ClientContactPersonRole";
                                            })[0];

                                            var remoteEmailAddressDto = data.filter(function (item) {
                                                return item._type === "PersonEmailAddress";
                                            })[0];

                                            var remotePhoneNumberDto = data.filter(function (item) {
                                                return item._type === "PersonPhoneNumber";
                                            })[0];

                                            var remoteAddressDto = data.filter(function (item) {
                                                return item._type === "PersonAddress";
                                            })[0];

                                            var remotePerson = convertDto(Person, remotePersonDto);
                                            var remoteClientContact = convertDto(ClientContactPersonRole, remoteClientContactDto);

                                            var syncDataContext = new DataContext(syncService);

                                            var task = new Task();

                                            var personFuture = new Future(function (setValue, setError) {

                                                syncDataContext.primaryKeys.where(function (e) {
                                                    return e.and(e.property("tableName").isEqualTo(personModel.collectionName),
                                                                 e.property("local").isEqualTo(person.id));
                                                }).firstOrDefault().then(function (primaryKey) {
                                                    primaryKey.remote = remotePerson.id;
                                                    primaryKey.load("status").then(function (status) {
                                                        status.status = "loaded";
                                                        status.load("data").then(function (data) {
                                                            syncDataContext.statusData.remove(data);
                                                            setValue();
                                                        });
                                                    });
                                                });

                                            });

                                            task.add(personFuture);

                                            var clientContactPersonRoleFuture = new Future(function (setValue, setError) {

                                                syncDataContext.primaryKeys.where(function (e) {
                                                    return e.and(e.property("tableName").isEqualTo(clientContactModel.collectionName),
                                                                 e.property("local").isEqualTo(clientContact.id));
                                                }).firstOrDefault().then(function (primaryKey) {
                                                    primaryKey.remote = remoteClientContact.id;
                                                    primaryKey.load("status").then(function (status) {
                                                        status.status = "loaded";
                                                        status.load("data").then(function (data) {
                                                            syncDataContext.statusData.remove(data);
                                                            setValue();
                                                        });
                                                    });
                                                });

                                            });

                                            task.add(clientContactPersonRoleFuture);

                                            if (phoneNumber) {
                                                var phoneNumberFuture = new Future(function (setValue, setError) {
                                                    var remotePhoneNumber = convertDto(PhoneNumber, remotePhoneNumberDto);

                                                    syncDataContext.primaryKeys.where(function (e) {
                                                        return e.and(e.property("tableName").isEqualTo(phoneNumberModel.collectionName),
                                                                     e.property("local").isEqualTo(phoneNumber.id));
                                                    }).firstOrDefault().then(function (primaryKey) {
                                                        primaryKey.remote = remotePhoneNumber.id;
                                                        primaryKey.load("status").then(function (status) {
                                                            status.status = "loaded";
                                                            status.load("data").then(function (data) {
                                                                syncDataContext.statusData.remove(data);
                                                                setValue();
                                                            });
                                                        });
                                                    });

                                                });
                                                task.add(phoneNumberFuture);
                                            }

                                            if (emailAddress) {
                                                var emailAddressFuture = new Future(function (setValue, setError) {
                                                    var remoteEmailAddress = convertDto(EmailAddress, remoteEmailAddressDto);

                                                    syncDataContext.primaryKeys.where(function (e) {
                                                        return e.and(e.property("tableName").isEqualTo(emailAddressModel.collectionName),
                                                                     e.property("local").isEqualTo(emailAddress.id));
                                                    }).firstOrDefault().then(function (primaryKey) {
                                                        primaryKey.remote = remoteEmailAddress.id;
                                                        primaryKey.load("status").then(function (status) {
                                                            status.status = "loaded";
                                                            status.load("data").then(function (data) {
                                                                syncDataContext.statusData.remove(data);
                                                                setValue();
                                                            });
                                                        });
                                                    });

                                                });
                                                task.add(emailAddressFuture);
                                            }

                                            if (address) {
                                                var addressFuture = new Future(function (setValue, setError) {
                                                    var remoteAddress = convertDto(Address, remoteAddressDto);

                                                    syncDataContext.primaryKeys.where(function (e) {
                                                        return e.and(e.property("tableName").isEqualTo(addressModel.collectionName),
                                                                     e.property("local").isEqualTo(address.id));
                                                    }).firstOrDefault().then(function (primaryKey) {
                                                        primaryKey.remote = remoteAddress.id;
                                                        primaryKey.load("status").then(function (status) {
                                                            status.status = "loaded";
                                                            status.load("data").then(function (data) {
                                                                syncDataContext.statusData.remove(data);
                                                                setValue();
                                                            });
                                                        });
                                                    });

                                                });
                                                task.add(addressFuture);
                                            }

                                            task.start().whenAll(function () {
                                                syncDataContext.saveChanges().then(setValue);
                                            });
                                        });

                                    });

                                });
                            }));
                        });

                        task.start().whenAll(function () {
                            setValue(true);
                        });
                    } else {
                        setValue(false);
                    }
                });
            });
        });
    };

});