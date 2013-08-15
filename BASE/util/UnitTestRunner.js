BASE.require([
    "BASE.util.UnitTestable",
    "BASE.async.Task",
    "BASE.async.Future",
    "BASE.util.PropertyChangedEvent",
    "BASE.collections.ObservableArray"
], function () {

    BASE.namespace("BASE.util");

    var PropertyChangedEvent = BASE.util.PropertyChangedEvent;

    BASE.util.UnitTestRunner = ((function (Super) {

        var UnitTestRunner = function (name) {
            var self = this;

            if (!(self instanceof arguments.callee)) {
                return new UnitTestRunner();
            }

            Super.call(self, name);

            var _children = new BASE.collections.ObservableArray();
            Object.defineProperty(self, "children", {
                get: function () {
                    return _children;
                }
            });

            self.execute = function () {
                return new BASE.async.Future(function (setValue, setError) {
                    var task = new BASE.async.Task();

                    _children.forEach(function (unitTest) {
                        task.add(unitTest.execute());
                    });

                    task.start().whenAll(function (futures) {
                        var passed = _children.every(function (unitTest) {
                            return unitTest.state.type === "Passed";
                        });

                        self.assert(passed, "Passed", "Failed");

                        setValue(self);
                    });
                });
            };

        };

        BASE.extend(UnitTestRunner, Super);

        return UnitTestRunner;

    })(BASE.util.UnitTestable));

});