BASE.require(["BASE.util.UnitTest", "BASE.async.Future", "BASE.util.Sandbox", "BASE.async.Task"], function () {
    BASE.namespace("UnitTest.BASE.util");

    UnitTest.BASE.util.Sandbox = (function (Super) {
        var Sandbox = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Sandbox();
            }

            Super.call(self, "UnitTest.BASE.util.Sandbox");

            self.execute = function () {

                var task = new BASE.async.Task();
                task.add(self.expectToPassWithValidUrl());
                task.add(self.expectToFailWithInvalidUrl());

                task.start().whenAll(function (futures) {

                    var passed = futures.every(function (future) {
                        return future.value.passed === true;
                    });

                    self.assert(passed, "Passed", "Failed");

                });

                return BASE.async.Future.fromResult(self);
            };

            self.expectToPassWithValidUrl = function () {
                return new BASE.async.Future(function (setValue) {

                    var result = {
                        passed: true,
                        message: "Passed"
                    };

                    var sandbox = new BASE.util.Sandbox("/Scripts/BASE/v0.0.1/");
                    sandbox.window.then(function (win) {
                        win.BASE.require(["BASE.util.Sandbox"], function () {
                            if (win.BASE.util.Sandbox !== BASE.util.Sandbox && win.BASE.util.Sandbox) {
                                result.passed = true;
                                result.message = "Passed";
                                setValue(result);
                            }
                        });
                    }).ifError(function () {
                        result.passed = false;
                        result.message = "Failed";
                        setValue(result);
                    });

                });
            };

            self.expectToFailWithInvalidUrl = function () {
                return new BASE.async.Future(function (setValue) {

                    var result = {
                        passed: true,
                        message: "Passed"
                    };

                    var sandbox = new BASE.util.Sandbox("/S/BASE/v0.0.1/");
                    sandbox.window.then(function (win) {
                        result.passed = false;
                        result.message = "Failed";
                        setValue(result);
                    }).ifError(function () {
                        result.passed = true;
                        result.message = "Passed";
                        setValue(result);
                    });

                });

            }

            return self;
        };

        BASE.extend(Sandbox, Super);

        return Sandbox;
    }(BASE.util.UnitTest));
});