BASE.require(["BASE.async.Task", "BASE.async.Future", "BASE.util.ObservableEvent"], function () {

    BASE.namespace("BASE.util");

    var ObservableEvent = BASE.util.ObservableEvent;

    BASE.util.UnitTest = ((function (Super) {

        var UnitTest = function (name) {
            var self = this;

            self.name = name;
            self.message = "Unit Test";

            if (!(self instanceof arguments.callee)) {
                return new UnitTest();
            }

            Super.call(self);

            self.unitTests = [];

            self.execute = function (namespaces) {
                /// <param name="namespaces" type="Array"></param>
                self.unitTests = [];
                var task = new BASE.async.Task();
                BASE.require(namespaces, function () {

                    namespaces.forEach(function (namespace) {
                        var UnitTest = BASE.getObject(namespace);

                        var unitTest = new UnitTest();
                        self.unitTests.push(unitTest);

                        task.add(unitTest.execute());
                    });

                    task.start();
                });

                return task;
            };

        };

        BASE.extend(UnitTest, Super);

        return UnitTest;

    })(BASE.async.Task));

});