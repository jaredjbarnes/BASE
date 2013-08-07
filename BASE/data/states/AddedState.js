BASE.require([
    "BASE.collections.Hashmap",
    "BASE.data.states.AbstractState",
    "BASE.util.PropertyChangedEvent",
    "BASE.collections.ObservableArray"
], function () {
    BASE.namespace("BASE.data.states");

    var Hashmap = BASE.collections.Hashmap;
    var PropertyChangedEvent = BASE.util.PropertyChangedEvent;

    BASE.data.states.AddedState = (function (Super) {
        var AddedState = function (changeTracker, relationManager) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new AddedState(changeTracker, relationManager);
            }

            Super.call(self, changeTracker, relationManager);

            var entity = changeTracker.entity;

            self.add = function () {
                // Do nothing we are already added.
            };

            self.remove = function () {
                // If we are in this state we just detatch, because the service,
                // doesn't know about us yet.
                changeTracker.changeState(BASE.data.EntityChangeTracker.DETATCHED);
            };

            self.update = function (event) {
                // Do nothing because we haven't added the entity to the service yet.
            };

            self.save = function () {
                // Add the entity through the service.
                changeTracker.changeState(BASE.data.EntityChangeTracker.LOADED);
                return changeTracker.dataContext.service.addEntity(entity).then(function (response) {
                    var previousState = changeTracker.state;

                    self.sync(response.dto);

                    changeTracker.changeState(previousState);
                }).ifError(function () {
                    changeTracker.changeState(BASE.data.EntityChangeTracker.ADDED);
                });
            };

            var assemble = function () {
                // We need to add all the entities that have been assigned to this entity
                // through relationship.

                var _dataContext = changeTracker.dataContext;

                // Iterate through "one to one" relationships and notify changes.
                var oneToOne = _dataContext.orm.oneToOne.get(entity.constructor) || new Hashmap();
                oneToOne.getKeys().forEach(function (key) {
                    var relationship = oneToOne.get(key);
                    var property = relationship.hasOne;

                    var event = new PropertyChangedEvent(property, null, entity[property], entity);
                    entity.notify(event);
                });

                // Iterate through "one to many" relationships and notify changes.
                var oneToMany = _dataContext.orm.oneToMany.get(entity.constructor) || new Hashmap();
                oneToMany.getKeys().forEach(function (key) {
                    var relationship = oneToMany.get(key);
                    var property = relationship.hasMany;

                    var array = entity[property];

                    Object.defineProperty(array, "Type", {
                        configurable: true,
                        get: function () {
                            return relationship.ofType;
                        }
                    });

                    array.notify({ oldItems: [], newItems: array.slice(0) });
                });

                // Iterate through "many to many" relationships and notify changes.
                var manyToMany = _dataContext.orm.manyToMany.get(entity.constructor) || new Hashmap();
                manyToMany.getKeys().forEach(function (key) {
                    var relationship = manyToMany.get(key);
                    var property = relationship.hasMany;

                    var array = entity[property];
                    Object.defineProperty(array, "Type", {
                        configurable: true,
                        get: function () {
                            return relationship.ofType;
                        }
                    });

                    array.notify({ oldItems: [], newItems: array.slice(0) });
                });


                // Iterate through "one to one" relationships and notify changes.
                var oneToOneAsTargets = _dataContext.orm.oneToOneAsTargets.get(entity.constructor) || new Hashmap();
                oneToOneAsTargets.getKeys().forEach(function (key) {
                    var relationship = oneToOneAsTargets.get(key);
                    var property = relationship.withOne;

                    var event = new PropertyChangedEvent(property, null, entity[property], entity);
                    entity.notify(event);
                });

                // Iterate through "one to many" as targets relationships and notify changes.
                var oneToManyAsTargets = _dataContext.orm.oneToManyAsTargets.get(entity.constructor) || new Hashmap();
                oneToManyAsTargets.getKeys().forEach(function (key) {
                    var relationship = oneToManyAsTargets.get(key);
                    var property = relationship.withOne;

                    var event = new PropertyChangedEvent(property, null, entity[property], entity);
                    entity.notify(event);
                });


                // Iterate through "many to many" as targets relationships and notify changes.
                var manyToManyAsTargets = _dataContext.orm.manyToManyAsTargets.get(entity.constructor) || new Hashmap();
                manyToManyAsTargets.getKeys().forEach(function (key) {
                    var relationship = manyToManyAsTargets.get(key);
                    var property = relationship.withMany;

                    var array = entity[property];
                    Object.defineProperty(array, "Type", {
                        configurable: true,
                        get: function () {
                            return relationship.type;
                        }
                    });

                    array.notify({ oldItems: [], newItems: array.slice(0) });
                });
            };

            self.start = function () {
                var dataContext = changeTracker.dataContext;
                relationManager.start();
                dataContext.changeTracker.added.add(entity, entity);

                assemble();
            };
            self.stop = function () {
                var dataContext = changeTracker.dataContext;

                relationManager.stop();
                dataContext.changeTracker.added.remove(entity);
            };
            return self;
        };

        BASE.extend(AddedState, Super);

        return AddedState;
    }(BASE.data.states.AbstractState));
});