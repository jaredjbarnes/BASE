BASE.require([
    "BASE.util.Observable"
], function () {

    BASE.namespace("BASE.unitTest");
    var Task = BASE.async.Task;
    var Future = BASE.async.Future;

    var shallowInspect = function (obj) {
        var string = "";
        if (Array.isArray(obj)) {
            string += "[" + obj.join(", ") + "]";
        } else if (typeof obj === "object" && obj !== null) {
            string += "{";
            Object.keys(obj).forEach(function (key) {
                var value = obj[key];
                if (Array.isArray(value)) {
                    string += key + ": [object Array],"
                } else if (typeof value === "number" || typeof value === "object") {
                    string += key + ": " + obj[key].toString() + ","
                } else if (typeof value === "string") {
                    string += key = ": \"" + value + "\,"
                }
            });

            string = string.substring(0, string.length - 1);
            string += "}";
        } else if (obj === null) {
            string = null;
        } else if (typeof obj === "string") {
            string = "\"" + obj + "\"";
        } else if (typeof obj === "number") {
            string = obj;
        } else if (typeof obj === "undefined") {
            string = "undefined";
        } else {
            string = obj.toString();
        }

        return string;
    };

    BASE.unitTest.Expectation = function (futureValue) {
        var self = this;
        BASE.assertNotGlobal(self);

        BASE.util.Observable.call(self);

        if (!(futureValue instanceof Future)) {
            futureValue = Future.fromResult(futureValue);
        }

        var check = function (compareValue, checkValueFn, jobTitle) {
            jobTitle = jobTitle || "";

            if (!(compareValue instanceof Future)) {
                compareValue = Future.fromResult(compareValue);
            }

            if (typeof checkValueFn.success !== "function") {
                throw new Error("The evaluating function doesn't have success handling support.");
            }

            if (typeof checkValueFn.failure !== "function") {
                throw new Error("The evaluating function doesn't have failure handling support.");
            }

            return new Future(function (setValue, setError) {

                var task = new Task(futureValue, compareValue);
                task.start().whenAll(function (futures) {
                    var value = futures[0].value;
                    var resultValue = futures[1].value;

                    if (checkValueFn(value, resultValue)) {
                        self.notify({
                            type: "success",
                            message: jobTitle + " (" + checkValueFn.success(value, resultValue) + ")",
                            values: [value, resultValue]
                        });
                    } else {
                        self.notify({
                            type: "failure",
                            message: jobTitle + " (" + checkValueFn.failure(value, resultValue) + ")",
                            values: [value, resultValue]
                        });
                    }
                });

            }).then();
        };

        var toBeEqualTo = function (value, resultValue) {
            if (value === resultValue) {
                return true;
            }
            return false;
        };

        toBeEqualTo.success = function (value, resultValue) {
            return "Passed " + shallowInspect(value) + " was equal to " + shallowInspect(resultValue) + ".";
        };

        toBeEqualTo.failure = function (value, resultValue) {
            return "Expected " + shallowInspect(value) + " to be equal to " + shallowInspect(resultValue) + ".";
        };

        self.toBeEqualTo = function (compareValue, jobTitle) {
            check(compareValue, toBeEqualTo, jobTitle);
        };





        var toNotBeEqualTo = function (value, resultValue) {
            if (value !== resultValue) {
                return true;
            }
            return false;
        };

        toNotBeEqualTo.success = function (value, resultValue) {
            return "Passed " + shallowInspect(value) + " was not equal to " + shallowInspect(resultValue) + ".";
        };

        toNotBeEqualTo.failure = function (value, resultValue) {
            return "Expected " + shallowInspect(value) + " to not equal " + shallowInspect(resultValue) + ".";
        };

        self.toNotBeEqualTo = function (compareValue, jobTitle) {
            check(compareValue, toNotBeEqualTo, jobTitle);
        };




        var toBeGreaterThan = function (value, resultValue) {
            if (value > resultValue) {
                return true;
            }
            return false;
        };

        toBeGreaterThan.success = function (value, resultValue) {
            return "Passed " + shallowInspect(value) + " was greater than " + shallowInspect(resultValue) + ".";
        };

        toBeGreaterThan.failure = function (value, resultValue) {
            return "Expected " + shallowInspect(value) + " to be " + shallowInspect(resultValue) + ".";
        };

        self.toBeGreaterThan = function (compareValue, jobTitle) {
            check(compareValue, toBeGreaterThan, jobTitle);
        };




        var toBeGreaterThanOrEqualTo = function (value, resultValue) {
            if (value >= resultValue) {
                return true;
            }
            return false;
        };

        toBeGreaterThanOrEqualTo.success = function (value, resultValue) {
            return "Passed " + shallowInspect(value) + " was greater than or equal to " + shallowInspect(resultValue) + ".";
        };

        toBeGreaterThanOrEqualTo.failure = function (value, resultValue) {
            return "Expected " + shallowInspect(value) + " to be greater than or equal to " + shallowInspect(resultValue) + ".";
        };

        self.toBeGreaterThanOrEqualTo = function (compareValue, jobTitle) {
            check(compareValue, toBeGreaterThanOrEqualTo, jobTitle);
        };


        var toBeLessThan = function (value, resultValue) {
            if (value < resultValue) {
                return true;
            }
            return false;
        };

        toBeLessThan.success = function (value, resultValue) {
            return "Passed " + shallowInspect(value) + " was less than " + shallowInspect(resultValue) + ".";
        };

        toBeLessThan.failure = function (value, resultValue) {
            return "Expected " + shallowInspect(value) + " to be less than " + shallowInspect(resultValue) + ".";
        };

        self.toBeLessThan = function (compareValue, jobTitle) {
            check(compareValue, toBeLessThan, jobTitle);
        };





        var toBeLessThanOrEqualTo = function (value, resultValue) {
            if (value <= resultValue) {
                return true;
            }
            return false;
        };

        toBeLessThanOrEqualTo.success = function (value, resultValue) {
            return "Passed " + shallowInspect(value) + " was less than " + shallowInspect(resultValue) + ".";
        };

        toBeLessThanOrEqualTo.failure = function (value, resultValue) {
            return "Expected " + shallowInspect(value) + " to be less than " + shallowInspect(resultValue) + ".";
        };

        self.toBeLessThanOrEqualTo = function (compareValue, jobTitle) {
            check(compareValue, toBeLessThanOrEqualTo, jobTitle);
        };





        var toBeDefined = function (value, resultValue) {
            if (typeof value !== "undefined" && value !== null) {
                return true;
            }
            return false;
        };

        toBeDefined.success = function (value, resultValue) {
            return "Passed " + shallowInspect(value) + " to be defined.";
        };

        toBeDefined.failure = function (value, resultValue) {
            return "Expected " + shallowInspect(value) + " to be defined.";
        };

        self.toBeDefined = function (jobTitle) {
            check(undefined, toBeDefined, jobTitle);
        };





        var toBeUndefined = function (value, resultValue) {
            if (typeof value === "undefined") {
                return true;
            }
            return false;
        };

        toBeUndefined.success = function (value, resultValue) {
            return "Passed " + shallowInspect(value) + " to be undefined.";
        };

        toBeUndefined.failure = function (value, resultValue) {
            return "Expected " + shallowInspect(value) + " to be undefined.";
        };

        self.toBeUndefined = function (jobTitle) {
            check(undefined, toBeUndefined, jobTitle);
        };







        var toBeNull = function (value, resultValue) {
            if (value === null) {
                return true;
            }
            return false;
        };

        toBeNull.success = function (value, resultValue) {
            return "Passed " + shallowInspect(value) + " to be null.";
        };

        toBeNull.failure = function (value, resultValue) {
            return "Expected " + shallowInspect(value) + " to be null.";
        };

        self.toBeNull = function (jobTitle) {
            check(undefined, toBeNull, jobTitle);
        };

        var toBeLike = function (value, resultValue) {
            return Object.keys(resultValue).every(function (key) {
                return value[key] == resultValue[key] && (Array.isArray(value) || Array.isArray(resultValue) ? value.length === resultValue.length : true);
            });
        };

        toBeLike.success = function (value, resultValue) {
            return "Passed " + shallowInspect(value) + " to be like " + shallowInspect(resultValue) + ".";
        };

        toBeLike.failure = function (value, resultValue) {
            return "Expected " + shallowInspect(value) + " to be like " + shallowInspect(resultValue) + ".";
        };

        self.toBeLike = function (compareValue, jobTitle) {
            check(compareValue, toBeLike, jobTitle);
        };


    };


});