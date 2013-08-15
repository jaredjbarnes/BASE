BASE.require([
    "BASE.async.Task",
    "BASE.async.Future",
    "BASE.util.ObservableEvent",
    "BASE.collections.ObservableArray",
    "BASE.util.Observable",
    "BASE.util.Sandbox"
], function () {

    BASE.namespace("BASE.util");

    var ObservableEvent = BASE.util.ObservableEvent;

    BASE.util.UnitTestFactory = ((function (Super) {

        var UnitTestFactory = function (name) {
            var self = this;

            self.name = name;

            if (!(self instanceof arguments.callee)) {
                return new UnitTestFactory(name);
            }

            Super.call(self);

            var _unitTests = new BASE.collections.ObservableArray();

            Object.defineProperty(self, "unitTests", {
                get: function () {
                    return _unitTests;
                }
            });

            var _root = null;
            Object.defineProperty(self, "root", {
                get: function () {
                    return _root;
                },
                set: function (value) {
                    var oldValue = _root;
                    if (value !== _root) {
                        _root = value;
                        self.notify(new BASE.util.PropertyChangedEvent("root", oldValue, value));
                    }
                }
            });

            self.execute = function (namespaces) {
                /// <param name="namespaces" type="Array"></param>
                namespaces = namespaces.slice(0);

                var windowFutures = new BASE.async.Task();

                namespaces.forEach(function () {
                    var sandbox = new BASE.util.Sandbox(self.root);
                    windowFutures.add(sandbox.window);
                });


                windowFutures.start().whenAll(function (futures) {

                    futures.forEach(function (future, index) {
                        var win = future.value;
                        if (win) {

                            var namespace = namespaces[index];
                            win.BASE.require.setRoot(self.root);
                            win.BASE.require([namespace], function () {
                                var UnitTest = win.BASE.getObject(namespace);

                                var unitTest = new UnitTest();
                                self.unitTests.push(unitTest);

                                unitTest.execute().then();
                            });

                        } else {
                            throw new Error("Failed to create a sandbox for: " + namespace[index]);
                        }
                    });

                });

            };

        };

        BASE.extend(UnitTestFactory, Super);

        return UnitTestFactory;

    })(BASE.util.Observable));

});