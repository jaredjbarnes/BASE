BASE.require(["BASE.Hashmap"], function () {
    BASE.namespace("LEAVITT.entities");

    BASE.MultiKeyMap = (function (Super) {

        var MultiKeyMap = function () {

            var self = this;

            var nestedHash = new BASE.Hashmap();

            if (!(self instanceof arguments.callee)) {
                return new MultiKeyMap();
            }

            var setup = function (key1, key2) {
                if (!nestedHash.hasKey(key1)) {
                    nestedHash.add(key1, new BASE.Hashmap());
                }
            };

            self.add = function (key1, key2, value) {
                setup(key1, key2);

                var key2Hash = nestedHash.get(key1);
                key2Hash.add(key2, value);
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

            self.hasKey = function (key1, key2) {
                return self.get(key1, key2) ? true : false;
            }
        };

        BASE.extend(MultiKeyMap, Super);

        return MultiKeyMap;
    }(Object));
});