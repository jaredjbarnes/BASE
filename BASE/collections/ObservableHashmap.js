BASE.require([
    "BASE.util.Observable",
    "BASE.util.ObservableEvent",
    "BASE.collections.Hashmap"
], function () {
    BASE.namespace("BASE.collections");

    BASE.collections.ObservableHashmap = (function (Super) {
        var ObservableHashmap = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ObservableHashmap();
            }

            Super.call(self);
            var _hashmap = new BASE.collections.Hashmap();

            self.add = function (key, object) {
                var returnValue = _hashmap.add(key, object);
                var event = new BASE.util.ObservableEvent("itemAdded");
                event.item = object;
                self.notify(event);
                return returnValue;
            };

            self.get = function (key) {
                return _hashmap.get(key);
            };

            self.remove = function (key) {
                var returnValue = _hashmap.remove(key);
                var event = new BASE.util.ObservableEvent("itemRemoved");
                event.item = returnValue;
                self.notify(event);
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

            self.onItemAdded = function (callback) {
                self.observe(callback, "itemAdded");
            };

            self.onItemRemoved = function (callback) {
                self.observe(callback, "itemRemoved");
            };

            self.removeOnItemAdded = function (callback) {
                self.unobserve(callback, "itemAdded");
            };

            self.removeOnItemRemoved = function (callback) {
                self.unobserve(callback, "itemRemoved");
            };

            return self;
        };

        BASE.extend(ObservableHashmap, Super);

        return ObservableHashmap;
    }(BASE.util.Observable));
});