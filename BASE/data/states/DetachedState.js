BASE.require([
    "BASE.data.states.AbstractState"
], function () {
    BASE.namespace("BASE.data.states");

    BASE.data.states.DetachedState = (function (Super) {
        var DetachedState = function (changeTracker, relationManager) {
            var self = this;

            BASE.assertNotGlobal(self);

            Super.call(self, changeTracker, relationManager);

            // Called to add this entity to the collection.
            self.add = function () {
                // We need to clear a key to null, so it's treated new.
                changeTracker.entity.setId(null);

                changeTracker.changeState(BASE.data.EntityChangeTracker.ADDED);
            };

            return self;
        };

        BASE.extend(DetachedState, Super);

        return DetachedState;
    }(BASE.data.states.AbstractState));
});