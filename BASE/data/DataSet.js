BASE.require([
    "BASE.Observable",
    "BASE.ObservableArray",
    "BASE.Hashmap",
    "BASE.ObservableEvent",
    "BASE.Future",
    "BASE.query.Queryable",
    "BASE.data.EntityChangeTracker",
    "BASE.PropertyChangedEvent",
    "BASE.query.Provider"
], function () {

    BASE.namespace("BASE.data");

    var Queryable = BASE.query.Queryable;
    var Provider = BASE.query.Provider;
    var EntityChangeTracker = BASE.data.EntityChangeTracker;
    var PropertyChangedEvent = BASE.PropertyChangedEvent;
    var Hashmap = BASE.Hashmap;
    var Future = BASE.Future;

    BASE.data.DataSet = (function (Super) {

        var DataSet = function (Type, context) {
            var self = this;
            if (!(self instanceof DataSet)) {
                return new DataSet(Type, context);
            }

            Super.call(self);

            var _loadedEntities = new BASE.Hashmap();
            var _addedEntities = new BASE.Hashmap();
            var _idObservers = new BASE.Hashmap();
            var _Type = Type;
            var _dataContext = context;

            Object.defineProperties(self, {
                "local": {
                    get: function () {
                        var local = [];
                        _loadedEntities.getKeys().forEach(function (key) {
                            local.push(_loadedEntities.get(key));
                        });
                        _addedEntities.getKeys().forEach(function (key) {
                            local.push(_addedEntities.get(key));
                        });
                        return local;
                    },
                    enumerable: true,
                    configurable: true
                },
                "dataContext": {
                    get: function () {
                        return _dataContext;
                    },
                    enumerable: true,
                    configurable: true
                },
                "Type": {
                    get: function () {
                        return _Type;
                    },
                    enumerable: true,
                    configurable: true
                }
            });

            // This will add the entity to the set and change its state to ADDED.
            self.add = function (entity) {
                // Prevent any dirty objects from coming through.
                if (!(entity instanceof Type) || entity === null) {
                    return entity;
                }

                // Check to see if this entity is already part of this set.
                // And return the loaded Entity.
                var loadedEntity = self.get(entity);
                if (loadedEntity) {
                    return loadedEntity;
                } else {
                    entity.changeTracker.dataContext = _dataContext;
                    entity.changeTracker.add();

                    // This is to switch the entity from the added bucket to the 
                    // loaded bucket, or vice-virsa.
                    var idObserver = function (e) {
                        // There may be a time where the id is nulled and then set again.
                        // so in this time we swap the hashes that the entity is in.
                        if (e.newValue === null && e.oldValue !== null) {
                            // Remove reference from added, and add to loaded.
                            _addedEntities.add(entity, entity);
                            _loadedEntities.remove(e.oldValue, entity);
                        } else if (e.newValue !== null && e.oldValue === null) {
                            // Remove reference from added, and add to loaded.
                            _addedEntities.remove(entity);
                            _loadedEntities.add(e.newValue, entity);
                        }
                    }

                    // We also need to listen for changes to the id.
                    // So we can switch the entity to the loadedEntities hash.
                    entity.observe(idObserver, "id");

                    // Save the observer so the when the entity is removed we can detatch.
                    _idObservers.add(entity, idObserver);

                    _addedEntities.add(entity, entity);

                    return entity;
                }

            };

            // This will remove the entity from the set and change its state to REMOVED.
            self.remove = function (entity) {

                // Prevent any dirty objects from coming through.
                if (!(entity instanceof Type) || entity === null) {
                    throw new Error("The entity supplied was either null or not the right type.");
                }

                // Get the entity if its part of our set.
                var loadedEntity = self.get(entity);
                if (loadedEntity) {
                    loadedEntity.changeTracker.remove();
                    // Detatch the id observer to prevent memory leak.
                    loadedEntity.unobserve(_idObservers.remove(loadedEntity), "id");

                    return loadedEntity;
                } else {
                    return null;
                }

            };

            self.get = function (entity) {
                if (entity instanceof _Type) {
                    // Try to get the result from both hashes.
                    return _addedEntities.get(entity) || _loadedEntities.get(entity.id);
                }
            };

            // This method is much faster then doing a linear search of your array.
            self.has = function (entity) {
                return self.get(entity) === null ? false : true;
            };

            // This method makes entities from dtos.
            self.load = function (dto) {
                // If its just a dto then run it through the loaders.
                // Otherwise just load it into the context.
                if (!(dto instanceof self.Type)) {
                    var Type = _dataContext.service.getTypeForDto(dto);
                    var loadedEntity = self.get(dto);

                    // If it isn't loaded create the entity, loaded it in.
                    if (!loadedEntity) {

                        if (typeof dto.id === "undefined" || dto.id === null) {
                            throw new Error("Entity needs a \"id\" to load.");
                        }

                        loadedEntity = new Type();
                        loadedEntity.id = dto.id;
                        loadedEntity.changeTracker.dataContext = _dataContext;
                        loadedEntity.changeTracker.changeState(EntityChangeTracker.LOADED);
                        _loadedEntities.add(loadedEntity.id, loadedEntity);
                    }

                    var previousState = loadedEntity.changeTracker.state;
                    loadedEntity.changeTracker.sync(dto);
                    loadedEntity.changeTracker.changeState(previousState);

                    return loadedEntity;
                } else {
                    _loadedEntities.add(dto.id, dto);
                }
            };

            // This allows users to query the data set with queryables. 
            self.where = function (expression) {
                var queryable = new Queryable(_Type);

                if (expression) {
                    queryable.where(expression);
                }

                queryable.provider = new Provider();
                queryable.provider.execute = function (queryable) {
                    return new Future(function (setValue, setError) {
                        _dataContext.service.readEntities(queryable.copy()).then(function (dtos) {
                            var resultEntities = [];
                            dtos.forEach(function (dto) {
                                // This will load the entity into the context.
                                var target = self.load(dto);

                                // Add the target to what we send back to the user that asked.
                                resultEntities.push(target);
                            });

                            // This sends back all the targets entities that have now been loaded via "one to many".
                            setValue(resultEntities);
                        }).ifError(function (e) {
                            setError(e);
                        });
                    });
                };

                return queryable;
            };

            self.onChange = function (callback) {
                var self = this;
                self.observe(callback, "changed");
            };

            // TODO: Change the count method to be called on the queryable.
            // This needs to be moved to the queryable.
            self.count = function (expression) {
                return _dataContext.service.countEntities(_Type, new BASE.query.Queryable(_Type).where(expression));
            }

        }

        BASE.extend(DataSet, Super);

        return DataSet;
    })(BASE.Observable);

});