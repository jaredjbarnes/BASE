BASE.require(["BASE.util.Observable", "BASE.query.Provider"], function () {
    BASE.namespace("BASE.data");

    BASE.data.NullService = (function (Super) {
        var NullService = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new NullService();
            }

            Super.call(self);

            // This method allows for optimized reads of a many to many property.
            self.readManyToMany = function (entity, property, queryable) {
                var PropertyType = queryable.Type;
                var EntityType = entity.constructor;

                //Do what you need to here.

            };

            // This method allows the 
            self.read = function (Type, queryable) {
                return new BASE.async.Future(function (setValue) {
                    setTimeout(function () {
                        setValue({ message: "Added!", dto: { id: (Math.random() * 10000).toFixed(5) } });
                    }, 0);
                });
            };

            self.add = function (entity) {
                return new BASE.async.Future(function (setValue) {
                    setTimeout(function () {
                        setValue({ message: "Added!", dto: { id: (Math.random() * 10000).toFixed(5) } });
                    }, 0);
                });
            };

            self.update = function (entity) {
                return new BASE.async.Future(function (setValue) {
                    setTimeout(function () {
                        setValue({ message: "Updated!" });
                    }, 0);
                });

            };

            self.remove = function (entity) {
                return new BASE.async.Future(function (setValue) {
                    setTimeout(function () {
                        setValue({ message: "Remove!" });
                    }, 0);
                });
            };

            self.count = function (Type, filter) {
                return new BASE.async.Future(function (setValue) {
                    setTimeout(function () {
                        setValue(0);
                    }, 0);
                });
            };

            // This allows the service to dictate what a dto's class is.
            // This helps with abstract classes.
            self.getTypeForDto = function (dto) {

            };

            self.logIn = function (username, factors) {
                return new BASE.async.Future(function (setValue) {
                    setTimeout(function () {
                        setValue({ message: "Logged In!" });
                    }, 0);
                });
            };

            return self;
        };

        BASE.extend(NullService, Super);

        return NullService;
    }(BASE.util.Observable));
});