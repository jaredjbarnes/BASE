BASE.require([
    "BASE.behaviors.Observable"
], function () {

    var defaultProperties = (function () {
        var properties = {};
        var obj = {};

        for (var x in obj) {
            properties[x] = true;
        }

        return properties;
    });

    BASE.namespace("BASE.behaviors");

    BASE.behaviors.NotifyPropertyChange = function () {
        var self = this;

        BASE.assertNotGlobal(self);

        // Make sure that this object has observable functionality.
        BASE.behaviors.Observable.call(self);

        var attach = function (property) {
            var pascalCased = property.substr(0, 1).toUpperCase() + property.substr(1);
            var getterName = "get" + pascalCased;
            var setterName = "set" + pascalCased;

            self[getterName] = function () {
                return self[property];
            };

            self[setterName] = function (newValue) {
                var oldValue = self[property];
                if (oldValue !== newValue) {
                    self[property] = newValue;
                    self.notify({
                        type: property,
                        property: property,
                        oldValue: oldValue,
                        newValue: newValue
                    });
                }
            };
        };

        for (var property in self) (function (property) {
            if (typeof self[property] !== "function" && !defaultProperties[property]) {
                attach(property);
            }
        }(property));

        self.observeProperty = function (propertyName, callback) {
            return self.observe().filter(function (e) {
                if (typeof e.property !== "undefined" && e.property === propertyName) {
                    return true;
                }
                return false;
            }).onEach(callback);
        };

        self.observeAllProperties = function (callback) {
            return self.observe().filter(function (e) {
                return typeof e.property  === "undefined"? false : true;
            }).onEach(callback);
        };

        self.implementsNotifyPropertyChange = true;

    };

});