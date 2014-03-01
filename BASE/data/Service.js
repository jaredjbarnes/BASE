BASE.require(["BASE.behaviors.Observable", "BASE.query.Provider"], function () {
    BASE.namespace("BASE.data");

    BASE.data.Service = (function (Super) {
        var Service = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Service();
            }

            BASE.behaviors.Observerable.call(self);

            var _relationships = null;

            self.getRelationships = function () {
                return _relationships;
            };

            self.setRelationships = function (relationships) {
                var oldValue = _relationships;
                if (oldValue != relationships) {
                    _relationships = relationships;
                    self.notify({
                        type: "relationships",
                        oldValue: oldValue,
                        newValue: relationships
                    });
                }
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

            // This allows the service to dictate what a dto's class is.
            self.getTypeForDto = function (dto) {

            };

            self.getSetProvider = function (Type) {

            };

            self.getTargetProvider = function (entity, property) {

            };

            // This will be called by the developer who wants to begin using the service.
            self.logIn = function (username, factors) {
                return new BASE.async.Future(function (setValue) {
                    setTimeout(function () {
                        setValue({ message: "Logged In!" });
                    }, 0);
                });
            };

            return self;
        };

        BASE.extend(Service, Super);

        return Service;
    }(Object));
});