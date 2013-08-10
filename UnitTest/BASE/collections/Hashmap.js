BASE.require(["BASE.util.UnitTest", "BASE.async.Future", "BASE.collections.Hashmap"], function () {
    BASE.namespace("UnitTest.BASE.collections");

    UnitTest.BASE.collections.Hashmap = (function (Super) {
        var Hashmap = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Hashmap();
            }

            Super.call(self, "UnitTest.BASE.collections.Hashmap");

            self.execute = function () {
                return new BASE.async.Future(function (setValue, setError) {
                    // Run your test here and set the value or error upon completion.
                    var results = [];

                    results.push(self.add());
                    results.push(self.remove());
                    results.push(self.clear());
                    results.push(self.get());
                    results.push(self.copy());
                    results.push(self.getKeys());
                    results.push(self.expectItToThrowWhenAKeyIsUndefinedOrNull());

                    var errorMessages = [];

                    var passed = results.every(function (result) {
                        if (result.passed === false) {
                            errorMessages.push(result.message);
                        }
                        return result.passed === true;
                    });

                    if (passed) {
                        self.message = "Passed";
                        setValue(self);
                    } else {
                        self.message = "Failed";
                        setError(self);
                    }

                });
            };

            self.expectItToThrowWhenAKeyIsUndefinedOrNull = function () {
                var hash = new BASE.collections.Hashmap();

                var result = {
                    passed: true,
                    message: "Passed"
                };


                try {
                    hash.add(null, {});
                    result.passed = false;
                    result.message = "Failed";
                } catch (e) {
                    result.passed = true;
                    result.message = "Passed";
                }

                try {
                    hash.add(undefined, {});
                    result.passed = false;
                    result.message = "Failed";
                } catch (e) {
                    result.passed = true;
                    result.message = "Passed";
                }

                return result;
            };

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
    }(BASE.util.UnitTest));
});