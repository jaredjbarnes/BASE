BASE.require(["BASE.util.UnitTest", "BASE.async.Future"], function () {
    BASE.namespace("UnitTest.BASE.collections");

    UnitTest.BASE.collections.MultiKeyMap = (function (Super) {
        var MultiKeyMap = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new MultiKeyMap();
            }

            Super.call(self, "UnitTest.BASE.collections.MultiKeyMap");

            self.execute = function () {
                return new BASE.async.Future(function (setValue, setError) {
                    // Run your test here and set the value or error upon completion.

                    self.message = "Passed";
                    setValue(self);

                    // or setError(self);
                });
            };

            return self;
        };

        BASE.extend(MultiKeyMap, Super);

        return MultiKeyMap;
    }(BASE.util.UnitTest));
});