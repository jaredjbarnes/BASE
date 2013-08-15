BASE.require([
    "BASE.util.Observable",
    "BASE.collections.Hashmap",
    "BASE.collections.MultiKeyMap",
    "BASE.async.Future",
    "BASE.async.Task",
    "BASE.collections.Hashmap",
    "BASE.util.PropertyChangedEvent",
    "BASE.collections.ObservableArray",
    "BASE.query.Provider",
    "BASE.query.ArrayProvider"
], function () {
    BASE.namespace("BASE.data");

    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Hashmap = BASE.collections.Hashmap;
    var MultiKeyMap = BASE.collections.MultiKeyMap;
    var Provider = BASE.query.Provider;
    var ArrayProvider = BASE.query.ArrayProvider;

    BASE.data.EntityRelationManager = (function (Super) {
        var EntityRelationManager = function (entity) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new EntityRelationManager(entity);
            }

            Super.call(self);

            // We set this value when the dataContext is set through a setter.
            var dataSet = null;

            // Cache of listeners
            var propertyListeners = new Hashmap();

            // Many to Many hash
            // This stores the mapping entity with both entities as keys.
            var mappingEntities = new MultiKeyMap();

            // This builds listeners for each "one to one" properties in the entity, and saves the 
            // listeners in a hash.
            var getListenerForOneToOne = function (property) {
                // Try to get the listener.
                var listener = propertyListeners.get(property);

                // Check to see if the listener doesn't already exist, and make it.
                // Otherwise just serve the listener found in the hash.
                if (!listener) {

                    // Grab the relationship once, and use it in the callback.
                    var relationship = self.dataContext.orm.oneToOne.get(entity.constructor, property);

                    listener = function (event) {
                        var newEntity = event.newValue;
                        var oldEntity = event.oldValue;

                        // Grab the set of the target.
                        var dataSet = _dataContext.getDataSet(relationship.ofType);

                        dataSet.add(newEntity);

                        // The value could be null, so we need to check.
                        if (oldEntity && oldEntity[relationship.withOne] === entity) {
                            oldEntity[relationship.withOne] = null;
                            oldEntity[relationship.withForeignKey] = null;

                            // If the relationship is required remove it from the data set.
                            if (!relationship.optional) {
                                dataSet.remove(oldEntity);
                            }
                        }

                        // The value could be null, so we need to check.
                        if (newEntity) {
                            newEntity[relationship.withOne] = entity;

                            // We need to assign the keys as well, but the source target may not be added yet.
                            if (entity[relationship.hasKey]) {
                                // Just assign the foreignkey equal to the sources key.
                                newEntity[relationship.withForeignKey] = entity[relationship.hasKey];
                            } else {
                                // We need to listen for the source entity to be saved.
                                // Once the source is saved, update the foreign key.
                                var idObserver = function () {
                                    entity.unobserve(idObserver, relationship.hasKey);
                                    // Now assign the foreignkey equal to the sources key.
                                    newEntity[relationship.withForeignKey] = entity[relationship.hasKey];
                                };
                                entity.observe(idObserver, relationship.hasKey);

                                newEntity.observe(function observer() {
                                    newEntity.unobserve(observer, relationship.withOne);
                                    entity.unobserve(idObserver, relationship.hasKey);
                                }, relationship.withOne);
                            }
                        }

                    };

                    // Add the listener to the hash.
                    propertyListeners.add(property, listener);
                }

                return listener;
            };

            // This builds listeners for each "one to many" properties in the entity, and saves the 
            // listeners in a hash.
            var getListenerForOneToMany = function (property) {
                // Try to get the listener.
                var listener = propertyListeners.get(property);

                // Check to see if the listener doesn't already exist, and make it.
                // Otherwise just serve the listener found in the hash.
                if (!listener) {

                    // Grab the relationship once, and use it in the callback.
                    var relationship = self.dataContext.orm.oneToMany.get(entity.constructor, property);
                    var dataSet = _dataContext.getDataSet(relationship.ofType);

                    listener = function (event) {
                        // Remove the ties between the objects.
                        event.oldItems.forEach(function (item) {
                            // We need to check to see if the entity on the target is still the old entity.
                            if (item[relationship.withOne] === entity) {
                                // Remove the reference from the entity.
                                item[relationship.withOne] = null;
                                item[relationship.withForeignKey] = null;

                                // If the relationship is required remove it from the data set.
                                if (!relationship.optional) {
                                    dataSet.remove(item);
                                }
                            }

                            // The value can be set to null, so if the new value is null remove the foreign key as well.
                            if (item[relationship.withOne] === null) {
                                item[relationship.withForeignKey] = null;
                            }
                        });

                        // Add the ties between the object.
                        event.newItems.forEach(function (item) {
                            // Add the reference to the entity.
                            item[relationship.withOne] = entity;

                            // We need to assign the keys as well, but the source target may not be added yet.
                            if (entity[relationship.hasKey]) {
                                // Just assign the foreignkey equal to the sources key.
                                item[relationship.withForeignKey] = entity[relationship.hasKey];
                            } else {
                                // We need to listen for the source entity to be saved.
                                // Once the source is saved, update the foreign key.
                                var idObserver = function () {
                                    entity.unobserve(idObserver, relationship.hasKey);
                                    // Now assign the foreignkey equal to the sources key.
                                    item[relationship.withForeignKey] = entity[relationship.hasKey];
                                };
                                entity.observe(idObserver, relationship.hasKey);

                                item.observe(function observer() {
                                    item.unobserve(observer, relationship.withOne);
                                    entity.unobserve(idObserver, relationship.hasKey);
                                }, relationship.withOne);
                            }

                            // Add the entity
                            dataSet.add(item);
                        });
                    };

                    // Add the listener to the hash.
                    propertyListeners.add(property, listener);
                }

                return listener;
            };

            // This builds listeners for each "many to many" properties in the entity, and also saves 
            // the listeners in a hash.
            var getListenerForManyToMany = function (property) {
                // Try to get the listener.
                var listener = propertyListeners.get(property);

                // Check to see if the listener doesn't already exist, and make it.
                // Otherwise just serve the listener found in the hash.
                if (!listener) {

                    // Grab the relationship once, and use it in the callback.
                    var relationship = self.dataContext.orm.manyToMany.get(entity.constructor, property);

                    listener = function (event) {
                        // Remove the ties between the objects.
                        event.oldItems.forEach(function (item) {
                            // Get the array on the target, so we can work with it.
                            var targetArray = item[relationship.withMany];

                            // Find out if this entity is still part of the target's array.
                            var index = targetArray.indexOf(entity);

                            // If so remove the entity from the target.
                            if (index >= 0) {
                                targetArray.splice(index, 1);
                            }

                            // Find the mapping entity.
                            var mappingEntity = mappingEntities.get(entity, item);

                            // Since this is many to many remove the mapping entity.
                            var mappingDataSet = _dataContext.getDataSet(mappingEntity.constructor);
                            mappingDataSet.remove(mappingEntity);

                        });

                        // Add the ties between the object.
                        event.newItems.forEach(function (target) {
                            // Get the set of this entity and add it to the context.
                            var targetDataSet = _dataContext.getDataSet(target.constructor);
                            targetDataSet.add(target);

                            // Get the array on the target, so we can work with it.
                            var targetArray = target[relationship.withMany];

                            // Make sure that the target has reference to this entity.
                            var index = targetArray.indexOf(entity);

                            // If not so, add the entity to the target array.
                            if (index < 0) {
                                targetArray.push(entity);
                            }

                            // We need to create the mapping type entity.
                            var mappingEntity = mappingEntities.get(entity, target) || new relationship.usingMappingType();

                            // Assign the data context.
                            mappingEntity.changeTracker.dataContext = _dataContext;

                            // Add it to the map for quick access on removal.
                            mappingEntities.add(entity, target, mappingEntity);

                            // This will ensure that we get the mapping entity that has been loaded into the data context.
                            mappingEntity = _dataContext.getDataSet(mappingEntity.constructor).add(mappingEntity);

                            // This should always be up to date.
                            Object.defineProperty(mappingEntity, relationship.withForeignKey, {
                                configurable: true,
                                enumerable: true,
                                get: function () {
                                    return entity.id;
                                },
                                set: function () { }
                            });

                            // This should always be up to date.
                            Object.defineProperty(mappingEntity, relationship.hasForeignKey, {
                                configurable: true,
                                enumerable: true,
                                get: function () {
                                    return target.id;
                                },
                                set: function () { }
                            });

                            // Assign the mapping entity to the entity.
                            var sourceMappingRelationship = relationship.sourceMappingRelationship;
                            mappingEntity[sourceMappingRelationship.withOne] = entity;

                            // Assign the mapping entity to the entity.
                            var targetMappingRelationship = relationship.targetMappingRelationship;
                            mappingEntity[targetMappingRelationship.withOne] = target;

                            // We need to remove the mapping entity from the hash when its been detached.
                            // This is also necessary to avoid memory leaks.
                            entity.changeTracker.observe(function (event) {
                                // If the new value is DETATCHED (0) then remove it from the hash.
                                if (event.newValue === 0) {
                                    // Remove the mapping Entity from the map for quick access on removal.
                                    mappingEntities.remove(entity, target);
                                }
                            }, "state");

                        });
                    };

                    // Add the listener to the hash.
                    propertyListeners.add(property, listener);
                }

                return listener;
            };

            // These next methods are here to help the source entity to be updtated, if this entity is
            // the target.
            var getListenerForOneToOneAsTargets = function (property) {
                // Try to get the listener.
                var listener = propertyListeners.get(property);

                // Check to see if the listener doesn't already exist, and make it.
                // Otherwise just serve the listener found in the hash.
                if (!listener) {

                    // Grab the relationship once, and use it in the callback.
                    var relationship = self.dataContext.orm.oneToOneAsTargets.get(entity.constructor, property);
                    var dataSet = _dataContext.getDataSet(relationship.type);

                    listener = function (event) {
                        var newEntity = event.newValue;
                        var oldEntity = event.oldValue;

                        // The value could be null, so we need to check.
                        if (oldEntity && oldEntity[relationship.hasOne] === entity) {
                            oldEntity[relationship.hasOne] = null;
                        }

                        // The value could be null, so we need to check.
                        if (newEntity) {
                            newEntity[relationship.hasOne] = entity;
                        }

                        dataSet.add(newEntity);

                    };

                    // Add the listener to the hash.
                    propertyListeners.add(property, listener);
                }

                return listener;
            };

            var getListenerForOneToManyAsTargets = function (property) {
                // Try to get the listener.
                var listener = propertyListeners.get(property);

                // Check to see if the listener doesn't already exist, and make it.
                // Otherwise just serve the listener found in the hash.
                if (!listener) {

                    // Grab the relationship once, and use it in the callback.
                    var relationship = self.dataContext.orm.oneToManyAsTargets.get(entity.constructor, property);
                    var dataSet = _dataContext.getDataSet(relationship.type);

                    listener = function (event) {
                        var oldSource = event.oldValue;
                        var newSource = event.newValue;

                        // This old source may be null.
                        if (oldSource) {
                            var oldSourceArray = oldSource[relationship.hasMany];

                            // Need to make sure that this entity is removed from the source.
                            var index = oldSourceArray.indexOf(entity);
                            if (index >= 0) {
                                oldSourceArray.splice(index, 1);
                            }
                        }

                        // This new source may be null.
                        if (newSource) {
                            var newSourceArray = newSource[relationship.hasMany];

                            // Need to make sure that this entity is added to the source.
                            var index = newSourceArray.indexOf(entity);
                            if (index < 0) {
                                newSourceArray.push(entity);
                            }

                            dataSet.add(newSource);
                        }

                    };

                    // Add the listener to the hash.
                    propertyListeners.add(property, listener);
                }

                return listener;
            };

            var getListenerForManyToManyAsTargets = function (property) {
                // Try to get the listener.
                var listener = propertyListeners.get(property);

                // Check to see if the listener doesn't already exist, and make it.
                // Otherwise just serve the listener found in the hash.
                if (!listener) {

                    // Grab the relationship once, and use it in the callback.
                    var relationship = self.dataContext.orm.manyToManyAsTargets.get(entity.constructor, property);

                    listener = function (event) {
                        // Remove the ties between the objects.
                        event.oldItems.forEach(function (item) {
                            // Get the array on the source, so we can work with it.
                            var sourceArray = item[relationship.hasMany];

                            // Find out if this entity is still part of the sources array.
                            var index = sourceArray.indexOf(entity);

                            // If so remove the entity from the source.
                            if (index >= 0) {
                                sourceArray.splice(index, 1);
                            }
                        });

                        // Add the ties between the object.
                        event.newItems.forEach(function (source) {
                            // Get the array on the source, so we can work with it.
                            var sourceArray = source[relationship.hasMany];

                            // Make sure that the source has reference to this entity.
                            var index = sourceArray.indexOf(entity);

                            // If not so, add the entity to the source array.
                            if (index < 0) {
                                sourceArray.push(entity);
                            }

                        });
                    };

                    // Add the listener to the hash.
                    propertyListeners.add(property, listener);
                }

                return listener;
            };

            // Observing as Sources

            // This wires up all "one to one" observing.
            var observeOneToOne = function () {
                // Retrieve all the One to Many relationships from the orm.
                var relationships = self.dataContext.orm.oneToOne.get(entity.constructor) || new Hashmap();

                // Observe the array for changes.
                relationships.getKeys().forEach(function (property) {
                    entity.observe(getListenerForOneToOne(property), property);
                });
            };

            // This unwires up all "one to one" observing.
            var unobserveOneToOne = function () {
                // Retrieve all the One to Many relationships from the orm.
                var relationships = self.dataContext.orm.oneToOne.get(entity.constructor) || new Hashmap();

                // Unobserve from the array.
                relationships.getKeys().forEach(function (property) {
                    entity.unobserve(getListenerForOneToOne(property), property);
                });
            };

            // This wires up all "one to many" observing.
            var observeOneToMany = function () {
                // Retrieve all the One to Many relationships from the orm.
                var relationships = self.dataContext.orm.oneToMany.get(entity.constructor) || new Hashmap();

                // Observe the array for changes.
                relationships.getKeys().forEach(function (property) {
                    entity[property].observe(getListenerForOneToMany(property));
                });
            };

            // This unwires up all "one to many" observing.
            var unobserveOneToMany = function () {
                // Retrieve all the One to Many relationships from the orm.
                var relationships = self.dataContext.orm.oneToMany.get(entity.constructor) || new Hashmap();

                // Unobserve from the array.
                relationships.getKeys().forEach(function (property) {
                    entity[property].unobserve(getListenerForOneToMany(property));
                });
            };

            // This wires up all "many to many" observing.
            var observeManyToMany = function () {
                // Retrieve all the One to Many relationships from the orm.
                var relationships = self.dataContext.orm.manyToMany.get(entity.constructor) || new Hashmap();

                // Observe the array for changes.
                relationships.getKeys().forEach(function (property) {
                    entity[property].observe(getListenerForManyToMany(property));
                });
            };

            // This unwires up all "many to many" observing.
            var unobserveManyToMany = function () {
                // Retrieve all the One to Many relationships from the orm.
                var relationships = self.dataContext.orm.manyToMany.get(entity.constructor) || new Hashmap();

                // Unobserve from the array.
                relationships.getKeys().forEach(function (property) {
                    entity[property].unobserve(getListenerForManyToMany(property));
                });
            };

            // Observing as Targets
            // This wires up all "one to one" observing as targets.
            var observeOneToOneAsTargets = function () {
                // Retrieve all the One to Many relationships from the orm.
                var relationships = self.dataContext.orm.oneToOneAsTargets.get(entity.constructor) || new Hashmap();

                // Observe the array for changes.
                relationships.getKeys().forEach(function (property) {
                    entity.observe(getListenerForOneToOneAsTargets(property), property);
                });
            };

            // This unwires up all "one to one" observing as targets.
            var unobserveOneToOneAsTargets = function () {
                // Retrieve all the One to Many relationships from the orm.
                var relationships = self.dataContext.orm.oneToOneAsTargets.get(entity.constructor) || new Hashmap();

                // Unobserve from the array.
                relationships.getKeys().forEach(function (property) {
                    entity.unobserve(getListenerForOneToOneAsTargets(property), property);
                });
            };

            // This wires up all "one to many" observing as targets.
            var observeOneToManyAsTargets = function () {
                // Retrieve all the One to Many relationships from the orm.
                var relationships = self.dataContext.orm.oneToManyAsTargets.get(entity.constructor) || new Hashmap();

                // Observe the array for changes.
                relationships.getKeys().forEach(function (property) {
                    entity.observe(getListenerForOneToManyAsTargets(property), property);
                });
            };

            // This unwires up all "one to many" observing as targets.
            var unobserveOneToManyAsTargets = function () {
                // Retrieve all the One to Many relationships from the orm.
                var relationships = self.dataContext.orm.oneToManyAsTargets.get(entity.constructor) || new Hashmap();

                // Unobserve from the array.
                relationships.getKeys().forEach(function (property) {
                    entity.unobserve(getListenerForOneToManyAsTargets(property), property);
                });
            };

            // This wires up all "many to many" observing as targets.
            var observeManyToManyAsTargets = function () {
                // Retrieve all the One to Many relationships from the orm.
                var relationships = self.dataContext.orm.manyToManyAsTargets.get(entity.constructor) || new Hashmap();

                // Observe the array for changes.
                relationships.getKeys().forEach(function (property) {
                    entity[property].observe(getListenerForManyToManyAsTargets(property));
                });
            };

            // This unwires up all "many to many" observing as targets.
            var unobserveManyToManyAsTargets = function () {
                // Retrieve all the One to Many relationships from the orm.
                var relationships = self.dataContext.orm.manyToManyAsTargets.get(entity.constructor) || new Hashmap();

                // Unobserve from the array.
                relationships.getKeys().forEach(function (property) {
                    entity[property].unobserve(getListenerForManyToManyAsTargets(property));
                });
            };

            // This wires everything together to manage relationships through observing.
            var manageRelationships = function () {
                observeOneToOne();
                observeOneToMany();
                observeManyToMany();

                observeOneToOneAsTargets();
                observeOneToManyAsTargets();
                observeManyToManyAsTargets();
            };

            // This unwires everything from being managed by relationships through observing.
            var unmanageRelationships = function () {
                unobserveOneToOne();
                unobserveOneToMany();
                unobserveManyToMany();

                unobserveOneToOneAsTargets();
                unobserveOneToManyAsTargets();
                unobserveManyToManyAsTargets();
            };

            // This will save the different providers with the key being the property of the entity.
            var providerFactories = new Hashmap();
            // This will save the different default providers with the key being the property of the entity.
            var defaultproviderFactories = new Hashmap();

            // We need to override the array's providers in the entity, and assign the providers to 
            // use a special provider that asks the service instead of a local array.
            var getOneToManyProviderFactory = function (property) {
                var factory = providerFactories.get(property);

                if (!factory) {
                    var relationship = self.dataContext.orm.oneToMany.get(entity.constructor, property);

                    factory = function () {
                        var provider;
                        // The service provider doesn't need to work until the entity is loaded.
                        if (entity.changeTracker.state === BASE.data.EntityChangeTracker.LOADED) {

                            var provider = _dataContext.service.getTargetProvider(entity, property);
                            var oldExecute = provider.execute;
                            provider.toArray = provider.execute = function (queryable) {
                                return new Future(function (setValue, setError) {

                                    oldExecute.call(provider, queryable).then(function (dtos) {
                                        var resultEntities = [];
                                        dtos.forEach(function (dto) {
                                            var dataSet = _dataContext.getDataSet(relationship.ofType);
                                            var target = dataSet.load(dto);

                                            // Add the target to what we send back to the user that asked.
                                            resultEntities.push(target);

                                            // Add the target to the entity's array.
                                            var index = entity[property].indexOf(target);
                                            if (index === -1) {
                                                entity[property].push(target);
                                            }
                                        });

                                        // This sends back all the targets entities that have now been loaded via "one to many".
                                        setValue(resultEntities);
                                    }).ifError(function (error) {

                                        _dataContext.throwError(error);

                                        setError(error);
                                    });

                                });

                            };
                        } else {
                            // This just grabs the default array provider, until its saved to the database.
                            provider = new ArrayProvider(entity[property]);
                        }

                        return provider;
                    };

                    providerFactories.add(property, factory);
                }

                return factory;
            };

            var getManyToManyProviderFactory = function (property) {
                var factory = providerFactories.get(property);

                if (!factory) {
                    var relationship = self.dataContext.orm.manyToMany.get(entity.constructor, property);

                    factory = function () {
                        var provider;
                        // The service provider doesn't need to work until the entity is loaded.
                        if (entity.changeTracker.state === BASE.data.EntityChangeTracker.LOADED) {
                            var provider = _dataContext.service.getTargetProvider(entity, property);
                            var oldExecute = provider.execute;

                            // We override the execute method to customize our provider.
                            provider.toArray = provider.execute = function (queryable) {



                                //BLah
                                return new Future(function (setValue, setError) {

                                    oldExecute.call(provider, queryable).then(function (dtos) {
                                        var resultEntities = [];
                                        dtos.forEach(function (dto) {
                                            var dataSet = _dataContext.getDataSet(relationship.ofType);
                                            var target = dataSet.load(dto);

                                            // Add the target to what we send back to the user that asked.
                                            resultEntities.push(target);

                                            // All we need to do is to make the mapping entity, change its state
                                            // to LOADED, set it's it, and let the observer take care of the rest.

                                            // We need to create the mapping type entity, or get it from the already loaded hash.
                                            var mappingEntity = mappingEntities.get(entity, target) || new relationship.usingMappingType();

                                            // Assign the data context.
                                            mappingEntity.changeTracker.dataContext = _dataContext;

                                            // Change the state of the mapping entity to LOADED before we add it to the state.
                                            mappingEntity.changeTracker.changeState(BASE.data.EntityChangeTracker.LOADED);

                                            // Assign the id of the mapping entity as a concatenation of both entity's ids.
                                            Object.defineProperty(mappingEntity, "id", {
                                                get: function () {
                                                    return entity.id + "|" + target.id;
                                                },
                                                set: function () { }
                                            });

                                            // Assign the mapping entity to the entity.
                                            var sourceMappingRelationship = relationship.sourceMappingRelationship;
                                            mappingEntity[sourceMappingRelationship.withOne] = entity;

                                            // Assign the mapping entity to the entity.
                                            var targetMappingRelationship = relationship.targetMappingRelationship;
                                            mappingEntity[targetMappingRelationship.withOne] = target;

                                            // Add the mapping to the hash.
                                            mappingEntities.add(entity, target, mappingEntity);

                                            // Add the target to the entity's array.
                                            var index = entity[property].indexOf(target);
                                            if (index === -1) {
                                                entity[property].push(target);
                                            }
                                        });

                                        // This sends back all the targets entities that have now been loaded via "many to many".
                                        setValue(resultEntities);
                                    }).ifError(function (error) {
                                        _dataContext.throwError(error);
                                        setError(error);
                                    });

                                });

                            };

                        } else {
                            // This just grabs the default array provider, until its saved to the database.
                            provider = new ArrayProvider(entity[property]);
                        }

                        return provider;
                    };

                    providerFactories.add(property, factory);
                }

                return factory;
            };

            var getManyToManyAsTargetsProviderFactory = function (property) {
                var factory = providerFactories.get(property);

                if (!factory) {
                    var relationship = self.dataContext.orm.manyToManyAsTargets.get(entity.constructor, property);

                    factory = function () {
                        var provider = _dataContext.service.getTargetProvider(entity, property);
                        var oldExecute = provider.execute;
                        provider.toArray = provider.execute = function (queryable) {
                            return new Future(function (setValue, setError) {

                                oldExecute.call(provider, queryable).then(function (dtos) {
                                    var resultEntities = [];
                                    dtos.forEach(function (dto) {
                                        var dataSet = _dataContext.getDataSet(relationship.type);
                                        var source = dataSet.load(dto);

                                        // Add the source to what we send back to the user that asked.
                                        resultEntities.push(source);
                                        // All we need to do is to make the mapping entity, change its state
                                        // to LOADED, set it's it, and let the observer take care of the rest.

                                        // We need to create the mapping type entity, or get it from the already loaded hash.
                                        var mappingEntity = mappingEntities.get(source, entity) || new relationship.usingMappingType();

                                        // Assign the data context.
                                        mappingEntity.changeTracker.dataContext = _dataContext;

                                        // Change the state of the mapping entity to LOADED before we add it to the state.
                                        mappingEntity.changeTracker.changeState(BASE.data.EntityChangeTracker.LOADED);

                                        // Assign the id of the mapping entity as a concatenation of both entity's ids.
                                        mappingEntity.id = source.id + "|" + entity.id;

                                        // Add the mapping to the hash.
                                        mappingEntities.add(source, entity, mappingEntity);

                                        // Add the source to the entity's array.
                                        var index = entity[property].indexOf(source);
                                        if (index === -1) {
                                            entity[property].push(source);
                                        }

                                    });

                                    // This sends back all the targets entities that have now been loaded via "many to many".
                                    setValue(resultEntities);
                                }).ifError(function (error) {
                                    _dataContext.throwError(error);
                                    setError(error);
                                });

                            });

                        };

                        return provider;
                    };

                    providerFactories.add(property, factory);
                }

                return factory;
            };

            // This assigns the provider factories for all the array relationships.
            var assignProviderFactories = function () {
                var oneToManyRelationships = self.dataContext.orm.oneToMany.get(entity.constructor) || new Hashmap();
                var manyToManyRelationships = self.dataContext.orm.manyToMany.get(entity.constructor) || new Hashmap();
                var manyToManyRelationshipsAsTargets = self.dataContext.orm.manyToManyAsTargets.get(entity.constructor) || new Hashmap();

                oneToManyRelationships.getKeys().forEach(function (key) {
                    var relationship = oneToManyRelationships.get(key);
                    var property = relationship.hasMany;
                    var factory = getOneToManyProviderFactory(property);

                    // In case of the relationship being created by a many to many, 
                    // The property may be undefined. So we need to create a ObservableArray if so.
                    if (typeof entity[property] === "undefined") {
                        entity[property] = new BASE.collections.ObservableArray();
                    }

                    // Get the old Factory, so we can assign it back it the entity is DETATCHED again.
                    var oldFactory = entity[property].providerFactory;
                    defaultproviderFactories.add(property, oldFactory);

                    // Assign the new factory.
                    Object.defineProperty(entity[property], "providerFactory", {
                        configurable: true,
                        enumerable: false,
                        value: factory
                    });
                });

                manyToManyRelationships.getKeys().forEach(function (key) {
                    var relationship = manyToManyRelationships.get(key);
                    var property = relationship.hasMany;
                    var factory = getManyToManyProviderFactory(relationship.hasMany);

                    // Get the old Factory, so we can assign it back it the entity is DETATCHED again.
                    var oldFactory = entity[property].providerFactory;
                    defaultproviderFactories.add(property, oldFactory);

                    // Assign the new factory.
                    Object.defineProperty(entity[property], "providerFactory", {
                        configurable: true,
                        enumerable: false,
                        value: factory
                    });
                });

                manyToManyRelationshipsAsTargets.getKeys().forEach(function (key) {
                    var relationship = manyToManyRelationshipsAsTargets.get(key);
                    var property = relationship.withMany;
                    var factory = getManyToManyAsTargetsProviderFactory(relationship.withMany);

                    // Get the old Factory, so we can assign it back it the entity is DETATCHED again.
                    var oldFactory = entity[property].providerFactory;
                    defaultproviderFactories.add(property, oldFactory);

                    // Assign the new factory.
                    Object.defineProperty(entity[property], "providerFactory", {
                        configurable: true,
                        enumerable: false,
                        value: factory
                    });
                });
            };

            // This unassigns the provider factories for all the array relationships.
            var unassignProviderFactories = function () {
                var oneToManyRelationships = self.dataContext.orm.oneToMany.get(entity.constructor) || new Hashmap();
                var manyToManyRelationships = self.dataContext.orm.manyToMany.get(entity.constructor) || new Hashmap();
                var manyToManyRelationshipsAsTargets = self.dataContext.orm.manyToManyAsTargets.get(entity.constructor) || new Hashmap();

                oneToManyRelationships.getKeys().forEach(function (key) {
                    var relationship = oneToManyRelationships.get(key);
                    var property = relationship.hasMany;
                    var oldFactory = defaultproviderFactories.get(property);

                    // Assign the old factory back.
                    Object.defineProperty(entity[property], "providerFactory", {
                        configurable: true,
                        enumerable: false,
                        value: oldFactory
                    });
                });

                manyToManyRelationships.getKeys().forEach(function (key) {
                    var relationship = manyToManyRelationships.get(key);
                    var property = relationship.hasMany;
                    var oldFactory = defaultproviderFactories.get(property);

                    // Assign the old factory back.
                    Object.defineProperty(entity[property], "providerFactory", {
                        configurable: true,
                        enumerable: false,
                        value: oldFactory
                    });
                });

                manyToManyRelationshipsAsTargets.getKeys().forEach(function (key) {
                    var relationship = manyToManyRelationshipsAsTargets.get(key);
                    var property = relationship.withMany;
                    var oldFactory = defaultproviderFactories.get(property);

                    // Assign the old factory back.
                    Object.defineProperty(entity[property], "providerFactory", {
                        configurable: true,
                        enumerable: false,
                        value: oldFactory
                    });
                });
            };

            var _dataContext = null;
            Object.defineProperties(self, {
                "dataContext": {
                    get: function () {
                        return _dataContext;
                    },
                    set: function (value) {
                        if (value !== _dataContext) {
                            _dataContext = value;

                            // This data context can be set to null, if the entity is DETATCHED.
                            if (value) {
                                dataSet = _dataContext.getDataSet(entity.constructor);
                            }
                        }
                    }
                }
            });

            var _started = false;

            self.start = function () {
                if (!_started) {
                    _started = true;
                    assignProviderFactories();
                    manageRelationships();
                }
            };

            self.stop = function () {
                if (_started) {
                    _started = false;
                    unassignProviderFactories();
                    unmanageRelationships();
                }
            };

            return self;
        };

        BASE.extend(EntityRelationManager, Super);

        return EntityRelationManager;
    }(BASE.util.Observable));
});