BASE.require([
    "BASE.Observable",
    "BASE.Future",
    "BASE.Task",
    "BASE.PropertyChangedEvent",
    "BASE.Hashmap",
    "Array.prototype.where",
    "BASE.data.EntityRelationManager",
    "BASE.data.states.DetatchedState",
    "BASE.data.states.AddedState",
    "BASE.data.states.LoadedState",
    "BASE.data.states.UpdatedState",
    "BASE.data.states.RemovedState"
], function () {
    BASE.namespace("BASE.data");

    var Future = BASE.Future;
    var Task = BASE.Task;
    var Hashmap = BASE.Hashmap;
    var EntityRelationManager = BASE.data.EntityRelationManager;
    var PropertyChangedEvent = BASE.PropertyChangedEvent;

    var DetatchedState = BASE.data.states.DetatchedState;
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

            Super.call(self);

            // This dataSet will be used to load entities in.
            var dataSet = null;

            // This is used by the LOADED state to move the entity to UPDATED state upon change.
            var onEntityUpdated = function (event) {
                // Check to see if we are part of a context.
                if (_dataContext) {
                    // Check if the property changed is a "one to one" relationship.
                    var oneToOne = _dataContext.orm.oneToOne.get(entity.constructor, event.property);
                    var oneToOneTarget = _dataContext.orm.oneToOneAsTargets.get(entity.constructor, event.property);
                    var oneToManyAsTarget = _dataContext.orm.oneToManyAsTargets.get(entity.constructor, event.property);

                    // If its not a relationship save changes.
                    if (!oneToOne && !oneToOneTarget && !oneToManyAsTarget) {
                        console.log("UPDATE: " + event.property);
                        _state.update(event);
                    }
                }
            };

            // Start listening for changes to the changeTracker.
            entity.observe(onEntityUpdated);

            var _changeState = function (state) {
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
                    self.notify(new PropertyChangedEvent("state", oldCurrentState, state, self));
                }
            };

            // This method will be called by the data context.
            var _save = function () {
                return _state.save();
            };

            // This method will be called by the data context.
            var _add = function () {
                _state.add();
            };

            // This method will be called by the data context.
            var _remove = function () {
                _state.remove();
            };

            var _sync = function (dto) {
                // We need stop listening for property changes.
                entity.unobserve(onEntityUpdated);

                _state.sync(dto);

                // Start listening for changes again after we synced it.
                entity.observe(onEntityUpdated);
            };

            var _dataContext = null;
            Object.defineProperties(self, {
                dataContext: {
                    get: function () {
                        if (!_dataContext) {
                            throw new Error("No data context has been assigned to this tracker.");
                        }
                        return _dataContext;
                    },
                    set: function (value) {
                        var oldValue = _dataContext;
                        if (value !== _dataContext) {
                            _dataContext = value;
                            // The data context may be null if the entity is being removed from the context.
                            if (_dataContext) {
                                dataSet = _dataContext.getDataSet(entity.constructor);
                            }

                            entityRelationManager.dataContext = _dataContext;
                            self.notify(new PropertyChangedEvent("dataContext", oldValue, value, self));
                        }
                    }
                },
                state: {
                    get: function () {
                        return _currentState;
                    }
                },
                stateObject: {
                    get: function () {
                        return _state;
                    }
                },
                changeState: {
                    enumerable: false,
                    configurable: false,
                    value: _changeState
                },
                add: {
                    enumerable: false,
                    configurable: false,
                    value: _add
                },
                sync: {
                    enumerable: false,
                    configurable: false,
                    value: _sync
                },
                remove: {
                    enumerable: false,
                    configurable: false,
                    value: _remove
                },
                save: {
                    enumerable: false,
                    configurable: false,
                    value: _save
                },
                entity: {
                    get: function () { return entity; }
                }
            });

            // This is used to manage relationships between entities.
            // It can be used with the start and stop method on the ERM.
            var entityRelationManager = new EntityRelationManager(entity);

            // This is the int value of the state.
            var _currentState = 0;

            var _states = {
                "0": new DetatchedState(self, entityRelationManager),
                "1": new LoadedState(self, entityRelationManager),
                "2": new AddedState(self, entityRelationManager),
                "3": new UpdatedState(self, entityRelationManager),
                "4": new RemovedState(self, entityRelationManager),
            };

            // This is the actual state object.
            var _state = _states["0"];

            return self;
        };

        BASE.extend(EntityChangeTracker, Super);

        Object.defineProperties(EntityChangeTracker, {
            "DETATCHED": {
                get: function () {
                    return 0;
                }
            },
            "LOADED": {
                get: function () {
                    return 1;
                }
            },
            "ADDED": {
                get: function () {
                    return 2;
                }
            },
            "UPDATED": {
                get: function () {
                    return 3;
                }
            },
            "REMOVED": {
                get: function () {
                    return 4;
                }
            }
        });

        return EntityChangeTracker;
    }(BASE.Observable));
});