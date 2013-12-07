var path = require("path");

require("../../../BASE.js");
BASE.require.loader.root("./");

BASE.require(["BASE.async.Future"], function () {

    describe("Future Spec", function () {

        it("Test complete event, with setValue.", function () {
            var done = false;

            var future = new BASE.async.Future(function (setValue, setError) {
                setTimeout(function () {
                    setValue(true);
                }, 1);
            });

            future.then();

            future.observe(function () {
                done = true;
            }, "complete");

            waitsFor(function () {
                return done;
            });

            runs(function () {
                expect(done).toBe(true);
            });
        });

        it("Test complete event, with setError.", function () {
            var done = false;

            var future = new BASE.async.Future(function (setValue, setError) {
                setTimeout(function () {
                    setError(new Error("Something happened!"));
                }, 1);
            });

            future.then();

            future.observe(function () {
                done = true;
            }, "complete");

            waitsFor(function () {
                return done;
            });

            runs(function () {
                expect(done).toBe(true);
            });
        });

        it("Test complete event, with cancel.", function () {
            var done = false;

            var future = new BASE.async.Future(function (setValue, setError) {
                setTimeout(function () {
                    setError(new Error("Something happened!"));
                }, 1);
            });

            future.then();

            future.observe(function () {
                done = true;
            }, "complete");

            future.cancel();

            waitsFor(function () {
                return done;
            });

            runs(function () {
                expect(done).toBe(true);
            });
        });


        it("Should return a value in 1 millisecond", function () {

            var done = false;
            var value;
            var calledError = false;
            var calledCancel = false;

            var future = new BASE.async.Future(function (setValue, setError) {
                setTimeout(function () {
                    setValue(true);
                }, 1);
            });

            future.then(function (v) {
                done = true;
                value = v;
            });

            future.ifError(function () {
                calledError = true;
            });

            future.ifCanceled(function () {
                calledCanceled = true;
            });

            waitsFor(function () { return done; });

            runs(function () {
                expect(value).toBe(true);
                expect(calledCancel).toBe(false);
                expect(calledError).toBe(false);
            });

        });

        it("Should cancel, and make sure the \"then\", and the \"ifError\" callback aren't invoked.", function () {

            var done = false;
            var value;
            var calledThen = false;
            var calledError = false;

            var future = new BASE.async.Future(function (setValue, setError) {
                setTimeout(function () {
                    setValue(true);
                }, 1);
            });

            future.ifCanceled(function (v) {
                done = true;
                value = v;
            });

            future.ifError(function () {
                calledError = true;
            });

            future.then(function () {
                calledThen = true;
            });

            future.cancel();

            waitsFor(function () { return done; });

            runs(function () {
                expect(calledThen).toBe(false);
                expect(calledError).toBe(false);
            });

        });

        it("Should error out, and make sure the \"then\", and the \"ifCanceled\" callback aren't invoked.", function () {

            var done = false;
            var value;
            var calledThen = false;
            var calledCanceled = false;

            var future = new BASE.async.Future(function (setValue, setError) {
                setTimeout(function () {
                    setError(new Error("Custom Error"));
                }, 1);
            });

            future.ifCanceled(function (v) {
                calledCanceled = true;
            });

            future.ifError(function () {
                done = true;
            });

            future.then(function () {
                calledThen = true;
            });

            waitsFor(function () { return done; });

            runs(function () {
                expect(calledThen).toBe(false);
                expect(calledCanceled).toBe(false);
            });

        });

    });

});