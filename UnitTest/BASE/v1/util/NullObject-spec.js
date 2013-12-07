require("../../../../BASE.js");
BASE.require.loader.root = "./";

BASE.require(["BASE.v1.util.NullObject"], function () {

    describe("BASE.v1.util.NullObject Spec", function () {

        it("Create a class then make a NullObject of that type and make sure the functions aren't fired.", function () {

            var startCalled = false;
            var stopCalled = false;

            var Executable = function () {
                this.start = function () {
                    startCalled = true;
                };
                this.stop = function () {
                    stopCalled = true;
                };
            };

            var obj = new BASE.v1.util.NullObject(Executable);
            obj.start();
            obj.stop();

            runs(function () {
                expect(startCalled).toBe(false);
                expect(stopCalled).toBe(false);
            });

        });

    });

});