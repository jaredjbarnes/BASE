BASE.require(["BASE.Observable", "BASE.query.Provider"], function () {
    BASE.namespace("BASE.data");

    BASE.data.Service = (function (Super) {
        var Service = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Service();
            }

            Super.call(self);

            var _relationships = null;
            Object.defineProperty(self, "relationships", {
                get: function () {
                    return _relationships;
                },
                set: function (value) {
                    var oldValue = _relationships;
                    if (value !== _relationships) {
                        _relationships = value;
                        self.notify(new BASE.PropertyChangedEvent("relationships", oldValue, value));
                    }
                }
            });

            // This method allows for optimized reads of a many to many property.
            self.readTargetEntities = function (sourceEntity, sourceProperty, queryable) {
                var PropertyType = queryable.Type;
                var EntityType = sourceEntity.constructor;

                //Do what you need to here.

            };

            // This method allows reads from a data set with a specific type.
            self.readEntities = function (Type, queryable) {

            };

            // Call this method to create an entity.
            self.createEntity = function (entity) {
                var Type = entity.constructor;
            };


            self.updateEntity = function (entity) {
                var Type = entity.constructor;
            };

            self.deleteEntity = function (entity) {
                var Type = entity.constructor;
            };

            self.countEntities = function (Type, filter) {
                
            };

            // This allows the service to dictate what a dto's class is.
            self.getTypeForDto = function (dto) {

            };

            // This will be called by the developer who wants to begin using the service.
            self.logIn = function (username, factors) {
                return new BASE.Future(function (setValue) {
                    setTimeout(function () {
                        setValue({ message: "Logged In!" });
                    }, 0);
                });
            };

            return self;
        };

        BASE.extend(Service, Super);

        return Service;
    }(BASE.Observable));
});