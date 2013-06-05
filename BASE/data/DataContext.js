BASE.require([
    "BASE.MultiKeyMap",
    "BASE.Hashmap",
    "BASE.ObservableEvent",
    "BASE.Observable",
    "BASE.data.ObjectRelationManager",
    "BASE.Synchronizer",
    "BASE.data.NullService",
    "BASE.data.DataSet",
    "BASE.ObservableArray",
    "BASE.Future",
    "BASE.query.Queryable"
], function () {
    BASE.namespace("BASE.data");

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
            var _entityObservers = new BASE.MultiKeyMap();

            var _pendingSave = new BASE.Hashmap();
            var _updatedProperties = new BASE.MultiKeyMap();

            var _typeToSet = new BASE.Hashmap();

            var _findSets = function () {
                Object.keys(self).forEach(function (x) {
                    if (self[x] instanceof BASE.data.DataSet) {
                        var dataSet = self[x];
                        _typeToSet.add(dataSet.type, dataSet);
                    }
                });
            };

            var _remove = function (entity) {
                if (entity) {
                    var observer = _entityObservers.get(entity, "default");
                    entity.unobserve(observer);

                    var Type = entity.constructor;
                    var dataSet = self.getDataSet(Type);
                    dataSet.unloadEntity(entity);

                    var oneToOne = _orm.getOneToOneRelationships(Type) ? _orm.getOneToOneRelationships(Type).getKeys() : [];
                    var oneToMany = _orm.getOneToManyRelationships(Type) ? _orm.getOneToManyRelationships(Type).getKeys() : [];
                    var manyToMany = _orm.getManyToManyRelationships(Type) ? _orm.getManyToManyRelationships(Type).getKeys() : [];

                    // Strip entity of all relationships.
                    oneToOne.forEach(function (key) {
                        var relationship = _orm.getOneToOneRelationships(Type).get(key);
                        var property = relationship.Type === Type ? relationship.hasOne : relationship.withOne;
                        var key = relationship.Type === Type ? relationship.hasKey : relationship.withKey;

                        if (Type === relationship.Type && relationship.cascadeDelete) {
                            var childEntity = entity[property];
                            entity[property] = null;
                            entity[key] = null;
                            _remove(childEntity);
                        } else {
                            entity[property] = null;
                            entity[key] = null;
                        }
                    });

                    oneToMany.forEach(function (key) {
                        var relationship = _orm.getOneToManyRelationships(Type).get(key);
                        var property = relationship.Type === Type ? relationship.hasMany : relationship.withOne;

                        var observer = _entityObservers.get(entity, property);
                        if (observer) {
                            entity.unobserve(observer, property);
                        }

                        if (relationship.Type === Type) {
                            var dataSet = self.getDataSet(relationship.ofType);
                            while (entity[property].length > 0) {
                                if (relationship.cascadeDelete) {
                                    _remove(entity[property].pop());
                                } else {
                                    entity[property].pop();
                                }
                            }
                        } else {
                            var key = relationship.withKey;
                            entity[property] = null;
                            entity[key] = null;
                        }

                        if (observer) {
                            entity.observe(observer, property);
                        }

                    });

                    manyToMany.forEach(function (key) {
                        var relationship = _orm.getManyToManyRelationships(Type).get(key);
                        var property = relationship.Type === Type ? relationship.hasMany : relationship.withMany;

                        while (entity[property].length > 0) {
                            entity[property].pop();
                        }

                    });

                    _orm.untrack(entity);

                    entity._hash = null;
                    entity.id = null;
                }
            }



            var onEntityTracked = function (event) {
                var entity = event.entity;
                var Type = entity.constructor;

                if (!_entityObservers.hasKey(entity)) {

                    var observer = function (event) {
                        var property = event.property;
                        var update = true;

                        var oneToOnes = self.orm.getOneToOneRelationships(Type) || new BASE.Hashmap();
                        var isOneToOne = oneToOnes.getKeys().length === 0 ? false : oneToOnes.getKeys().some(function (key) {
                            var relationship = oneToOnes.get(key);
                            if ((Type === relationship.Type && (
                                relationship.hasOne === property ||
                                relationship.hasKey === property
                                )) || (Type === relationship.ofType && (
                                relationship.withOne === property ||
                                relationship.withKey === property
                                ))) {
                                if (relationship.ofType === Type) {
                                    if (!relationship.optional && event.oldValue) {
                                        var dataSet = self.getDataSet(Type);
                                        dataSet.remove(entity);
                                    }
                                }
                                return true;
                            } else if ((Type === relationship.ofType && (
                                relationship.withForeignKey === property
                                ))) {
                                if (relationship.optional) {
                                    return false;
                                } else {
                                    return true;
                                }
                            }

                            return false;
                        });

                        var oneToManys = self.orm.getOneToManyRelationships(Type) || new BASE.Hashmap();
                        var isOneToMany = oneToManys.getKeys().length === 0 ? false : oneToManys.getKeys().some(function (key) {
                            var relationship = oneToManys.get(key);
                            if ((Type === relationship.Type && (
                                relationship.hasMany === property ||
                                relationship.hasKey === property
                                )) || (Type === relationship.ofType && (
                                relationship.withOne === property ||
                                relationship.withKey === property
                                ))) {
                                return true;
                            }
                            return false;
                        });

                        var manyToManys = self.orm.getManyToManyRelationships(Type) || new BASE.Hashmap();
                        var isManyToMany = manyToManys.getKeys().length === 0 ? false : manyToManys.getKeys().some(function (key) {
                            var relationship = manyToManys.get(key);
                            if ((Type === relationship.Type &&
                                relationship.hasMany === property
                                ) || (Type === relationship.ofType &&
                                relationship.withMany === property)) {
                                return true;
                            }
                            return false;
                        });

                        if (property === "id" || isOneToOne || isOneToMany || isManyToMany) {
                            return;
                        }

                        if (!self.changeTracker.added.hasKey(entity) && !self.changeTracker.removed.hasKey(entity)) {
                            _updatedProperties.add(entity, property, event.newValue);
                            self.changeTracker.updated.add(entity, entity);
                        }

                    };

                    // Add many to many relationships, and apply observers for Ghost ManyToMany mappings
                    var manyToManyMappings = _orm.getManyToManyRelationships(Type) ? _orm.getManyToManyRelationships(Type).getKeys() : [];
                    manyToManyMappings.forEach(function (key) {
                        var relationship = _orm.getManyToManyRelationships(Type).get(key);

                        if (Type == relationship.Type) {
                            var mappingObserver = function (event) {
                                event.newItems.forEach(function (childEntity) {
                                    if (self.changeTracker.removed.hasKey(childEntity)) {
                                        self.changeTracker.removed.remove(childEntity);
                                    } else {
                                        if (!self.changeTracker.loaded.hasKey(childEntity)) {
                                            self.changeTracker.added.add(childEntity, childEntity);
                                        }
                                    }
                                });

                                event.oldItems.forEach(function (childEntity) {
                                    if (self.changeTracker.added.hasKey(childEntity)) {
                                        self.changeTracker.added.remove(childEntity);
                                    } else {
                                        self.changeTracker.removed.add(childEntity, childEntity);
                                    }
                                });
                            };

                            _entityObservers.add(entity, relationship.hasMany + "To" + relationship.withMany, mappingObserver);
                            entity.observe(mappingObserver, relationship.hasMany + "To" + relationship.withMany);
                        }

                        var event = new BASE.ObservableEvent(key);
                        event.newItems = entity[key];
                        event.oldItems = [];
                        event.target = entity;
                        event.property = key;

                        observer(event);
                    });

                    entity.observe(observer);
                    _entityObservers.add(entity, "default", observer);

                    //Check to see if the Type is a ManyToMany Type and just load it if so. 
                    var dataSet = self.getDataSet(Type);
                    if (_orm.isMappingType(Type)) {
                        dataSet.loadEntity(entity);
                    } else {
                        // Add it to the set.
                        dataSet.add(entity);
                    }

                }

            };

            var onEntityUntracked = function (event) {
                var entity = event.entity;
                var Type = entity.constructor;

                if (_entityObservers.hasKey(entity)) {
                    var observer = _entityObservers.remove(entity, "default");
                    entity.unobserve(observer);


                    // Add many to many relationships, and apply observers for Ghost ManyToMany mappings
                    var manyToManyMappings = _orm.getManyToManyRelationships(Type) ? _orm.getManyToManyRelationships(Type).getKeys() : [];
                    manyToManyMappings.forEach(function (key) {
                        var relationship = _orm.getManyToManyRelationships(Type).get(key);

                        if (Type == relationship.Type) {
                            var observer = _entityObservers.remove(entity, relationship.hasMany + "To" + relationship.withMany);
                            entity.unobserve(observer, relationship.hasMany + "To" + relationship.withMany);
                        }
                    });

                }
            };

            var _unobserveEntity = function (entity) {
                var observers = {};
                var entityObservers = _entityObservers.get(entity) || new BASE.Hashmap();
                entityObservers.getKeys().forEach(function (key) {
                    observers[key] = _entityObservers.remove(entity, key);
                    entity.unobserve(observers[key], key);
                });

                return function () {
                    Object.keys(observers).forEach(function (key) {
                        _entityObservers.add(entity, key, observers[key]);
                        entity.observe(observers[key], key);
                    });
                };
            };


            var _makeAndLoadEntity = function (dto) {
                var Type = _service.getTypeForDto(dto);
                var dataSet = self.getDataSet(Type);

                if (dataSet === null) {
                    throw new Error("Cannot find data set for dto:" + JSON.stringify(dto));
                }

                var entity = new Type();
                entity.id = dto.id;

                var loadedEntity = dataSet.checkForEntity(entity);
                var observer = _entityObservers.get(loadedEntity, "default");
                if (observer) {
                    loadedEntity.unobserve(observer);
                }

                Object.keys(dto).forEach(function (key) {
                    if (typeof loadedEntity[key] === "undefined" || key === "constructor") {
                        return;
                    }
                    if (loadedEntity[key] instanceof BASE.ObservableArray) {
                        var relationship = self.orm.getRelationship(Type, key);
                        if (relationship) {
                            loadedEntity[key].load = function (filter) {
                                return new BASE.Future(function (setValue, setError) {
                                    filter = filter || function () { };

                                    var PropertyType;
                                    var property;
                                    var foreignKey;

                                    if (relationship.Type === Type) {
                                        PropertyType = relationship.ofType
                                        property = relationship.hasMany;
                                        foreignKey = relationship.hasKey;
                                    } else {
                                        PropertyType = relationship.Type;
                                        property = relationship.withMany;
                                        foreignKey = relationship.withKey;
                                    }

                                    var queryable = new BASE.query.Queryable(PropertyType).where(filter).and(function (entity) {
                                        return entity[foreignKey].equals(loadedEntity.id);
                                    });

                                    self.loadEntities(PropertyType, queryable).then(function (entities) {
                                        var restore = _unobserveEntity(loadedEntity);

                                        entities.forEach(function (entity) {
                                            var restore = _unobserveEntity(entity);
                                            var index = loadedEntity[key].indexOf(entity);
                                            if (index < 0) {
                                                loadedEntity[key].add(entity);
                                            }
                                            restore();
                                        });

                                        restore();
                                        setValue(entities);

                                    }).ifError(function (err) {
                                        restore();
                                        setError(err);
                                    });
                                });
                            };

                        }
                    } else if (typeof dto[key] === 'object' && dto[key] !== null) {
                        loadedEntity[key] = _makeAndLoadEntity(dto[key]);
                    } else if (typeof dto[key] !== "object" && typeof loadedEntity[key] !== "function") {
                        loadedEntity[key] = dto[key];
                    }
                });
                if (observer) {
                    loadedEntity.observe(observer);
                }
                dataSet.loadEntity(loadedEntity);
                return loadedEntity;
            };

            Object.defineProperties(self, {
                "relationships": {
                    get: function () {
                        return _relationships;
                    },
                    set: function (value) {
                        var oldValue = _relationships;

                        if (_relationships === null) {
                            _relationships = value;
                            _orm = new BASE.data.ObjectRelationManager(value);

                            // This is where we bind to the entity for observing for updates, and deletes.
                            _orm.onEntityTracked(onEntityTracked);

                            // This where we bind to the entity for observing for updates, and deletes.
                            _orm.onEntityUntracked(onEntityUntracked);

                        }
                    }
                },
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

            self.loadEntities = function (Type, queryable) {
                var self = this;
                var dataSet = self.getDataSet(Type);

                return BASE.Future(function (setValue, setError) {
                    self.service.load(Type, queryable).then(function (dtos) {
                        var trackedEntities = [];
                        var forEach = function (x) {
                            var dto = dtos[x];
                            trackedEntities.push(_makeAndLoadEntity(dto));
                            setTimeout(function () {
                                x++;
                                if (x < dtos.length) {
                                    forEach(x);
                                } else {
                                    setValue(trackedEntities);
                                }
                            }, 0);
                        };

                        if (dtos.length > 0) {
                            forEach(0);
                        } else {
                            setValue([]);
                        }
                    }).ifError(setError);
                });
            };

            self.load = function (entity) {
                entity.__dataContext = self;

                self.changeTracker.loaded.add(entity, entity);
                _orm.track(entity);
            };

            self.add = function (entity) {
                entity.__dataContext = self;

                if (self.changeTracker.removed.hasKey(entity)) {
                    self.changeTracker.removed.remove(entity);
                } else {
                    if (!self.changeTracker.loaded.hasKey(entity)) {
                        self.changeTracker.added.add(entity, entity);
                    }
                }

                _orm.track(entity);
            };

            self.remove = function (entity) {
                self.changeTracker.updated.remove(entity);

                if (self.changeTracker.added.hasKey(entity)) {
                    self.changeTracker.added.remove(entity);
                } else {
                    self.changeTracker.removed.add(entity, entity);
                }
            };

            self.save = function (entity, options) {
                var self = this;
                var options = options || {};
                options.success = options.success || function () { };
                options.error = options.error || function () { };

                var Type = entity.constructor;
                var synchronizer = new BASE.Synchronizer();
                var errors = [];
                var responses = [];

                var parents = _orm.dependsOn(entity);
                parents.forEach(function (entity) {
                    synchronizer.add(function (callback) {
                        self.save(entity, {
                            success: function (data) {
                                responses = responses.concat(data)
                                callback();
                            },
                            error: function (e) {
                                errors = errors.concat(e);
                                callback();
                            }
                        });
                    });
                });

                synchronizer.start(function () {
                    if (errors.length > 0) {
                        options.error(errors);
                        return;
                    }

                    var obj = _pendingSave.get(entity) || new BASE.Observable();
                    var onSaved = function (event) {
                        obj.unobserve(onSaved);
                        if (event.error) {
                            options.error(event.response);
                        } else {
                            options.success(event.response);
                        }
                    };

                    obj.observe(onSaved);

                    if (_pendingSave.hasKey(entity)) {
                        return;
                    }

                    if (self.changeTracker.added.hasKey(entity)) {
                        _pendingSave.add(entity, obj);

                        self.changeTracker.added.remove(entity);
                        self.changeTracker.loaded.add(entity, entity);
                        self.service.add(entity).then(function (response) {
                            responses.push(response);
                            entity.id = response.dto.id;
                            var observers = _pendingSave.remove(entity);

                            var event = new BASE.ObservableEvent("saved");
                            event.response = responses;
                            observers.notify(event);
                        }).ifError(function (e) {
                            self.changeTracker.added.add(entity, entity);
                            self.changeTracker.loaded.remove(entity);
                            errors.push(e);

                            var observers = _pendingSave.remove(entity);

                            var event = new BASE.ObservableEvent("saved");
                            event.response = errors;
                            event.error = true;
                            observers.notify(event);
                        });
                    } else if (self.changeTracker.updated.hasKey(entity)) {
                        _pendingSave.add(entity, obj);

                        self.changeTracker.updated.remove(entity);
                        var updates = _updatedProperties.remove(entity);

                        self.service.update(entity, updates).then(function (response) {
                            responses.push(response);

                            var observers = _pendingSave.remove(entity);

                            var event = new BASE.ObservableEvent("saved");
                            event.response = responses;

                            observers.notify(event);
                        }).ifError(function (e) {
                            self.changeTracker.updated.add(entity, entity);
                            _updatedProperties.add(entity, updates);
                            errors.push(e);

                            var observers = _pendingSave.remove(entity);

                            var event = new BASE.ObservableEvent("saved");
                            event.response = errors;
                            event.error = true;
                            observers.notify(event);
                        });
                    } else if (self.changeTracker.removed.hasKey(entity)) {
                        _pendingSave.add(entity, obj);

                        self.changeTracker.removed.remove(entity);
                        self.changeTracker.loaded.remove(entity);

                        var oneToOnes = self.orm.getOneToOneRelationships();
                        var oneToManys = self.orm.getOneToManyRelationships();

                        self.service.remove(entity).then(function (response) {
                            var observers = _pendingSave.remove(entity);
                            // This basically destroys the object.
                            _remove(entity);
                            responses.push(response);

                            var event = new BASE.ObservableEvent("saved");
                            event.response = responses;

                            observers.notify(event);

                        }).ifError(function (e) {
                            self.changeTracker.removed.add(entity, entity);
                            self.changeTracker.loaded.add(entity, entity);
                            errors.push(e);

                            var observers = _pendingSave.remove(entity);

                            var event = new BASE.ObservableEvent("saved");
                            event.response = errors;
                            event.error = true;
                            observers.notify(event);
                        });
                    } else {
                        var event = new BASE.ObservableEvent("saved");
                        event.response = responses;
                        obj.notify(event);
                    }
                });
            };



            self.saveChanges = function () {
                return new BASE.Future(function (setValue, setError) {
                    var synchronizer = new BASE.Synchronizer();
                    var removedSynchronizer = new BASE.Synchronizer();

                    var allEntities = [];
                    var allRemovedEntities = [];
                    var errors = [];
                    var messages = [];

                    self.changeTracker.added.getKeys().forEach(function (key) {
                        allEntities.push(self.changeTracker.added.get(key));
                    });
                    self.changeTracker.updated.getKeys().forEach(function (key) {
                        allEntities.push(self.changeTracker.updated.get(key));
                    });
                    self.changeTracker.removed.getKeys().forEach(function (key) {
                        allRemovedEntities.push(self.changeTracker.removed.get(key));
                    });

                    if (allRemovedEntities.length > 0) {
                        allRemovedEntities.forEach(function (entity) {
                            removedSynchronizer.add(function (callback) {
                                self.save(entity, {
                                    success: function (m) {
                                        messages = messages.concat(m);
                                        callback();
                                    },
                                    error: function (e) {
                                        errors = errors.concat(e);
                                        callback();
                                    }
                                });
                            });
                        });
                    }

                    removedSynchronizer.start(function () {
                        if (errors.length === 0) {
                            allEntities.forEach(function (entity) {
                                synchronizer.add(function (callback) {
                                    self.save(entity, {
                                        success: function (m) {
                                            messages = messages.concat(m);
                                            callback();
                                        },
                                        error: function (e) {
                                            errors = errors.concat(e);
                                            callback();
                                        }
                                    });
                                });
                            });

                            synchronizer.start(function () {
                                if (errors.length === 0) {
                                    setValue(messages);
                                } else {
                                    setError(errors);
                                }
                            });
                        } else {
                            setError(errors);
                        }
                    });
                }).then();
            };

            return self;
        };

        BASE.extend(DataContext, Super);

        return DataContext;

    }(BASE.Observable));
});