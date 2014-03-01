BASE.require(["BASE.util.UnitTest", "BASE.async.Future", "Array.prototype.asQueryable"], function () {
    BASE.namespace("UnitTest.BASE.query");

    UnitTest.BASE.query.ArrayProvider = (function (Super) {
        var ArrayProvider = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ArrayProvider();
            }

            Super.call(self, "UnitTest.BASE.query.ArrayProvider");

            self.execute = function () {
                return new BASE.async.Future(function (setValue, setError) {
                    // Run your test here and set the value or error upon completion.

                    self.message = "Passed";
                    setValue(self);

                    // or setError(self);
                });
            };

            self.orderByObjectPropertyAscending = function () {

            };

            self.orderByIntAscending = function () {
                return new BASE.async.Future(function () {


                    var array = [0, 4, 3, 6, 1, 2, 5, 7, 8, 9];
                    var shouldBe = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

                    array.asQueryable(Number).orderBy(function (n) { return n; });

                });

            }

            return self;
        };

        BASE.extend(ArrayProvider, Super);

        return ArrayProvider;
    }(BASE.util.UnitTest));
});