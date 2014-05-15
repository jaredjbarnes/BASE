BASE.require([
    "BASE.behaviors.NotifyPropertyChange",
    "BASE.data.responses.ServiceResponse"
], function () {

    BASE.namespace("BASE.data");

    var emptyFn = function () { };
    var Future = BASE.async.Future;
    var ServiceResponse = BASE.data.responses.ServiceResponse;

    var makeSetterName = function (name) {
        return "set" + name.substr(0, 1).toUpperCase() + name.substr(1);
    };

    var isPrimitive = function (value) {

        if (typeof value === "number" ||
            typeof value === "string" ||
            typeof value === "boolean" ||
            value instanceof Date ||
            value === null) {

            return true;

        }

        return false;
    };

    BASE.data.ChangeTracker = function (entity, dataStore) {
        var self = this;
        var changeTracker = self;

        BASE.behaviors.Observable.call(self);

        BASE.behaviors.NotifyPropertyChange.call(entity);

        var updateHash = {};

        var observer = entity.observe();
        observer.filter(function (e) {
            if (e.type === "propertyChange" &&
                isPrimitive(e.oldValue) &&
                isPrimitive(e.newValue)) {
                return true;
            }
            return false;
        }).onEach(function (e) {
            updateHash[e.property] = e.newValue;
            self.update();
        });

        var BaseState = function () {
            var self = this;
            self.add = emptyFn;
            self.update = emptyFn;
            self.remove = emptyFn;

            self.sync = function (dto) {
                observer.stop();

                Object.keys(dto).forEach(function (key) {
                    var value = dto[key]
                    if (isPrimitive(value)) {
                        entity[makeSetterName(key)](value);
                    }
                });

                observer.start();
            };

            self.save = function () {
                throw new Error("This should be overridden.");
            };
        };

        var LoadedState = function () {
            var self = this;

            self.update = function () {
                changeTracker.setStateToUpdated();
            };

            self.remove = function () {
                changeTracker.setStateToRemoved();
            };

            self.save = function () {
                return Future.fromResult(new ServiceResponse("Nothing to save."));
            };
        };
        LoadedState.prototype = new BaseState();

        var AddedState = function () {
            var self = this;
            self.save = function () {

                changeTracker.setStateToLoaded();

                return dataStore.add(entity).then(function (response) {
                    var dto = response.dto;
                    state.sync(dto);
                }).ifError(function (errorResponse) {
                    changeTracker.setStateToAdded();
                });

            };
        };
        AddedState.prototype = new BaseState();

        var UpdatedState = function () {
            var self = this;
            self.remove = function () {
                changeTracker.setStateToRemoved();
            };
            self.save = function () {
                var updates = BASE.clone(updateHash, true);
                changeTracker.setStateToLoaded();
                updateHash = {};

                return dataStore.update(entity.id, updates).ifError(function (errorResponse) {
                    // This will capture any updates that may have happened while trying to save.
                    Object.keys(updateHash).forEach(function (key) {
                        updates[key] = updateHash[key];
                    });
                    updateHash = updates;
                    changeTracker.setStateToUpdated();
                });
            };
        };
        UpdatedState.prototype = new BaseState();

        var RemovedState = function () {
            var self = this;
            self.add = function () {
                if (Object.keys(updateHash).length > 0) {
                    changeTracker.setStateToUpdated();
                } else {
                    changeTracker.setStateToLoaded();
                }
            };
            self.save = function () {
                changeTracker.setStateToDetached();
                return dataStore.remove(entity.id).then(function () {

                }).ifError(function () {
                    changeTracker.setStateToRemoved();
                });
            };
        };
        RemovedState.prototype = new BaseState();

        var DetachedState = function () {
            var self = this;

            self.add = function () {
                entity.id = null;
                changeTracker.setStateToAdded();
            };

            self.save = function () {
                throw new Error("This should have never been called, because the state is detached.");
            };
        };
        DetachedState.prototype = new BaseState();

        var loadedState = new LoadedState();
        var addedState = new AddedState();
        var removedState = new RemovedState();
        var updatedState = new UpdatedState();
        var detachedState = new DetachedState();

        self.setStateToDetached = function () {
            state = detachedState;
            observer.dispose();
            self.notify({
                type: "detached"
            });
        };

        self.setStateToLoaded = function () {
            state = loadedState;
            self.notify({
                type: "loaded"
            });
        };

        self.setStateToAdded = function () {
            state = addedState;
            self.notify({
                type: "added"
            });
        };

        self.setStateToRemoved = function () {
            state = removedState;
            self.notify({
                type: "removed"
            });
        };

        self.setStateToUpdated = function () {
            state = updatedState;
            self.notify({
                type: "updated"
            });
        };

        var state = detachedState;

        self.add = function () {
            return state.add();
        };

        self.remove = function () {
            return state.remove();
        };

        self.update = function () {
            return state.update();
        };

        self.sync = function (dto) {
            return state.sync(dto);
        };

        self.save = function () {
            return state.save();
        };
    };

});