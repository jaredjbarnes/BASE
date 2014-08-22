BASE.require([
    "BASE.unitTest.Expectation",
    "BASE.async.Fulfillment",
    "BASE.async.delay"
], function () {

    BASE.namespace("BASE.unitTest");
    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Fulfillment = BASE.async.Fulfillment;
    var Expectation = BASE.unitTest.Expectation;
    var emptyFn = function () { };
    var delay = BASE.async.delay;

    BASE.unitTest.UnitTest = function (name, config) {
        var self = this;

        BASE.assertNotGlobal(self);
        BASE.util.Observable.call(self);

        config = config || {};

        var tests = [];
        var expectations = [];
        var successes = [];
        var failures = [];
        var runningFuture = null;
        var fullfillment = new Fulfillment();
        var timeout = 15000;
        var state;

        var defaultState = {
            run: function () {
                state = runningState;

                self.notify({
                    type: "started",
                    name: name
                });

                var scope = {};
                var prepareFuture = self.prepare(scope);

                if (!(prepareFuture instanceof Future)) {
                    prepareFuture = Future.fromResult(prepareFuture);
                }

                var startDate = new Date().getTime();
                return runningFuture = new Future(function (setValue, setError) {

                    prepareFuture.then(function () {
                        var task = new Task();

                        try {
                            tests.forEach(function (test) {

                                var returnValue = test(expect, scope);

                                if (!(returnValue instanceof Future)) {
                                    returnValue = Future.fromResult(returnValue);
                                }

                                task.add(returnValue);

                            });

                            task.start().whenAll(function () {
                                state = finishedState;
                                state.notifyIfDone();
                            });

                            fullfillment.then(function (event) {
                                setValue({
                                    failures: event.failures,
                                    successes: event.successes
                                });
                            });

                        } catch (e) {
                            fullfillment.then(function (event) {
                                setValue({
                                    failures: [{ type: "failure", message: event.stack }],
                                    successes: []
                                });
                            });
                        }
                    });
                }).then(function (result) {

                    self.notify({
                        type: "result",
                        name: name,
                        result: result
                    });

                    self.notify({
                        type: "ended",
                        name: name,
                        duration: new Date().getTime() - startDate
                    });

                });
            },
            test: function (testCallback) {
                if (typeof testCallback === "function") {
                    tests.push(testCallback);
                } else {
                    throw new Error("Expected a function.");
                }
            },
            notifyIfDone: emptyFn
        };

        var runningState = {
            run: function () {
                return runningFuture;
            },
            test: emptyFn,
            notifyIfDone: emptyFn
        };

        var finishedState = {
            run: function () {
                return runningFuture;
            },
            test: emptyFn,
            notifyIfDone: function () {
                if (expectations.length === (failures.length + successes.length)) {
                    fullfillment.setValue({
                        successes: successes,
                        failures: failures
                    });

                    self.after();
                }
            }
        };

        state = defaultState;

        var expect = function (futureValue) {
            var expectation = new Expectation(futureValue);

            var failureObserver = expectation.observeType("failure", function (event) {
                timeoutFuture.cancel();
                failures.push(event);
                state.notifyIfDone();
            });

            var successObserver = expectation.observeType("success", function (event) {
                timeoutFuture.cancel();
                successes.push(event);
                state.notifyIfDone();
            });

            var timeoutFuture = delay(timeout).then(function () {
                successObserver.dispose();
                failureObserver.dispose();

                failures.push({
                    type: "failure",
                    message: "Expectation timed out."
                });
                state.notifyIfDone();
            });

            expectations.push(expectation);
            return expectation;
        };

        expect.values = function () {
            var args = Array.prototype.slice.call(arguments, 0);

            return {
                toBeTestedWith: function (expectation) {
                    if (typeof expectation.evaluate !== "function") {
                        throw new Error("Evaluation missing.");
                    }

                    if (typeof expectation.success !== "function") {
                        throw new Error("Success message handler missing.");
                    }

                    if (typeof expectation.failure !== "function") {
                        throw new Error("Failure message handler missing.");
                    }

                    var task = new Task();
                    var hasError = false;

                    args.forEach(function (future) {

                        if (!(future instanceof Future)) {
                            future = Future.fromResult(future);
                        }

                        task.add(future.ifError(function () {
                            hasError = true;
                        }));
                    });

                    task.start().whenAll(function (futures) {
                        if (hasError) {
                            failures.push({
                                type: "failure",
                                message: "A future had an unexpected error.",
                                values: futureResults
                            });
                        } else {
                            var futureResults = futures.reduce(function (array, future) {
                                array.push(future.value);
                                return array;
                            }, []);
                            var passed;

                            try {
                                passed = expectation.evaluate.apply(expectation, futureResults);
                            } catch (e) {
                                passed = false;
                            }

                            if (passed) {
                                successes.push({
                                    type: "success",
                                    message: expectation.success.apply(expectation, futureResults),
                                    values: futureResults
                                });
                            } else {
                                failures.push({
                                    type: "failure",
                                    message: expectation.failure.apply(expectation, futureResults),
                                    values: futureResults
                                });
                            }
                        }
                        state.notifyIfDone();
                    });

                    expectations.push(expectation);
                }
            };
        };

        self.run = function () {
            return state.run();
        };

        self.test = function (testCallback) {
            state.test.apply(state, arguments);
            return self;
        };

        self.setTimeout = function (milli) {
            timeout = milli;
        };

        self.prepare = function (scope) {

        };

        self.after = function () {

        };

    };

});

/*

var unitTest = new UnitTest("Some great test");
unitTest.prepare = function(scope){
    scope.jared = new Person();
    scope.jared.firstName = "Jared";
    scope.jared.lastName = "Barnes";
    scope.age = 32;
};

unitTest.test(function(expect, scope){
    
    expect(scope.jared.firstName).toBeEqualTo("Jared");
    expect(scope.jared.lastName).toBeEqualTo("Barnes");
    expect(scope.jared.age).toBeLessThan(35);

    expect(scope.jared.lastName).toNotBeEqualTo("barney");

   
    expect.values(scope.jared.lastName, otherValue, somethingElse).toBeTestedWith({
        evaluate:function(first, second, third){},
        success:function(first, second, third){},
        failure:function(first, second, third){}
    });

});

unitTest.run().then(function(results){
    
    results.successes.forEach(function(test){
        console.log(test.message);
    });

    results.failures.forEach(function(test){
        console.log(test.message);
    });

});

*/