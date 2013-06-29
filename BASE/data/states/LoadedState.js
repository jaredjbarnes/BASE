﻿BASE.require(["BASE.data.states.AbstractState", "BASE.PropertyChangedEvent"], function () {
    BASE.namespace("BASE.data.states");

    BASE.data.states.LoadedState = (function (Super) {
        var LoadedState = function (changeTracker, relationManager) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new LoadedState(changeTracker, relationManager);
            }

            Super.call(self, changeTracker, relationManager);

            var entity = changeTracker.entity;

            self.remove = function () {
                // We remove ourselves from the added bucket and change our state to removed.
                changeTracker.changeState(BASE.data.EntityChangeTracker.REMOVED);
            };

            self.update = function (event) {
                // Change the state to UPDATED.
                changeTracker.changeState(BASE.data.EntityChangeTracker.UPDATED);
                // Fire the event on the updated state.
                changeTracker.stateObject.update(event);
            };

            self.start = function () {
                var dataContext = changeTracker.dataContext;

                relationManager.start();
                dataContext.changeTracker.loaded.add(entity, entity);
            };
            self.stop = function () {
                var dataContext = changeTracker.dataContext;

                relationManager.stop();
                dataContext.changeTracker.loaded.remove(entity);
            };
             
            return self;
        };

        BASE.extend(LoadedState, Super);

        return LoadedState;
    }(BASE.data.states.AbstractState));
});