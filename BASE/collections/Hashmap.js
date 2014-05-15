BASE.require([
    "BASE.util.Guid"
], function () {

    var Guid = BASE.util.Guid.create;

    BASE.namespace("BASE.collections");

    BASE.collections.Hashmap = (function () {
        var Hashmap = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Hashmap();
            }
            var hash = {};
            // This allows us to pull the keys back as Objects on getKeys();
            var keyToObjectKey = {};

            self.add = function (key, object) {

                if (key === null || typeof key === "undefined") {
                    throw new Error("Cannot add an object with a null or undefined key. object: " + object);
                }

                if (typeof key === "string" || typeof key === "number") {
                    keyToObjectKey[key] = key;
                    hash[key] = object;
                    return;
                }

                if (!key._hash) {
                    key._hash = Guid();
                }

                keyToObjectKey[key._hash] = key;
                hash[key._hash] = object;
            };

            self.get = function (key) {
                if (key === null || typeof key === "undefined") {
                    return null;
                }

                if (typeof key === "string" || typeof key === "number") {
                    return typeof hash[key] === "undefined" ? null : hash[key];
                }

                if (key._hash && hash[key._hash]) {
                    return hash[key._hash]
                }

                return null;
            };

            self.remove = function (key) {
                if (key === null || typeof key === "undefined") {
                    return null;
                }

                var value = null;
                if (typeof key === "string" || typeof key === "number") {
                    value = hash[key];
                    delete hash[key];
                    delete keyToObjectKey[key];
                    return value || null;
                }
                if (key._hash && hash[key._hash]) {
                    value = hash[key._hash];
                    delete hash[key._hash];
                    delete keyToObjectKey[key._hash];
                    return value;
                }

                return value;
            };

            self.clear = function () {
                self.getKeys().forEach(function (key) {
                    self.remove(key);
                });
            };

            self.hasKey = function (key) {
                if (key === null || typeof key === "undefined") {
                    return false;
                }
                if (typeof key === "string" || typeof key === "number") {
                    return hash[key] ? true : false;
                }

                if (key._hash && hash.hasOwnProperty([key._hash])) {
                    return true;
                }
                return false;
            };


            self.getKeys = function () {
                var keys = [];
                Object.keys(hash).forEach(function (key) {
                    keys.push(keyToObjectKey[key]);
                });

                return keys;
            };

            self.getValues = function () {
                var values = [];
                var keys = self.getKeys();
                keys.forEach(function (key) {
                    values.push(self.get(key));
                });
                return values;
            };

            self.copy = function () {
                var copy = new Hashmap();
                self.getKeys().forEach(function (key) {
                    copy.add(key, self.get(key));
                });
                return copy;
            };

            return self;
        };

        return Hashmap;
    }());
});