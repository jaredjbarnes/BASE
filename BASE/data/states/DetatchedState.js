BASE.require([
    "BASE.data.states.AbstractState",
    "BASE.util.PropertyChangedEvent"
], function () {
    BASE.namespace("BASE.data.states");

    BASE.data.states.DetatchedState = (function (Super) {
        var DetatchedState = function (changeTracker, relationManager) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new DetatchedState(changeTracker, relationManager);
            }

            Super.call(self, changeTracker, relationManager);

            // Called to add this entity to the collection.
            self.add = function () {
                // We need to clear a key to null, so it's treated new.
                changeTracker.entity.id = null;

                changeTracker.changeState(BASE.data.EntityChangeTracker.ADDED);
            };

            return self;
        };

        BASE.extend(DetatchedState, Super);

        return DetatchedState;
    }(BASE.data.states.AbstractState));
});