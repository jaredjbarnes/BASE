BASE.require(["BASE.util.UnitTest", "BASE.async.Future"], function () {
    BASE.namespace("UnitTest.BASE");

    UnitTest.BASE.extend = (function (Super) {
        var extend = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new extend();
            }

            Super.call(self, "UnitTest.BASE.extend");

            self.execute = function () {
                return new BASE.async.Future(function (setValue, setError) {
                    // Run your test here and set the value or error upon completion.

                    var Car = function () { };
                    var Mazda = function () { };

                    BASE.extend(Mazda, Car);

                    var car = new Mazda();

                    self.assert(car instanceof Car, "Passed", "Error");
                    setValue(self);
                });
            };

            return self;
        };

        BASE.extend(extend, Super);

        return extend;
    }(BASE.util.UnitTest));
});