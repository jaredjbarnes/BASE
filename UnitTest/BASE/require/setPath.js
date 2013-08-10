BASE.require(["BASE.util.UnitTest", "BASE.async.Future"], function () {
    BASE.namespace("UnitTest.BASE.require");

    UnitTest.BASE.require.setPath = (function (Super) {
        var setPath = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new setPath();
            }

            Super.call(self, "UnitTest.BASE.require.setPath");

            self.execute = function () {
                return new BASE.async.Future(function (setValue, setError) {
                    // Run your test here and set the value or error upon completion.

                    BASE.require.setPath("Some.namespace", "/blah/blah1/");
                    BASE.require.setPath("Some.other.namespace", "../blah/blah2/");

                    var firstTest = BASE.require.getPath("Some.namespace.Klass");
                    var secondTest = BASE.require.getPath("Some.other.namespace.Klass");

                    if (firstTest === "/blah/blah1/Klass.js" &&
                        secondTest === "../blah/blah2/Klass.js" ) {
                        self.message = "Passed";
                        setValue(self);
                    } else {
                        self.message = "Error";
                        setError(self);
                    }

                });
            };

            return self;
        };

        BASE.extend(setPath, Super);

        return setPath;
    }(BASE.util.UnitTest));
});