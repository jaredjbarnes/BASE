BASE.require([
    "BASE.util.PropertyBehavior",
    "BASE.async.Future",
    "BASE.collections.ObservableArray"
], function () {
    BASE.namespace("BASE.data");

    var global = (function () { return this; }());
    var Future = BASE.async.Future;
    var ObservableArray = BASE.collections.ObservableArray;
    var PropertyBehavior = BASE.util.PropertyBehavior;

    BASE.data.Entity = function () {
        var self = this;
        var providers = {};

        BASE.assertNotGlobal(self);

        if (BASE.hasInterface(self, ["load", "registerProvider"])) {
            return;
        }

        // Make this entity's properties observable as well.
        PropertyBehavior.call(self);

        // Make collections observable.
        Object.keys(self).forEach(function (key) {
            if (Array.isArray(self[key])) {
                ObservableArray.call(self[key]);
            }
        });

        // This will load properties and array's on entities.
        self.load = function (property) {
            return new Future(function (setValue, setError) {
                if (!providers[property]) {
                    throw new Error("Couldn't find provider for specified property: " + property + ".");
                }

                if (self[property] === null) {
                    var getProvider = providers[property];
                    var future = getProvider(self, property);

                    if (!(future instanceof Future)) {
                        throw new Error("Expected provider to return a Future.");
                    }

                    future.then(function (value) {
                        self.loadProperty(property, value);
                        setValue(value);
                    }).ifError(setError);
                } else {
                    setValue(self[property]);
                }
            });
        };

        // This helps with registering navigable properties, and arrays found on the entity.
        self.registerProvider = function (property, getProvider) {
            providers[property] = getProvider;
        };

    };
});