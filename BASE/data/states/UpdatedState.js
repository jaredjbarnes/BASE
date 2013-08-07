BASE.require([
    "BASE.data.states.AbstractState",
    "BASE.collections.Hashmap",
    "BASE.util.PropertyChangedEvent"
], function () {
    BASE.namespace("BASE.data.states");

    var Hashmap = BASE.collections.Hashmap;

    BASE.data.states.UpdatedState = (function (Super) {
        var UpdatedState = function (changeTracker, relationManager) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new UpdatedState(changeTracker, relationManager);
            }

            Super.call(self, changeTracker, relationManager);

            var entity = changeTracker.entity;
            var entityChanges = new Hashmap();

            Object.defineProperty(self, "entityChanges", {
                get: function () {
                    return entityChanges;
                }
            });

            // Called to add this entity to the collection.
            self.add = function () {
                // We do nothing, because we know that this entity is already in the added bucket.
            };

            self.remove = function () {
                // We remove ourselves from the added bucket and change our state to removed.
                changeTracker.changeState(BASE.data.EntityChangeTracker.REMOVED);
            };

            self.update = function (event) {
                // Save the changes to the hash, so we can save to the service when the user saves changes.
                entityChanges.add(event.property, event.newValue);
            };

            self.save = function () {
                // Add the entity through the service.
                changeTracker.changeState(BASE.data.EntityChangeTracker.LOADED);
                return changeTracker.dataContext.service.updateEntity(entity, entityChanges).then(function () {
                    entityChanges = new Hashmap();
                }).ifError(function (err) {
                    if (err instanceof BASE.data.EntityNotFoundError) {
                        changeTracker.changeState(BASE.data.EntityChangeTracker.DETATCHED);
                    } else {
                        changeTracker.changeState(BASE.data.EntityChangeTracker.UPDATED);
                    }
                });
            };

            self.start = function () {
                var dataContext = changeTracker.dataContext;

                relationManager.start();
                dataContext.changeTracker.updated.add(entity, entity);
            };
            self.stop = function () {
                var dataContext = changeTracker.dataContext;

                relationManager.stop();
                dataContext.changeTracker.updated.remove(entity);
            };

            return self;
        };

        BASE.extend(UpdatedState, Super);

        return UpdatedState;
    }(BASE.data.states.AbstractState));
});