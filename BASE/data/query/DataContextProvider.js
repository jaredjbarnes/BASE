BASE.require([
    "BASE.async.Future",
    "BASE.query.Provider"
], function () {
    BASE.namespace("BASE.data.query");

    var Future = BASE.async.Future;
    var Provider = BASE.query.Provider;

    BASE.data.query.DataContextProvider = (function (Super) {
        var DataContextProvider = function (dataContext) {
            var self = this;
            BASE.assertNotGlobal(self);

            Super.call(self);

            self.toArray = self.execute = function () {

            };
        };

        BASE.extend(DataContextProvider, Super);

        return DataContextProvider;
    }(Provider));

});