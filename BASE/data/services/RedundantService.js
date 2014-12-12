BASE.require([
    "BASE.data.sync.ChangeTracker"
], function () {

    var ChangeTracker = BASE.data.sync.ChangeTracker;
    var Future = BASE.async.Future;
    var Task = BASE.async.Task;

    BASE.namespace("BASE.data.services");

    BASE.data.services.RedundantService = function (primaryService, secondaryService) {
        var self = this;

        var changeTracker = null;
        var modifyEdm = function () { };

        self.add = function (entity) {

        };

        self.update = function (entity, updates) {

        };

        self.remove = function (entity) {

        };

        // All Navigation will try remote first, then go local and convert the ent
        self.getSourcesOneToOneTargetEntity = function (sourceEntity, relationship) {

        };

        self.getTargetsOneToOneSourceEntity = function (targetEntity, relationship) {

        };

        self.getSourcesOneToManyQueryProvider = function (sourceEntity, relationship) {

        };

        self.getTargetsOneToManySourceEntity = function (targetEntity, relationship) {

        };

        self.getSourcesManyToManyQueryProvider = function (sourceEntity, relationship) {

        };

        self.getTargetsManyToManyQueryProvider = function (targetEntity, relationship) {

        };

        self.getQueryProvider = function (Type) {

        };

        self.asQueryable = function (Type) {
            throw new Error("This was meant to be overridden.");
        };

        self.getEdm = function () {
            throw new Error("This was meant to be overridden.");
        };

        self.supportsType = function (Type) {
            throw new Error("This was meant to be overridden.");
        };

        self.initialize = function () {
            throw new Error("This was meant to be overridden.");
        };

        self.dispose = function () {
            throw new Error("This was meant to be overridden.");
        };

        secondaryService = new SecondaryServiceType();
        changeTracker = new ChangeTracker(localService, remoteService);
    };

});