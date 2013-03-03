(function () {
    function GUID() {
        var S4 = function () {
            return Math.floor(
                    Math.random() * 0x10000 /* 65536 */
                ).toString(16);
        };

        return (
                S4() + S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + "-" +
                S4() + S4() + S4()
            );
    }

    BASE.Hashmap = (function () {
        var Hashmap = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Hashmap();
            }
            var hash = Object.create(null);

            self.add = function (key, object) {

                if (!key) {
                    throw new Error("Cannot add an object with a null or undefined key. object: " + object);
                }

                if (typeof key === "string") {
                    hash[key] = object;
                    return;
                }

                if (!key._hash) {
                    key._hash = GUID();
                }

                hash[key._hash] = object;
            };

            self.get = function (key) {
                if (key === null || typeof key === "undefined") {
                    return null;
                }

                if (typeof key === "string") {
                    return hash[key] || null;
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

                var value = hash[key];
                if (typeof key === "string") {
                    value = hash[key];
                    delete hash[key];
                    return value;
                }
                if (key._hash && hash[key._hash]) {
                    value = hash[key._hash];
                    delete hash[key._hash];
                    return value;
                }
            };

            self.hasKey = function (key) {
                if (key === null || typeof key === "undefined") {
                    return false;
                }
                if (typeof key === "string") {
                    return hash[key] ? true : false;
                }

                if (key._hash && hash[key._hash]) {
                    return true;
                }
                return false;
            };


            self.getKeys = function () {
                return Object.keys(hash);
            };
            return self;
        };

        return Hashmap;
    }());

})();