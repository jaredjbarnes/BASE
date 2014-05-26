BASE.require([
    ""
], function () {

    /*
        This is just a template of a data store.
        All that's needed to make a data store is an instance that 
        implements this interface.

        Look at InMemoryDataStore to view a working DataStore.
    */

    BASE.namespace("BASE.data");

    BASE.data.DataStore = function () {
        var self = this;

        BASE.assertNotGlobal(self);

        self.add = function (obj) {
            // return a Future<AddedResponse>
            throw new Error("This method is expected to be overridden.");
        };

        self.update = function (id, updates) {
            // return a Future<UpdatedResponse>
            throw new Error("This method is expected to be overridden.");
        };

        self.remove = function (obj) {
            // return a Future<RemovedResponse>
            throw new Error("This method is expected to be overridden.");
        };

        self.asQueryable = function () {
            // return a Queryable
            throw new Error("This method is expected to be overridden.");
        };

        self.initialize = function () {
            // Return a Future.
            throw new Error("This method is expected to be overridden.");
        };

        self.dispose = function () {
            // Return a Future.
            throw new Error("This method is expected to be overridden.");
        };


    };

});