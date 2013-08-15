BASE.require([
    "BASE.util.UnitTestable",
    "BASE.async.Future",
    "BASE.util.ObservableEvent"
], function () {

    BASE.namespace("BASE.util");
    var ObservableEvent = BASE.util.ObservableEvent;

    BASE.util.UnitTest = ((function (Super) {

        var UnitTest = function (name, future) {
            var self = this;

            if (!(self instanceof arguments.callee)) {
                return new UnitTest(name, future);
            }

            Super.call(self, name);

            self.execute = function () {
                return future || new BASE.async.Future.fromResult(self);
            };

        };

        BASE.extend(UnitTest, Super);

        return UnitTest;

    })(BASE.util.UnitTestable));

});