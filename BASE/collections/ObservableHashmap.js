BASE.require([
    "BASE.collections.Hashmap"
], function () {
    BASE.namespace("BASE.collections");

    BASE.collections.ObservableHashmap = (function (Super) {
        var ObservableHashmap = function () {
            var self = this;
            
            BASE.assertInstance(self);

            Super.call(self);
            var _hashmap = new BASE.collections.Hashmap();

            self.add = function (key, object) {
                var returnValue = _hashmap.add(key, object);
                var event = { type: "itemAdded" };
                event.item = object;
                self.notify(event);
                return returnValue;
            };

            self.get = function (key) {
                return _hashmap.get(key);
            };

            self.remove = function (key) {
                var returnValue = _hashmap.remove(key);
                var event = { type: "itemRemoved" };
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

            return self;
        };

        BASE.extend(ObservableHashmap, Super);

        return ObservableHashmap;
    }(BASE.Observable));
});