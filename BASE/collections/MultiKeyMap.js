BASE.require([
    "BASE.collections.Hashmap",
    "Array.prototype.forEach"
], function () {
    BASE.namespace("BASE.collections");

    BASE.collections.MultiKeyMap = (function (Super) {

        var MultiKeyMap = function () {

            var self = this;

            var nestedHash = new BASE.collections.Hashmap();

            if (!(self instanceof arguments.callee)) {
                return new MultiKeyMap();
            }

            var setup = function (key1, key2) {
                if (!nestedHash.hasKey(key1)) {
                    nestedHash.add(key1, new BASE.collections.Hashmap());
                }
            };

            self.add = function (key1, key2, value) {
                if (arguments.length === 3) {
                    setup(key1, key2);

                    var key2Hash = nestedHash.get(key1);
                    key2Hash.add(key2, value);
                } else {
                    if (key2 instanceof BASE.collections.Hashmap) {
                        nestedHash.add(key1, key2);
                    } else {
                        throw new Error("Invalid parameters.");
                    }
                }

            };

            self.get = function (key1, key2) {
                if (nestedHash.hasKey(key1)) {
                    if (key2 !== null && typeof key2 !== "undefined") {
                        var key2Hash = nestedHash.get(key1);
                        var value = key2Hash.get(key2);

                        return value ? value : null;
                    } else {
                        return nestedHash.get(key1);
                    }
                } else {
                    return null;
                }
            };

            self.remove = function (key1, key2) {
                if (nestedHash.hasKey(key1)) {
                    if (key2 !== null && typeof key2 !== "undefined") {
                        var key2Hash = nestedHash.get(key1);
                        var value = key2Hash.remove(key2);

                        if (key2Hash.getKeys().length === 0) {
                            nestedHash.remove(key1);
                        }

                        return value;
                    } else {
                        return nestedHash.remove(key1);
                    }
                } else {
                    return null;
                }
            };

            self.copy = function () {
                var copy = new MultiKeyMap();

                nestedHash.getKeys().forEach(function (key) {
                    nestedHash.get(key).getKeys().forEach(function (nestedKey) {
                        copy.add(key, nestedKey, self.get(key, nestedKey));
                    });
                });

                return copy;
            };

            self.clear = function () {
                self.getKeys().forEach(function (key) {
                    self.remove(key);
                });
            };

            self.getKeys = function () {
                return nestedHash.getKeys();
            };

            self.hasKey = function (key1, key2) {
                return self.get(key1, key2) ? true : false;
            };

        };

        BASE.extend(MultiKeyMap, Super);

        return MultiKeyMap;
    }(Object));
});