BASE.require([
    "BASE.behaviors.NotifyPropertyChange",
    "BASE.data.EntityChangeTracker",
    "BASE.async.Future"
], function () {
    BASE.namespace("BASE.behaviors.data");

    var global = (function () { return this; }());

    BASE.behaviors.data.Entity = function () {
        var self = this;

        if (this === global) {
            throw new Error("Entity is intended to be applied to a non-global object");
        }

        // Get out if it has already been applied.
        if (BASE.hasInterface(self, ["save", "getChangeTracker", "load"])) {
            return;
        }

        self.id = null;
        // Make us observable as well
        BASE.behaviors.NotifyPropertyChange.call(self);

        self.getChangeTracker = function () {
            return _changeTracker;
        };

        self.save = function () {
            var dataContext = _changeTracker.dataContext;
            if (dataContext) {
                return dataContext.save(self).then();
            } else {
                throw new Error("Entity isn't part of a context.");
            }
        };

        self.load = function () {
            return new BASE.async.Future(function (setValue, setError) {
                var dataContext = _changeTracker.dataContext;
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
                    setTimeout(function () { setValue(self); }, 0);
                }
            }).then();
        };

        // This needs to be set last.
        // Really? Why?
        var _changeTracker = new BASE.data.EntityChangeTracker(self);
    };
});