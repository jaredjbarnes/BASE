BASE.require([
    "BASE.async.Future",
    "BASE.async.Task",
    "BASE.collections.Hashmap",
    "BASE.data.EntityRelationManager",
    "BASE.data.states.DetachedState",
    "BASE.data.states.AddedState",
    "BASE.data.states.LoadedState",
    "BASE.data.states.UpdatedState",
    "BASE.data.states.RemovedState"
], function () {
    BASE.namespace("BASE.data");

    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Hashmap = BASE.collections.Hashmap;
    var EntityRelationManager = BASE.data.EntityRelationManager;

    var DetachedState = BASE.data.states.DetachedState;
    var AddedState = BASE.data.states.AddedState;
    var LoadedState = BASE.data.states.LoadedState;
    var UpdatedState = BASE.data.states.UpdatedState;
    var RemovedState = BASE.data.states.RemovedState;

    BASE.data.EntityChangeTracker = (function (Super) {
        var EntityChangeTracker = function (entity) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new EntityChangeTracker(entity);
            }

            self.entity = entity;
            BASE.behaviors.Observable.apply(self);

            // This dataSet will be used to load entities in.
            var dataSet = null;

            // This is used by the LOADED state to move the entity to UPDATED state upon change.
            var onEntityUpdated = function (event) {
                // Check to see if we are part of a context.
                if (_dataContext) {
                    // Check if the property changed is a "one to one" relationship.
                    var oneToOne = _dataContext.getOrm().oneToOneRelationships.get(entity.constructor, event.property);
                    var oneToOneTarget = _dataContext.getOrm().oneToOneTargetRelationships.get(entity.constructor, event.property);
                    var oneToManyAsTarget = _dataContext.getOrm().oneToManyTargetRelationships.get(entity.constructor, event.property);

                    // If its not a relationship save changes.
                    if (!oneToOne && !oneToOneTarget && !oneToManyAsTarget) {
                        _state.update(event);
                    }
                }
            };

            // Start listening for changes to the changeTracker.
            var onEntityUpdatedObserver = entity.observeAllProperties(onEntityUpdated);

            self.changeState = function (state) {
                // Ensure that the state parameter is legitimate.
                if (typeof state !== "number") {
                    throw new Error("The state needs to be a number, please use the enum found on EntityChangeTracker class.");
                }

                if (state > 4 || state < 0) {
                    throw new Error("The state must be 0 - 4.");
                }

                // We need to remember the old state so that we can end it.
                var oldState = _state;
                var oldCurrentState = _currentState;

                // Check to make sure the state is actually going to change.
                if (_currentState !== state) {
                    // Save the int version of the state
                    _currentState = state;

                    // Stop the existing state.
                    _state.stop();

                    // Switch the state object.
                    _state = _states[state];

                    // Start the new state.
                    _state.start();

                    // Notify observers of state changes.
                    self.notify({
                        type: "state",
                        property: "state",
                        oldValue: oldCurrentState,
                        newValue: state,
                        target: self
                    });
                }
            };

            // This method will be called by the data context.
            self.save = function () {
                return _state.save();
            };

            // This method will be called by the data context.
            self.add = function () {
                _state.add();
            };

            // This method will be called by the data context.
            self.remove = function () {
                _state.remove();
            };

            self.sync = function (dto) {
                // We need stop listening for property changes.
                onEntityUpdatedObserver.stop();

                _state.sync(dto);

                // Start listening for changes again after we synced it.
                onEntityUpdatedObserver.start();
            };

            self.unload = function () {
                _state.unload();
            };

            var _dataContext = null;

            self.getDataContext = function () {
                if (!_dataContext) {
                    //throw new Error("No data context has been assigned to this tracker.");
                }
                return _dataContext;
            };

            self.setDataContext = function (value) {
                var oldValue = _dataContext;
                if (value !== _dataContext) {
                    _dataContext = value;
                    // The data context may be null if the entity is being removed from the context.
                    if (_dataContext) {
                        dataSet = _dataContext.getDataSet(entity.constructor);
                    }

                    entityRelationManager.setDataContext(_dataContext);
                    self.notify({ type: "dataContext", oldValue: oldValue, newValue: value });
                }
            };

            // This is used to manage relationships between entities.
            // It can be used with the start and stop method on the ERM.
            var entityRelationManager = new EntityRelationManager(entity);

            var _states = {
                "0": new DetachedState(self, entityRelationManager),
                "1": new LoadedState(self, entityRelationManager),
                "2": new AddedState(self, entityRelationManager),
                "3": new UpdatedState(self, entityRelationManager),
                "4": new RemovedState(self, entityRelationManager)
            };

            // This is the actual state object.
            var _state = _states["0"];

            // This is the int value of the state.
            var _currentState = 0;

            self.getState = function () {
                return _currentState;
            };

            self.getStateObject = function () {
                return _state;
            };

            self.changeStateToDetached = function () {
                self.changeState(0);
            };

            self.changeStateToLoaded = function () {
                self.changeState(1);
            };

            self.changeStateToAdded = function () {
                self.changeState(2);
            };

            self.changeStateToUpdated = function () {
                self.changeState(3);
            };

            self.changeStateToRemoved = function () {
                self.changeState(4);
            };

            return self;
        };

        BASE.extend(EntityChangeTracker, Super);

        EntityChangeTracker.DETACHED = 0;
        EntityChangeTracker.LOADED = 1;
        EntityChangeTracker.ADDED = 2;
        EntityChangeTracker.UPDATED = 3;
        EntityChangeTracker.REMOVED = 4;

        return EntityChangeTracker;
    }(Object));
});