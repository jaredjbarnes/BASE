BASE.require([
    "BASE.util.Observable",
    "BASE.collections.Hashmap"
], function () {
    BASE.namespace("BASE.collections");
    var global = (function () { return this;}());
    BASE.collections.ObservableHashmap = (function (Super) {
        var ObservableHashmap = function () {
            var self = this;
            if (self === global) {
                throw new Error("ObservableHashmap's constructor was executed in the global scope.");
            }

            Super.call(self);
            var _hashmap = new BASE.collections.Hashmap();

            self.add = function (key, object) {
                var returnValue = _hashmap.add(key, object);

                self.notify({
                    type: "itemAdded",
                    item: object
                });

                return returnValue;
            };

            self.get = function (key) {
                return _hashmap.get(key);
            };

            self.remove = function (key) {
                var returnValue = _hashmap.remove(key);
                self.notify({
                    type: "itemRemoved",
                    item: returnValue
                });
                return returnValue;
            };

            self.hasKey = function (key) {
                return _hashmap.hasKey(key);
            };

            self.getKeys = function () {
                return _hashmap.getKeys();
            };

            self.copy = function () {
                var copy = new ObservableHashmap();
                _hashmap.getKeys().forEach(function (key) {
                    copy.add(key, _hashmap.get(key));
                });

                return copy;
            };

            return self;
        };

        BASE.extend(ObservableHashmap, Super);

        return ObservableHashmap;
    }(BASE.util.Observable));
});