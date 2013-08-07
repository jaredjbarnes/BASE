BASE.require([
    "BASE.util.Observable",
    "BASE.util.PropertyChangedEvent",
    "BASE.async.Future"
], function () {
    BASE.namespace("BASE.data.states");

    var Future = BASE.async.Future;

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

                    if (entity[key] instanceof BASE.collections.ObservableArray) {
                        //Load meta data to the array object.
                        var array = entity[key];
                        Object.keys(dto[key]).forEach(function (property) {
                            Object.defineProperty(array, property, {
                                enumerable: false,
                                value: dto[key][property]
                            });
                        });

                        // We need to set the array up with a type.
                        // This is a convenience for the developer, so they don't have to say asQueryable(Type).
                        var oneToMany = dataContext.orm.oneToMany.get(entity.constructor, key);
                        var manyToMany = dataContext.orm.manyToMany.get(entity.constructor, key);
                        var manyToManyAsTargets = dataContext.orm.manyToManyAsTargets.get(entity.constructor, key);

                        var TargetType;
                        if (oneToMany || manyToMany) {
                            TargetType = oneToMany ? oneToMany.ofType : manyToMany.ofType;
                        } else if (manyToManyAsTargets) {
                            TargetType = manyToManyAsTargets.type;
                        }

                        Object.defineProperty(array, "Type", {
                            configurable: true,
                            get: function () {
                                return TargetType;
                            }
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
    }(BASE.util.Observable));
});