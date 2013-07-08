BASE.require([
    "BASE.MultiKeyMap",
    "BASE.Hashmap",
    "BASE.ObservableEvent",
    "BASE.Observable",
    "BASE.data.ObjectRelationManager",
    "BASE.data.NullService",
    "BASE.data.DataSet",
    "BASE.ObservableArray",
    "BASE.Future",
    "BASE.Task",
    "BASE.query.Queryable",
    "Array.prototype.asQueryable"
], function () {
    BASE.namespace("BASE.data");

    var ObjectRelationManager = BASE.data.ObjectRelationManager;
    var Future = BASE.Future;
    var Task = BASE.Task;
    var Hashmap = BASE.Hashmap;
    var Observable = BASE.Observable;
    var ObservableEvent = BASE.ObservableEvent;

    BASE.data.DataContext = (function (Super) {

        var DataContext = function () {
            var self = this;

            if (!(self instanceof DataContext)) {
                return new DataContext();
            }

            Super.call(self);

            var _orm = null;
            var _relationships = null;
            var _service = new BASE.data.NullService();
            var _typeToSet = new BASE.Hashmap();

            var _findSets = function () {
                Object.keys(self).forEach(function (x) {
                    if (self[x] instanceof BASE.data.DataSet) {
                        var dataSet = self[x];
                        _typeToSet.add(dataSet.Type, dataSet);
                    }
                });
            };

            Object.defineProperties(self, {
                "orm": {
                    get: function () {
                        return _orm;
                    }
                },
                "service": {
                    get: function () {
                        return _service;
                    },
                    set: function (value) {
                        var oldValue = _service;
                        if (value !== oldValue) {
                            _service = value;

                            _orm = new ObjectRelationManager(value.relationships);
                            value.dataContext = self;
                        }
                    }
                }
            });

            self.changeTracker = {
                loaded: new BASE.Hashmap(),
                added: new BASE.Hashmap(),
                removed: new BASE.Hashmap(),
                updated: new BASE.Hashmap()
            };

            self.getDataSet = function (Type) {
                if (_typeToSet.getKeys().length === 0) {
                    _findSets();
                }
                var dataSet = _typeToSet.get(Type);
                if (!dataSet) {
                    dataSet = new BASE.data.DataSet(Type, self);
                    _typeToSet.add(Type, dataSet);
                }
                return dataSet;
            };

            // This holds all the entities that have been told to save, but the service isn't finished.
            // There may be two objects that depend on an entity being saved before they can be.
            var pendingSavedObjects = new Hashmap();

            self.save = function (entity) {
                return new Future(function (setValue, setError) {
                    var dependsOn = self.orm.dependsOn(entity);
                    var task = new Task();

                    dependsOn.forEach(function (sourceEntity) {
                        task.add(self.save(sourceEntity));
                    });

                    task.start().whenAll(function (futures) {
                        var pendingSave = pendingSavedObjects.get(entity);
                        // If its already pending wait for its return by observing and reply back.
                        if (pendingSave) {
                            pendingSave.observe(function (e) {
                                setValue(e.response);
                            }, "saved");

                            pendingSave.observe(function (e) {
                                setError(e.response);
                            }, "error");
                        } else {
                            // We need to make the pending save object, its simply an observable object, so we can attatch events to it.
                            pendingSave = new Observable();
                            pendingSavedObjects.add(entity, pendingSave);

                            entity.changeTracker.save().then(function (response) {
                                setValue(response);

                                // Notify other entities that the object has been saved.
                                var savedEvent = new ObservableEvent("saved");
                                savedEvent.response = response;
                                pendingSave.notify(savedEvent);

                                // Remove the pendingSave object from the hash, to prevent memory leak.
                                pendingSavedObjects.remove(entity);
                            }).ifError(function (e) {
                                setError(e);

                                // Notify other entities that the object has been error.
                                var errorEvent = new ObservableEvent("error");
                                errorEvent.response = e;
                                pendingSave.notify(errorEvent);

                                // Remove the pendingSave object from the hash, to prevent memory leak.
                                pendingSavedObjects.remove(entity);
                            });
                        }
                    });
                });
            };

            self.saveChanges = function () {
                return new Future(function (setValue, setError) {
                    var task = new Task();

                    // Reference the buckets to avoid the long namespacing later.
                    var added = self.changeTracker.added;
                    var updated = self.changeTracker.updated;
                    var removed = self.changeTracker.removed;

                    // We need to save each entity in each bucket, and wait for a return.
                    removed.getKeys().forEach(function (key) {
                        var entity = removed.get(key);
                        task.add(self.save(entity));
                    });

                    updated.getKeys().forEach(function (key) {
                        var entity = updated.get(key);
                        task.add(self.save(entity));
                    });

                    added.getKeys().forEach(function (key) {
                        var entity = added.get(key);

                        task.add(self.save(entity));
                    });

                    task.start().whenAll(function (futures) {
                        var returnObject = {
                            errors: [],
                            successes: []
                        };

                        futures.forEach(function (future) {
                            if (future.error) {
                                returnObject.errors.push(future.error);
                            } else {
                                returnObject.successes.push(future.value);
                            }
                        });

                        setValue(returnObject);

                    });
                }).then();
            };

            return self;
        };

        BASE.extend(DataContext, Super);

        return DataContext;

    }(BASE.Observable));
});