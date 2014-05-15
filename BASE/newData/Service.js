BASE.require([
"BASE.collections.Hashmap"
], function () {

    BASE.namespace("BASE.data");

    var Hashmap = BASE.collections.Hashmap;

    BASE.data.Service = function () {
        var self = this;

        var dataStores = new Hashmap();

        self.addDataStore = function (Type, dataStore) {
            dataStores.add(Type, dataStore);
        };

        self.getDataStore = function (Type) {
            return dataStores.get(Type);
        };

    };

});