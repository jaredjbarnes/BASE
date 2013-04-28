BASE.require(["BASE.Observable", "BASE.query.Provider"], function () {
    BASE.namespace("BASE.data");

    BASE.data.NullService = (function (Super) {
        var NullService = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new NullService();
            }

            Super.call(self);

            var _QueryProvider = BASE.query.Provider;

            Object.defineProperties(self, {
                "QueryProvider": {
                    configurable: true,
                    get: function () {
                        return _QueryProvider;
                    }
                }
            });

            self.load = function (Type, Filter) {
                return new BASE.Future(function (setValue) {
                    setTimeout(function () {
                        setValue([], { message: "Loaded" });
                    }, 0);
                });
            };

            self.add = function (entity) {
                return new BASE.Future(function (setValue) {
                    setTimeout(function () {
                        setValue({ message: "Added!", dto: { id: (Math.random() * 10000).toFixed(5) } });
                    }, 0);
                });
            };

            self.update = function (entity) {
                return new BASE.Future(function (setValue) {
                    setTimeout(function () {
                        setValue({ message: "Updated!" });
                    }, 0);
                });

            };

            self.remove = function (entity) {
                return new BASE.Future(function (setValue) {
                    setTimeout(function () {
                        setValue({ message: "Remove!" });
                    }, 0);
                });
            };

            self.logIn = function (username, factors) {
                return new BASE.Future(function (setValue) {
                    setTimeout(function () {
                        setValue({ message: "Logged In!" });
                    }, 0);
                });
            };

            self.getTypeForDto = function (dto) {
                //This allows the service to dictate what a dto's class is.
            };

            self.count = function (Type, filter) {
                return new BASE.Future(function (setValue) {
                    setTimeout(function () {
                        setValue(0);
                    }, 0);
                });
            };

            return self;
        };

        BASE.extend(NullService, Super);

        return NullService;
    }(BASE.Observable));
});