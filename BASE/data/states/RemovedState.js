﻿BASE.require([
    "BASE.data.states.AbstractState",
    "BASE.util.PropertyChangedEvent",
    "BASE.collections.Hashmap"
], function () {
    BASE.namespace("BASE.data.states");

    var Hashmap = BASE.collections.Hashmap;

    BASE.data.states.RemovedState = (function (Super) {
        var RemovedState = function (changeTracker, relationManager) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new RemovedState(changeTracker, relationManager);
            }

            Super.call(self, changeTracker, relationManager);

            var entity = changeTracker.entity;
            var entityChanges = new Hashmap();

            self.add = function () {
                // Change the state to loaded.
                if (entityChanges.getKeys().length > 0) {
                    changeTracker.changeState(BASE.data.EntityChangeTracker.UPDATED);
                } else {
                    changeTracker.changeState(BASE.data.EntityChangeTracker.LOADED);
                }
            };

            self.remove = function () {
                // We are already removed.
            };

            self.update = function (event) {
                entityChanges.add(event.property, event.newValue);
            };

            self.save = function () {
                // Add the entity through the service.
                changeTracker.changeState(BASE.data.EntityChangeTracker.DETATCHED);
                return changeTracker.dataContext.service.removeEntity(entity).then(function () {
                    changeTracker.dataContext = null;
                }).ifError(function (err) {
                    if (err instanceof BASE.data.EntityNotFoundError) {
                        changeTracker.changeState(BASE.data.EntityChangeTracker.DETATCHED);
                    } else {
                        changeTracker.dataContext.getDataSet(entity.constructor).load(entity);
                        changeTracker.changeState(BASE.data.EntityChangeTracker.REMOVED);
                    }
                });
            };

            self.start = function () {
                var dataContext = changeTracker.dataContext;

                relationManager.start();
                dataContext.changeTracker.removed.add(entity, entity);
            };

            self.stop = function () {
                var dataContext = changeTracker.dataContext;

                relationManager.stop();
                dataContext.changeTracker.removed.remove(entity);
            };
            return self;
        };

        BASE.extend(RemovedState, Super);

        return RemovedState;
    }(BASE.data.states.AbstractState));
});