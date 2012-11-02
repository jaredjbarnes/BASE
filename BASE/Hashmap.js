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
            if (!key.hash) {
                key.hash = GUID();
            }

            hash[key.hash] = object;
        };

        self.get = function (key) {
            if (key.hash && hash[key.hash]) {
                return hash[key.hash]
            }
            return null;
        };

        self.remove = function (key) {
            if (key.hash && hash[key.hash]) {
                delete hash[key.hash];
            }
        };

        self.hasKey = function (key) {
            if (key.hash) {
                return true;
            }
            return false;
        };


        return self;
    });

})();