/// <reference path="/scripts/BASE.js" />
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

    BASE.Hashmap = BASE.defineClass(Object, function () {
        var self = this;

        var hash = {};

        self.add = function (key, object) {
            if (typeof key === "string") {
                hash[key] = object;
                return;
            }

            if (!key.hash) {
                key.hash = GUID();
            }

            hash[key.hash] = object;
        };

        self.get = function (key) {
            if (typeof key === "string") {
                return hash[key] || null;
            }

            if (key.hash && hash[key.hash]) {
                return hash[key.hash]
            }
            return null;
        };

        self.remove = function (key) {
            if (typeof key === "string") {
                delete hash[key];
                return;
            }
            if (key.hash && hash[key.hash]) {
                delete hash[key.hash];
            }
        };

        self.hasKey = function (key) {
            if (typeof key === "string") {
                return hash[key] ? true : false;
            }

            if (key.hash && hash[key.hash]) {
                return true;
            }
            return false;
        };


        return self;
    });

})();