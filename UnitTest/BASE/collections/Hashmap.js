BASE.require([
    "BASE.util.UnitTest",
    "BASE.util.UnitTestRunner",
    "BASE.async.Future",
    "BASE.collections.Hashmap"
], function () {
    BASE.namespace("UnitTest.BASE.collections");

    var Future = BASE.async.Future;

    var ExpectItToThrowWhenAKeyIsUndefinedOrNull = (function (Super) {
        var Test = function () {
            var self = this;
            if (!(self instanceof Test)) {
                return new Test();
            }

            Super.call(self, "UnitTest.BASE.collections.Hashmap: Expect it to throw when a key is undefined or null.");

            self.execute = function () {
                var hash = new BASE.collections.Hashmap();
                var passed = false;

                try {
                    hash.add(null, {});
                    passed = false;
                } catch (e) {
                    passed = true;
                }

                try {
                    hash.add(undefined, {});
                    passed = false;
                } catch (e) {
                    passed = true;
                }

                self.assert(passed, "Passed", "Failed");

                return Future.fromResult(self);
            }

            return self;
        };

        BASE.extend(Test, Super);

        return Test;
    }(BASE.util.UnitTest));

    UnitTest.BASE.collections.Hashmap = (function (Super) {
        var Hashmap = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Hashmap();
            }

            Super.call(self, "UnitTest.BASE.collections.Hashmap");

            var unitTests = self.children;

            unitTests.push(new ExpectItToThrowWhenAKeyIsUndefinedOrNull());

            self.getKeys = function () {
                var hash = new BASE.collections.Hashmap();
                var objKey = {};

                hash.add(objKey, objKey);
                hash.add("string", objKey);

                var result = {
                    passed: true,
                    message: "Passed"
                };

                var keys = [objKey, "string"];

                var hashKeys = hash.getKeys();
                var hasKeys = hashKeys.every(function (key) {
                    if (keys.indexOf(key) > -1) {
                        return true;
                    }
                    return false;
                });

                if (!hasKeys || hashKeys.length !== keys.length) {
                    result.passed = false;
                    result.message = "Failed to find keys.";
                }

                return result;
            };

            self.copy = function () {
                var hash = new BASE.collections.Hashmap();
                var objKey = {};

                hash.add(objKey, objKey);
                hash.add("string", objKey);

                var result = {
                    passed: true,
                    message: "Passed"
                };

                var copy = hash.copy();

                var passed = copy.getKeys().every(function (key) {
                    var value = hash.get(key);

                    return hash.hasKey(key) && hash.get(key) === copy.get(key);
                });

                if (!passed) {
                    result.passed = false;
                    result.message = "Failed to copy the hash.";
                }

                return result;
            };

            self.get = function () {
                var hash = new BASE.collections.Hashmap();
                var objKey = {};

                hash.add(objKey, objKey);
                hash.add("string", objKey);

                var result = {
                    passed: true,
                    message: "Passed"
                };

                var objKey = {};

                hash.add("getString", "string");

                if (!hash.get("getString")) {
                    result.passed = false;
                    result.message = "Objects weren't found on a get.";
                }

                hash.remove("getString");

                return result;
            };

            self.add = function () {
                var hash = new BASE.collections.Hashmap();
                var objKey = {};

                hash.add(objKey, objKey);
                hash.add("string", objKey);

                var result = {
                    passed: true,
                    message: "Passed"
                };

                if (!hash.hasKey("string") || !hash.hasKey(objKey)) {
                    result.passed = false;
                    result.message = "Keys weren't found.";
                }

                return result;
            };

            self.clear = function () {
                var hash = new BASE.collections.Hashmap();
                var objKey = {};

                hash.add(objKey, objKey);
                hash.add("string", objKey);

                var result = {
                    passed: true,
                    message: "Passed"
                };

                hash.clear();

                if (hash.getKeys().length !== 0) {
                    result.passed = false;
                    result.message = "Failed to clear the hash.";
                }

                return result;
            };

            self.remove = function () {
                var hash = new BASE.collections.Hashmap();
                var objKey = {};

                hash.add(objKey, objKey);
                hash.add("string", objKey);

                var keys = [objKey, "string"];

                var result = {
                    passed: true,
                    message: "Passed"
                };

                var hasArguments = keys.every(function (key) {
                    return hash.hasKey(key);
                });

                if (hasArguments) {
                    keys.forEach(function (key) {
                        hash.remove(key);
                    });
                }

                var notThere = keys.every(function (key) {
                    return hash.hasKey(key) === false;
                });

                if (!notThere) {
                    result.passed = false;
                    result.message = "Failed to remove keys from the hash.";
                }

                return result;
            };


            return self;
        };

        BASE.extend(Hashmap, Super);

        return Hashmap;
    }(BASE.util.UnitTestRunner));
});