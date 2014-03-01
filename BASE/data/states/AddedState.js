BASE.require([
    "BASE.collections.Hashmap",
    "BASE.data.states.AbstractState"
], function () {
    BASE.namespace("BASE.data.states");

    var Hashmap = BASE.collections.Hashmap;

    BASE.data.states.AddedState = (function (Super) {
        var AddedState = function (changeTracker, relationManager) {
            var self = this;

            BASE.assertNotGlobal(self);

            Super.call(self, changeTracker, relationManager);

            var entity = changeTracker.entity;

            self.add = function () {
                // Do nothing we are already added.
            };

            self.remove = function () {
                // If we are in this state we just detatch, because the service,
                // doesn't know about us yet.
                changeTracker.changeState(BASE.data.EntityChangeTracker.DETACHED);
            };

            self.update = function (event) {
                // Do nothing because we haven't added the entity to the service yet.
            };

            self.save = function () {
                // Add the entity through the service.
                changeTracker.changeState(BASE.data.EntityChangeTracker.LOADED);
                return changeTracker.getDataContext().getService().addEntity(entity).then(function (response) {
                    var previousState = changeTracker.getState();

                    self.sync(response.dto);

                    changeTracker.changeState(previousState);
                }).ifError(function () {
                    changeTracker.changeState(BASE.data.EntityChangeTracker.ADDED);
                });
            };

            var assemble = function () {
                // We need to add all the entities that have been assigned to this entity
                // through relationship.

                var _dataContext = changeTracker.getDataContext();

                // Iterate through "one to one" relationships and notify changes.
                var oneToOne = _dataContext.getOrm().getOneToOnes(entity);
                oneToOne.forEach(function (relationship) {
                    var property = relationship.hasOne;
                    entity.notify({
                        type: property,
                        property: property,
                        oldValue: null,
                        newValue: entity[property],
                        target: entity
                    });
                });

                // Iterate through "one to many" relationships and notify changes.
                var oneToMany = _dataContext.getOrm().getOneToManys(entity);
                oneToMany.forEach(function (relationship) {
                    var property = relationship.hasMany;

                    var array = entity[property];

                    array.Type = relationship.ofType;

                    array.notify({ oldItems: [], newItems: array.slice(0) });
                });

                // Iterate through "many to many" relationships and notify changes.
                var manyToMany = _dataContext.getOrm().getManyToManys(entity);
                manyToMany.forEach(function (relationship) {
                    var property = relationship.hasMany;

                    var array = entity[property];

                    array.Type = relationship.ofType;

                    array.notify({ oldItems: [], newItems: array.slice(0) });
                });


                // Iterate through "one to one" relationships and notify changes.
                var oneToOneAsTargets = _dataContext.getOrm().getOneToOneAsTargets(entity);
                oneToOneAsTargets.forEach(function (relationship) {
                    var property = relationship.withOne;

                    entity.notify({
                        type: property,
                        property: property,
                        oldValue: null,
                        newValue: entity[property],
                        target: entity
                    });
                });

                // Iterate through "one to many" as targets relationships and notify changes.
                var oneToManyAsTargets = _dataContext.getOrm().getOneToManyAsTargets(entity);
                oneToManyAsTargets.forEach(function (relationship) {
                    var property = relationship.withOne;

                    entity.notify({
                        type: property,
                        property: property,
                        oldValue: null,
                        newValue: entity[property],
                        target: entity
                    });
                });


                // Iterate through "many to many" as targets relationships and notify changes.
                var manyToManyAsTargets = _dataContext.getOrm().getManyToManyAsTargets(entity);
                manyToManyAsTargets.forEach(function (relationship) {
                    var property = relationship.withMany;

                    var array = entity[property];
                    array.Type = relationship.type;

                    array.notify({ oldItems: [], newItems: array.slice(0) });
                });
            };

            self.start = function () {
                var dataContext = changeTracker.getDataContext();
                relationManager.start();
                dataContext.changeTracker.added.add(entity, entity);

                assemble();
            };
            self.stop = function () {
                var dataContext = changeTracker.getDataContext();

                relationManager.stop();
                dataContext.changeTracker.added.remove(entity);
            };
            return self;
        };

        BASE.extend(AddedState, Super);

        return AddedState;
    }(BASE.data.states.AbstractState));
});