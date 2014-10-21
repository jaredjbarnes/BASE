BASE.require([
    "BASE.collections.Hashmap",
    "LG.core.dataModel.sales.Client",
    "LG.core.dataModel.sales.Opportunity",
    "LG.core.dataModel.sales.OpportunityStatus",
    "LG.core.dataModel.sales.ClientContactPersonRole",
    "LG.core.dataModel.sales.ClientAddress",
    "BASE.data.DataContext",
    "BASE.data.utils"
], function () {

    BASE.namespace("LG.core.dataModel.sales");

    var Hashmap = BASE.collections.Hashmap;
    var Future = BASE.async.Future;

    var Client = LG.core.dataModel.sales.Client
    var Opportunity = LG.core.dataModel.sales.Opportunity;
    var OpportunityStatus = LG.core.dataModel.sales.OpportunityStatus;
    var ClientContactPersonRole = LG.core.dataModel.sales.ClientContactPersonRole;
    var ClientAddress = LG.core.dataModel.sales.ClientAddress;
    var flattenEntity = BASE.data.utils.flattenEntity;
    var DataContext = BASE.data.DataContext;

    LG.core.dataModel.sales.DenormalizedClientCreator = function (syncer) {
        var self = this;

        BASE.assertNotGlobal(self);

        var activeService = syncer.getActiveService();
        var localService = syncer.getLocalService();

        var addedListeners = new Hashmap();
        var updatedListeners = new Hashmap();
        var removedListeners = new Hashmap();

        // Watch for adding entities.
        activeService.observe().filter(function (event) {
            return event.type === "added" && addedListeners.hasKey(event.entity.constructor);
        }).map(function (event) {
            return event.entity;
        }).onEach(function (entity) {
            var handler = addedListeners.get(entity.constructor) || function () { };

            var clone = flattenEntity(entity);
            var dataContext = new DataContext(localService);
            dataContext.loadEntity(clone);
            handler(clone);
        });

        // Watch for updating entities.
        activeService.observe().filter(function (event) {
            return event.type === "updated" && updatedListeners.hasKey(event.entity.constructor);
        }).map(function (event) {
            return event.entity;
        }).onEach(function (entity) {
            var handler = updatedListeners.get(entity.constructor) || function () { };

            var clone = flattenEntity(entity);
            var dataContext = new DataContext(localService);
            dataContext.loadEntity(clone);
            handler(clone);
        });

        //Watch for removed entities.
        activeService.observe().filter(function (event) {
            return event.type === "removed" && removedListeners.hasKey(event.entity.constructor);
        }).map(function (event) {
            return event.entity;
        }).onEach(function (entity) {
            var handler = removedListeners.get(entity.constructor) || function () { };

            var clone = flattenEntity(entity);
            var dataContext = new DataContext(localService);
            dataContext.loadEntity(clone);
            handler(clone);
        });


        // Client
        var addedClient = function (client) {
            client.load("denormalizedClient").then(function (denormalizedClient) {
                denormalizedClient.clientName = client.name;
                denormalizedClient.save();
            });
        };

        var updatedClient = addedClient;

        var statusLock = Future.fromResult();

        // Status
        var addedStatus = function (status) {
            status.load("opportunity").then(function (opportunity) {
                opportunity.load("client").then(function (client) {
                    statusLock.then(function () {
                        statusLock = new Future(function (setValue) {
                            client.load("denormalizedClient").then(function (denormalizedClient) {
                                denormalizedClient[status.type + "Count"] += 1;
                                denormalizedClient.save().then(setValue);
                            });
                        });
                    });
                });
            });
        };


        var updatedStatus = function (status) {
            if (status.endDate !== null) {
                status.load("opportunity").then(function (opportunity) {
                    opportunity.load("client").then(function (client) {
                        statusLock.then(function () {
                            statusLock = new Future(function (setValue) {
                                client.load("denormalizedClient").then(function (denormalizedClient) {
                                    denormalizedClient[status.type + "Count"] -= 1;
                                    denormalizedClient.save().then(setValue);
                                });
                            });
                        });
                    });
                });
            }
        };

        //Client Address
        var addedClientAddress = function (clientAddress) {
            clientAddress.load("client").then(function (client) {
                client.load("denormalizedClient").then(function (denormalizedClient) {
                    denormalizedClient.longitude = clientAddress.longitude;
                    denormalizedClient.latitude = clientAddress.latitude;
                    denormalizedClient.save();
                });
            });
        };

        //Client Contact
        var addedClientContact = function (clientContact) {
            if (clientContact.type === "Primary") {
                clientContact.load("client").then(function (client) {
                    client.load("denormalizedClient").then(function (denormalizedClient) {
                        denormalizedClient.firstName = clientContact.firstName;
                        denormalizedClient.lastName = clientContact.lastName;

                        clientContact.load("phoneNumber").then(function (phoneNumber) {
                            if (phoneNumber !== null) {
                                denormalizedClient.phoneNumber = (phoneNumber.countryCode || "") + (phoneNumber.areaCode || "") + (phoneNumber.lineNumber || "");
                                denormalizedClient.save();
                            }
                        });

                    });
                });
            }
        };

        //Opportunity
        var addedOpportunity = function (opporturnity) {
            opporturnity.load("client").then(function (client) {
                client.opportunities.asQueryable().orderBy(function (e) {
                    return e.property("policyExpirationDate");
                }).take(1).firstOrDefault().then(function (opportunity) {
                    if (opportunity !== null) {
                        client.load("denormalizedClient").then(function (denormalizedClient) {
                            denormalizedClient.expiring = opportunity.policyExpirationDate;
                            denormalizedClient.save();
                        });
                    }
                });
            });
        };

        var updatedOppportunity = addedOpportunity;

        // Bind listeners by type.
        addedListeners.add(Client, addedClient);
        addedListeners.add(OpportunityStatus, addedStatus);
        addedListeners.add(ClientAddress, addedClientAddress);
        addedListeners.add(ClientContactPersonRole, addedClientContact);
        addedListeners.add(Opportunity, addedOpportunity);

        updatedListeners.add(Client, updatedClient);
        updatedListeners.add(OpportunityStatus, updatedStatus);
        updatedListeners.add(Opportunity, updatedOppportunity);

    };
});