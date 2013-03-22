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

            self.load = function (options) {
                options = options || {};
                options.success = options.success || function () { };
                options.error = options.error || function () { };

                setTimeout(function () {
                    options.success([], { message: "Loaded" });
                }, 0);
            };

            self.add = function (entity, options) {
                options = options || {};
                options.success = options.success || function () { };
                options.error = options.error || function () { };
                console.log(entity);
                setTimeout(function () {
                    options.success({ message: "Added!", dto: { id: (Math.random() * 10000).toFixed(5) } });
                }, 0);
            };

            self.update = function (entity, options) {
                options = options || {};
                options.success = options.success || function () { };
                options.error = options.error || function () { };
                setTimeout(function () {
                    options.success({ message: "Updated!" });
                }, 0);
            };

            self.remove = function (entity, options) {
                options = options || {};
                options.success = options.success || function () { };
                options.error = options.error || function () { };
                console.log(entity);
                setTimeout(function () {
                    options.success({ message: "Remove!" });
                }, 0);
            };

            self.logIn = function (options) {
                //options.username
                //options.factors
                //options.success
                //options.error
            };

            self.getTypeForDto = function (dto) {
                //This allows the service to dictate what a dto's class is.
            };

            return self;
        };

        BASE.extend(NullService, Super);

        return NullService;
    }(BASE.Observable));
});