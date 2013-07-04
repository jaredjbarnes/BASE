BASE.require([
    "BASE.Future"
], function () {
    BASE.namespace("BASE.query");

    BASE.query.Provider = (function (Super) {
        var Provider = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Provider();
            }

            Super.call(self);

            self.count = function () {
                return new BASE.Future(function (setValue, setError) {
                    setTimeout(function () {
                        setValue(0);
                    }, 0);
                });
            };

            self.any = function () {
                return new BASE.Future(function (setValue, setError) {
                    setTimeout(function () {
                        setValue(false);
                    }, 0);
                });
            };

            self.all = function () {
                return new BASE.Future(function (setValue, setError) {
                    setTimeout(function () {
                        setValue(true);
                    }, 0);
                });
            };

            self.firstOrDefault = function () {
                return new BASE.Future(function (setValue, setError) {
                    setTimeout(function () {
                        setValue(null);
                    }, 0);
                });
            };

            self.lastOrDefault = function () {
                return new BASE.Future(function (setValue, setError) {
                    setTimeout(function () {
                        setValue(null);
                    }, 0);
                });
            };

            self.first = function () {
                return new BASE.Future(function (setValue, setError) {
                    setTimeout(function () {
                        setError(Error("Out of range error."));
                    }, 0);
                });
            };

            self.last = function () {
                return new BASE.Future(function (setValue, setError) {
                    setTimeout(function () {
                        setError(Error("Out of range error."));
                    }, 0);
                });
            };

            self.toArray = function (queryable) {
                return new BASE.Future(function (setValue, setError) {
                    setTimeout(function () {
                        setValue([]);
                    }, 0);
                });
            };

            //This should always return a Future of an array of objects.
            self.execute = self.toArray;
        };

        BASE.extend(Provider, Super);

        return Provider;
    }(Object));

});