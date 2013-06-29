BASE.require([
    "BASE.Observable",
    "BASE.PropertyChangedEvent",
    "BASE.Future"
], function () {
    BASE.namespace("BASE.data.states");

    var Future = BASE.Future;

    BASE.data.states.AbstractState = (function (Super) {
        var AbstractState = function (changeTracker, relationManager) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new AbstractState(changeTracker, relationManager);
            }

            Super.call(self);

            var entity = changeTracker.entity;

            self.add = function () {
                // Do nothing.
            };

            self.remove = function () {
                // Do nothing.
            };

            self.update = function (event) {
                // Do nothing.
            };

            self.save = function () {
                return new Future(function (setValue, setError) {
                    setTimeout(function () {
                        setValue({ message: "No saving necessary." });
                    }, 0);
                });
            };

            self.sync = function (dto) {
                var dataContext = changeTracker.dataContext;

                // Update the entity to the values in the dto.
                // Run through each property and assign the entity that value.
                Object.keys(dto).forEach(function (key) {
                    if (typeof entity[key] === "undefined" || key === "constructor") {
                        return;
                    }
                    if (entity[key] instanceof BASE.ObservableArray) {
                        //Load meta data to the array object.
                        var array = entity[key];
                        Object.keys(dto[key]).forEach(function (property) {
                            Object.defineProperty(array, property, {
                                enumerable: false,
                                value: dto[key][property]
                            });
                        });
                    } else if (typeof dto[key] === 'object' && dto[key] !== null) {
                        var Type = dataContext.service.getTypeForDto(dto[key]);
                        var dataSet = dataContext.getDataSet(Type);

                        entity[key] = dataSet.load(dto[key]);
                    } else if (typeof dto[key] !== "object" && typeof entity[key] !== "function") {
                        entity[key] = dto[key];
                    }
                });
            };

            self.start = function () {
                // Do nothing.
            };

            self.stop = function () {
                // Do nothing.
            };

            return self;
        };

        BASE.extend(AbstractState, Super);

        return AbstractState;
    }(BASE.Observable));
});