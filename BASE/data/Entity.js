BASE.require([
    "BASE.util.Observable",
    "BASE.async.Future",
    "BASE.data.EntityChangeTracker",
    "BASE.util.PropertyChangedEvent"
], function () {
    BASE.namespace("BASE.data");

    var PropertyChangedEvent = BASE.util.PropertyChangedEvent;

    BASE.data.Entity = (function (Super) {
        function Entity() {
            var self = this;

            if (!(self instanceof arguments.callee)) {
                return new Entity();
            }

            Super.call(self);

            var _id = null;

            Object.defineProperties(self, {
                "changeTracker": {
                    get: function () {
                        return _changeTracker;
                    },
                    enumerable: true,
                    configurable: true
                },
                "id": {
                    get: function () {
                        return _id;
                    },
                    set: function (value) {
                        var oldValue = _id;
                        if (oldValue !== value) {
                            _id = value;
                            this.notify(new PropertyChangedEvent("id", oldValue, value));
                        }
                    },
                    enumerable: true,
                    configurable: true
                }
            });

            self.save = function () {
                dataContext = self.changeTracker.dataContext;
                if (dataContext) {
                    return dataContext.save(self);
                } else {
                    throw new Error("Entity isn't part of a context.");
                }
            };

            self.load = function () {
                return new BASE.async.Future(function (setValue, setError) {
                    var dataContext = self.changeTracker.dataContext;
                    if (dataContext) {
                        var dataSet = dataContext.getDataSet(self.constructor);

                        dataSet.asQueryable().where(function (e) {
                            return e.id.equals(self.id);
                        }).toArray().then(function (entities) {
                            setValue(entities[0]);
                        }).ifError(function (err) {
                            setError(err);
                        });

                    } else {
                        console.error(self);
                        throw new Error("Entity isn't part of a context.");
                    }
                }).then();
            };

            // This needs to be set last.
            var _changeTracker = new BASE.data.EntityChangeTracker(self);
        }

        BASE.extend(Entity, BASE.util.Observable);

        return Entity;
    }(BASE.util.Observable));
});

