BASE.require([
    "BASE.async.Future"
], function () {
    var Future = BASE.async.Future;

    BASE.async.Fulfillment = function () {
        var self = this;
        var innerSetValue;
        var innerSetError;

        Future.apply(self, [function (setValue, setError) {
            innerSetValue = setValue;
            innerSetError = setError;
        }]);

        self.then();

        self.setValue = innerSetValue;
        self.setError = innerSetError;
    };

});