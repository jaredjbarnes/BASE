BASE.require([], function () {

    BASE.namespace("BASE.data");

    BASE.data.CRUDProvider = (function () {

        var CRUDProvider = function () {
            var self = this;

            self.createEntity = function (dto) { };

            self.readEntity = function (id) { };

            self.updateEntity = function (id) { };

            self.deleteEntity = function (id) { };


            self.readEntities = function (queryable) {

            };

            self.updateEntities = function (queryable) {

            };

            self.deleteEntities = function (queryable) {

            };

        };

        return CRUDProvider;
    }());


});