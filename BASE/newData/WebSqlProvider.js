BASE.require([
    ""
], function () {

    var Future = BASE.async.Future;

    BASE.data.WebSqlProvider = function () {
        var self = this;

        BASE.assertNotGlobal(self);

        self.load = function (databaseName) {
            return new Future(function () { });
        };

    };


    BASE.data.WebSqlProvider.DatabaseBuilder = function (databaseName) {
        var self = this;
        BASE.assertNotGlobal(self);

        self.addTable = function () { };
        self.addRelationship = function () { };

        self.commit = function () { };
    };


});