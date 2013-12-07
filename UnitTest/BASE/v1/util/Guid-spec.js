require("../../../../BASE.js");
BASE.require.loader.root = "./";

BASE.require(["BASE.v1.util.Guid"], function () {

    describe("BASE.v1.util.Guid Spec", function () {

        it("Generate two random guids, and make sure they don't equal.", function () {

            var guid1 = BASE.v1.util.Guid.create();
            var guid2 = BASE.v1.util.Guid.create();

            runs(function () {
                // This is really a dumb test. 
                // I need to think of a real way to test this.
                expect(guid1===guid2).toBe(false);
            });

        });

    });

});