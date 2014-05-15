BASE.require([
    "BASE.util.Observable",
    "BASE.collections.Hashmap",
    "BASE.collections.MultiKeyMap",
    "BASE.async.Future",
    "BASE.async.Task",
    "BASE.collections.Hashmap",
    "BASE.collections.ObservableArray",
    "BASE.behaviors.collections.ObservableArray",
    "BASE.query.Provider",
    "BASE.query.ArrayProvider",
    "BASE.behaviors.Observable"
], function () {
    BASE.namespace("BASE.data");

    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Hashmap = BASE.collections.Hashmap;
    var MultiKeyMap = BASE.collections.MultiKeyMap;
    var Provider = BASE.query.Provider;
    var ArrayProvider = BASE.query.ArrayProvider;
    var ObservableArrayBehavior = BASE.behaviors.collections.ObservableArray;

    var makeSetterName = function (name) {
        return "set" + name.substr(0, 1).toUpperCase() + name.substr(1);
    };

    var makeGetterName = function () {
        return "get" + name.substr(0, 1).toUpperCase() + name.substr(1);
    };

    BASE.data.EntityRelationManager = (function (Super) {
        var EntityRelationManager = function (entity) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new EntityRelationManager(entity);
            }

            Super.call(self);

            // We set this value when the dataContext is set through a setter.
            var dataSet = null;

            //We save all of the observers to the hashmap in order to dispose if necessary.
            var propertyObservers = new Hashmap();

            // Observing as Sources
            // This wires up all "one to one" observing.
            var observeOneToOne = function () {

                var relationships = self.getDataContext().getOrm().getOneToOnes(entity) || new Hashmap();
                // Observe the array for changes.
                relationships.forEach(function (relationship) {
                    var property = relationship.hasOne;
                    var observer = entity.observeProperty(property, function (event) {
                        var newEntity = event.newValue;
                        var oldEntity = event.oldValue;

                        var item = newEntity || oldEntity;

                        // Grab the set of the target.
                        var dataSet;
                        if (item == null) {
                            dataSet = _dataContext.getDataSet(relationship.ofType);
                        } else {
                            if (item instanceof relationship.ofType) {
                                dataSet = _dataContext.getDataSet(item.constructor);
                            } else {
                                throw new Error("Entity type mismatch. " + item.constructor + " is not a " + relationship.ofType);
                            }
                        }


                        dataSet.add(newEntity);

                        // The value could be null, so we need to check.
                        if (oldEntity && oldEntity[relationship.withOne] === entity) {
                            oldEntity[makeSetterName(relationship.withOne)](null);
                            oldEntity[makeSetterName(relationship.withForeignKey)](null);

                            // If the relationship is required remove it from the data set.
                            if (!relationship.optional) {
                                dataSet.remove(oldEntity);
                            }
                        }

                        // The value could be null, so we need to check.
                        if (newEntity) {
                            newEntity[makeSetterName(relationship.withOne)](entity);

                            // The target can have the foreign key on it so we check it.
                            if (relationship.withForeignKey) {
                                // We need to assign the keys as well, but the source target may not be added yet.
                                if (entity[relationship.hasKey]) {
                                    // Just assign the foreignkey equal to the sources key.
                                    newEntity[makeSetterName(relationship.withForeignKey)](entity[relationship.hasKey]);
                                } else {
                                    // We need to listen for the source entity to be saved.
                                    // Once the source is saved, update the foreign key.
                                    var idCallback = function () {
                                        idObserver.dispose();
                                        // Now assign the foreignkey equal to the sources key.
                                        newEntity[makeSetterName(relationship.withForeignKey)](entity[relationship.hasKey]);
                                    };
                                    var idObserver = entity.observeProperty(relationship.hasKey, idCallback);

                                    var observer = newEntity.observeProperty(relationship.withOne, function () {
                                        observer.dispose();
                                        // Only un-observe if the entity has already been saved
                                        if (entity.id !== null) {
                                            idObserver.dispose();
                                        }
                                    });
                                }
                            }
                        }

                    });
                    propertyObservers.add(property, observer);
                });
            };

            // This unwires up all "one to one" observing.
            var unobserveOneToOne = function () {
                var relationships = self.getDataContext().getOrm().getOneToOnes(entity) || new Hashmap();
                // Unobserve from the array.
                relationships.forEach(function (relationship) {
                    var property = relationship.hasOne;
                    var observer = propertyObservers.remove(property);
                    if (observer) {
                        observer.dispose();
                    }
                });
            };

            // This wires up all "one to many" observing.
            var observeOneToMany = function () {

                var relationships = self.getDataContext().getOrm().getOneToManys(entity) || new Hashmap();
                // Observe the array for changes.
                relationships.forEach(function (relationship) {
                    var property = relationship.hasMany;

                    if (!Array.isArray(entity[property])) {
                        entity[property] = [];
                    }

                    ObservableArrayBehavior.call(entity[property], relationship.ofType);
                    var observer = entity[property].observe(function (event) {
                        // Remove the ties between the objects.
                        event.oldItems.forEach(function (item) {

                            var dataSet;
                            if (item == null) {
                                dataSet = _dataContext.getDataSet(relationship.ofType);
                            } else {
                                if (item instanceof relationship.ofType) {
                                    dataSet = _dataContext.getDataSet(item.constructor);
                                } else {
                                    throw new Error("Entity type mismatch. " + item.constructor + " is not a " + relationship.ofType);
                                }
                            }

                            var dataSet = _dataContext.getDataSet(item.constructor);

                            // We need to check to see if the entity on the target is still the old entity.
                            if (item[relationship.withOne] === entity) {
                                // Remove the reference from the entity.
                                item[makeSetterName(relationship.withOne)](null);
                                item[makeSetterName(relationship.withForeignKey)](null);

                                // If the relationship is required remove it from the data set.
                                if (!relationship.optional) {
                                    dataSet.remove(item);
                                }
                            }

                            // The value can be set to null, so if the new value is null remove the foreign key as well.
                            if (item[relationship.withOne] === null) {
                                item[makeSetterName(relationship.withForeignKey)](null);
                            }
                        });

                        // Add the ties between the object.
                        event.newItems.forEach(function (item) {

                            var dataSet;
                            if (item == null) {
                                dataSet = _dataContext.getDataSet(relationship.ofType);
                            } else {
                                if (item instanceof relationship.ofType) {
                                    dataSet = _dataContext.getDataSet(item.constructor);
                                } else {
                                    throw new Error("Entity type mismatch. " + item.constructor + " is not a " + relationship.ofType);
                                }
                            }

                            // Add the reference to the entity.
                            item[makeSetterName(relationship.withOne)](entity);

                            // We need to assign the keys as well, but the source target may not be added yet.
                            if (entity[relationship.hasKey]) {
                                // Just assign the foreignkey equal to the sources key.
                                item[makeSetterName(relationship.withForeignKey)](entity[relationship.hasKey]);
                            } else {
                                // We need to listen for the source entity to be saved.
                                // Once the source is saved, update the foreign key.
                                var idCallback = function () {
                                    idObserver.dispose();
                                    // Now assign the foreignkey equal to the sources key.
                                    item[makeSetterName(relationship.withForeignKey)](entity[relationship.hasKey]);
                                };

                                var idObserver = entity.observeProperty(relationship.hasKey, idCallback);

                                var observer = item.observeProperty(relationship.withOne, function observer() {
                                    observer.dispose();
                                    // Only un-observe if the entity has already been saved
                                    if (entity.id !== null) {
                                        idObserver.dispose();
                                    }
                                });
                            }

                            // Add the entity
                            dataSet.add(item);
                        });
                    });
                    propertyObservers.add(property, observer);
                });

            };

            // This unwires up all "one to many" observing.
            var unobserveOneToMany = function () {

                var relationships = self.getDataContext().getOrm().getOneToManys(entity) || new Hashmap();
                // Unobserve from the array.
                relationships.forEach(function (relationship) {
                    var property = relationship.hasMany;
                    var observer = propertyObservers.remove(property);
                    if (observer) {
                        observer.dispose();
                    }
                });

            };

            // This wires up all "many to many" observing.
            var observeManyToMany = function () {

                var relationships = self.getDataContext().getOrm().getManyToManys(entity) || new Hashmap();
                // Observe the array for changes.
                relationships.forEach(function (relationship) {
                    var property = relationship.hasMany;

                    if (!Array.isArray(entity[property])) {
                        entity[property] = [];
                    }

                    ObservableArrayBehavior.call(entity[property], relationship.ofType);
                    var observer = entity[property].observe(function (event) {
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
                            var mappingEntity = entity.getChangeTracker().getDataContext().mappingEntities.get(entity, item);

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
                            var mappingEntity = entity.getChangeTracker().getDataContext().mappingEntities.get(entity, target)
                            var sourceMappingRelationship = relationship.sourceMappingRelationship;
                            var targetMappingRelationship = relationship.targetMappingRelationship;

                            if (!mappingEntity) {

                                // We need to make sure that the mapping entities use these properties.
                                mappingEntity = new relationship.usingMappingType();
                                mappingEntity[relationship.withForeignKey] = null;
                                mappingEntity[relationship.hasForeignKey] = null;
                                mappingEntity[sourceMappingRelationship.withOne] = null;
                                mappingEntity[targetMappingRelationship.withOne] = null;

                                BASE.behaviors.data.Entity.call(mappingEntity);
                            }

                            // Assign the data context.
                            mappingEntity.getChangeTracker().setDataContext(_dataContext);

                            // Add it to the map for quick access on removal.
                            entity.getChangeTracker().getDataContext().mappingEntities.add(entity, target, mappingEntity);

                            // This will ensure that we get the mapping entity that has been loaded into the data context.
                            mappingEntity = _dataContext.getDataSet(mappingEntity.constructor).add(mappingEntity);

                            mappingEntity.id = entity.id + "|" + target.id;

                            // This should always be up to date.
                            mappingEntity[relationship.withForeignKey] = entity.id;

                            // This should always be up to date.
                            mappingEntity[relationship.hasForeignKey] = target.id;

                            // Assign the mapping entity to the entity.
                            mappingEntity[sourceMappingRelationship.withOne] = entity;

                            // Assign the mapping entity to the entity.
                            mappingEntity[targetMappingRelationship.withOne] = target;

                            // We need to remove the mapping entity from the hash when its been detached.
                            // This is also necessary to avoid memory leaks.
                            entity.getChangeTracker().observeType("state", function (event) {
                                // If the new value is DETATCHED (0) then remove it from the hash.
                                if (event.newValue === 0) {
                                    // Remove the mapping Entity from the map for quick access on removal.
                                    entity.getChangeTracker().getDataContext().mappingEntities.remove(entity, target);
                                }
                            });

                        });
                    });
                    propertyObservers.add(property, observer);
                });

            };

            // This unwires up all "many to many" observing.
            var unobserveManyToMany = function () {

                var relationships = self.getDataContext().getOrm().getManyToManys(entity) || new Hashmap();
                // Unobserve from the array.
                relationships.forEach(function (relationship) {
                    var property = relationship.hasMany;
                    var observer = propertyObservers.remove(property);
                    if (observer) {
                        observer.dispose();
                    }
                });

            };

            // Observing as Targets
            // This wires up all "one to one" observing as targets.
            var observeOneToOneAsTargets = function () {

                var relationships = self.getDataContext().getOrm().getOneToOneAsTargets(entity) || new Hashmap();
                // Observe the array for changes.
                relationships.forEach(function (relationship) {
                    var property = relationship.withOne;
                    var observer = entity.observeProperty(property, function (event) {
                        var newEntity = event.newValue;
                        var oldEntity = event.oldValue;

                        var item = newEntity || oldEntity;

                        // Grab the set of the target.
                        var dataSet;
                        if (item == null) {
                            dataSet = _dataContext.getDataSet(relationship.type);
                        } else {
                            if (item instanceof relationship.type) {
                                dataSet = _dataContext.getDataSet(item.constructor);
                            } else {
                                throw new Error("Entity type mismatch. " + item.constructor + " is not a " + relationship.type);
                            }
                        }

                        dataSet.add(newEntity);

                        // The value could be null, so we need to check.
                        if (oldEntity && oldEntity[relationship.hasOne] === entity) {
                            oldEntity[makeSetterName(relationship.hasOne)](null);
                        }

                        // The value could be null, so we need to check.
                        if (newEntity) {
                            newEntity[makeSetterName(relationship.hasOne)](entity);

                            // The source can have the foreign key on it so we check it.
                            if (relationship.hasForeignKey) {
                                // We need to assign the keys as well, but the target target may not be added yet.
                                if (entity[relationship.withKey]) {
                                    // Just assign the foreignkey equal to the targets key.
                                    newEntity[makeSetterName(relationship.hasForeignKey)](entity[relationship.withKey]);
                                } else {
                                    // We need to listen for the source entity to be saved.
                                    // Once the source is saved, update the foreign key.
                                    var idCallback = function () {
                                        idObserver.dispose();
                                        // Now assign the foreignkey equal to the sources key.
                                        newEntity[makeSetterName(relationship.withHasKey)](entity[relationship.withKey]);
                                    };
                                    var idObserver = entity.observeProperty(relationship.withKey, idCallback);

                                    var observer = newEntity.observeProperty(relationship.hasOne, function () {
                                        observer.dispose();
                                        // Only un-observe if the entity has already been saved
                                        if (entity.id !== null) {
                                            idObserver.dispose();
                                        }
                                    });
                                }
                            }

                        }

                    });

                    propertyObservers.add(property, observer);
                });

            };

            // This unwires up all "one to one" observing as targets.
            var unobserveOneToOneAsTargets = function () {

                var relationships = self.getDataContext().getOrm().getOneToOneAsTargets(entity) || new Hashmap();
                // Unobserve from the array.
                relationships.forEach(function (relationship) {
                    var property = relationship.withOne;
                    var observer = propertyObservers.remove(property);
                    if (observer) {
                        observer.dispose();
                    }
                });

            };

            // This wires up all "one to many" observing as targets.
            var observeOneToManyAsTargets = function () {

                var relationships = self.getDataContext().getOrm().getOneToManyAsTargets(entity) || new Hashmap();
                // Observe the array for changes.
                relationships.forEach(function (relationship) {
                    var property = relationship.withOne;
                    var observer = entity.observeProperty(property, function (event) {
                        var oldSource = event.oldValue;
                        var newSource = event.newValue;

                        var newDataSet;
                        if (event.newValue == null) {
                            newDataSet = _dataContext.getDataSet(relationship.type);
                        } else {
                            if (event.newValue instanceof relationship.type) {
                                newDataSet = _dataContext.getDataSet(event.newValue.constructor);
                            } else {
                                throw new Error("Entity type mismatch. " + event.newValue.constructor + " is not a " + relationship.type);
                            }
                        }


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

                            newDataSet.add(newSource);
                        }

                    });
                    propertyObservers.add(property, observer);
                });

            };

            // This unwires up all "one to many" observing as targets.
            var unobserveOneToManyAsTargets = function () {

                var relationships = self.getDataContext().getOrm().getOneToManyAsTargets(entity) || new Hashmap();
                // Unobserve from the array.
                relationships.forEach(function (relationship) {
                    var property = relationship.withOne;
                    var observer = propertyObservers.remove(property);
                    if (observer) {
                        observer.dispose();
                    }
                });

            };

            // This wires up all "many to many" observing as targets.
            var observeManyToManyAsTargets = function () {

                var relationships = self.getDataContext().getOrm().getManyToManyAsTargets(entity) || new Hashmap();
                // Observe the array for changes.
                relationships.forEach(function (relationship) {
                    var property = relationship.withMany;

                    if (!Array.isArray(entity[property])) {
                        entity[property] = [];
                    }

                    ObservableArrayBehavior.call(entity[property], relationship.type);

                    var observer = entity[property].observe(function (event) {
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
                    });
                    propertyObservers.add(property, observer);
                });

            };

            // This unwires up all "many to many" observing as targets.
            var unobserveManyToManyAsTargets = function () {

                var relationships = self.getDataContext().getOrm().getManyToManyAsTargets(entity) || new Hashmap();
                // Unobserve from the array.
                relationships.forEach(function (relationship) {
                    var property = relationship.withMany;
                    var observer = propertyObservers.remove(property);

                    if (observer) {
                        observer.dispose();
                    }
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
                    var relationship = self.getDataContext().getOrm().getOneToManys(entity).filter(function (r) {
                        return r.hasMany === property
                    })[0];

                    factory = function () {
                        var provider;
                        // The service provider doesn't need to work until the entity is loaded.
                        if (entity.getChangeTracker().getState() === BASE.data.EntityChangeTracker.LOADED) {

                            var provider = _dataContext.getService().getTargetProvider(entity, property);
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
                    var relationship = self.getDataContext().getOrm().getManyToManys(entity).filter(function (r) {
                        return r.hasMany === property
                    })[0];

                    factory = function () {
                        var provider;
                        // The service provider doesn't need to work until the entity is loaded.
                        if (entity.getChangeTracker().getState() === BASE.data.EntityChangeTracker.LOADED) {
                            var provider = _dataContext.getService().getTargetProvider(entity, property);
                            var oldExecute = provider.execute;

                            // We override the execute method to customize our provider.
                            provider.toArray = provider.execute = function (queryable) {

                                //Blah
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
                                            var mappingEntity = entity.getChangeTracker().getDataContext().mappingEntities.get(entity, target);
                                            var sourceMappingRelationship = relationship.sourceMappingRelationship;
                                            var targetMappingRelationship = relationship.targetMappingRelationship;

                                            if (!mappingEntity) {
                                                mappingEntity = new relationship.usingMappingType();
                                                BASE.behaviors.data.Entity.call(mappingEntity);
                                            }

                                            // Assign the data context.
                                            mappingEntity.getChangeTracker().setDataContext(_dataContext);

                                            // Change the state of the mapping entity to LOADED before we add it to the state.
                                            mappingEntity.getChangeTracker().changeState(BASE.data.EntityChangeTracker.LOADED);

                                            mappingEntity.id = entity.id + "|" + target.id;

                                            // This should always be up to date.
                                            mappingEntity[relationship.withForeignKey] = entity.id;

                                            // This should always be up to date.
                                            mappingEntity[relationship.hasForeignKey] = target.id;

                                            // Assign the mapping entity to the entity.
                                            mappingEntity[sourceMappingRelationship.withOne] = entity;

                                            // Assign the mapping entity to the entity.
                                            mappingEntity[targetMappingRelationship.withOne] = target;

                                            // Add the mapping to the hash.
                                            entity.getChangeTracker().getDataContext().mappingEntities.add(entity, target, mappingEntity);

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
                    var relationship = self.getDataContext().getOrm().getManyToManyAsTargets(entity).filter(function (r) {
                        return r.withMany === property;
                    })[0];

                    factory = function () {
                        var provider = _dataContext.getService().getTargetProvider(entity, property);
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
                                        var mappingEntity = entity.getChangeTracker().getDataContext().mappingEntities.get(source, entity);
                                        var sourceMappingRelationship = relationship.sourceMappingRelationship;
                                        var targetMappingRelationship = relationship.targetMappingRelationship;

                                        if (!mappingEntity) {
                                            mappingEntity = new relationship.usingMappingType();
                                            BASE.behaviors.data.Entity.call(mappingEntity);
                                        }

                                        mappingEntity.id = entity.id + "|" + target.id;

                                        // This should always be up to date.
                                        mappingEntity[relationship.withForeignKey] = entity.id;

                                        // This should always be up to date.
                                        mappingEntity[relationship.hasForeignKey] = target.id;

                                        // Assign the mapping entity to the entity.
                                        mappingEntity[sourceMappingRelationship.withOne] = entity;

                                        // Assign the mapping entity to the entity.
                                        mappingEntity[targetMappingRelationship.withOne] = target;

                                        // Add the mapping to the hash.
                                        entity.getChangeTracker().getDataContext().mappingEntities.add(source, entity, mappingEntity);

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

            var assignOneToManyProviderFactories = function () {
                var relationships = self.getDataContext().getOrm().getOneToManys(entity) || new Hashmap();
                relationships.forEach(function (relationship) {
                    var property = relationship.hasMany;
                    var factory = getOneToManyProviderFactory(property);

                    // In case of the relationship being created by a many to many, 
                    // The property may be undefined. So we need to create a ObservableArray if so.
                    if (typeof entity[property] === "undefined") {
                        entity[property] = [];
                    }

                    // Get the old Factory, so we can assign it back it the entity is DETATCHED again.
                    var oldFactory = entity[property].getProviderFactory;
                    defaultproviderFactories.add(property, oldFactory);

                    // Assign the new factory.
                    entity[property].getProviderFactory = factory;
                });
            };

            var unassignOneToManyProviderFactories = function () {
                var relationships = self.getDataContext().getOrm().getOneToManys(entity) || new Hashmap();
                relationships.forEach(function (relationship) {
                    var property = relationship.hasMany;
                    var oldFactory = defaultproviderFactories.get(property);

                    // Assign the old factory back.
                    entity[property].getProviderFactory = oldFactory;
                });
            };

            var assignManyToManyProviderFactories = function () {
                var relationships = self.getDataContext().getOrm().getManyToManys(entity) || new Hashmap();
                relationships.forEach(function (relationship) {
                    var property = relationship.hasMany;
                    var factory = getManyToManyProviderFactory(relationship.hasMany);

                    // Get the old Factory, so we can assign it back it the entity is DETATCHED again.
                    var oldFactory = entity[property].getProviderFactory;
                    defaultproviderFactories.add(property, oldFactory);

                    // Assign the new factory.
                    entity[property].getProviderFactory = factory;
                });
            };

            var unassignManyToManyProviderFactories = function () {
                var relationships = self.getDataContext().getOrm().getManyToManys(entity) || new Hashmap();
                relationships.forEach(function (relationship) {
                    var property = relationship.hasMany;
                    var oldFactory = defaultproviderFactories.get(property);

                    // Assign the old factory back.
                    entity[property].getProviderFactory = oldFactory;
                });
            };

            var assignManyToManyAsTargetsProviderFactories = function () {
                var relationships = self.getDataContext().getOrm().getManyToManyAsTargets(entity) || new Hashmap();
                relationships.forEach(function (relationship) {
                    var property = relationship.withMany;
                    var factory = getManyToManyAsTargetsProviderFactory(relationship.withMany);

                    // Get the old Factory, so we can assign it back it the entity is DETATCHED again.
                    var oldFactory = entity[property].getProviderFactory;
                    defaultproviderFactories.add(property, oldFactory);

                    // Assign the new factory.
                    entity[property].getProviderFactory = factory;
                });
            };

            var unassignManyToManyAsTargetsProviderFactories = function () {
                var relationships = self.getDataContext().getOrm().getManyToManyAsTargets(entity) || new Hashmap();
                relationships.forEach(function (relationship) {
                    var property = relationship.withMany;
                    var oldFactory = defaultproviderFactories.get(property);

                    // Assign the old factory back.
                    entity[property].getProviderFactory = oldFactory;
                });
            };

            // This assigns the provider factories for all the array relationships.
            var assignProviderFactories = function () {
                assignOneToManyProviderFactories();
                assignManyToManyProviderFactories();
                assignManyToManyAsTargetsProviderFactories();
            };

            // This unassigns the provider factories for all the array relationships.
            var unassignProviderFactories = function () {
                unassignOneToManyProviderFactories();
                unassignManyToManyProviderFactories();
                unassignManyToManyAsTargetsProviderFactories();
            };

            var _dataContext = null;
            self.getDataContext = function () {
                return _dataContext;
            };
            self.setDataContext = function (value) {
                if (value !== _dataContext) {
                    _dataContext = value;

                    // This data context can be set to null, if the entity is DETATCHED.
                    if (value) {
                        dataSet = _dataContext.getDataSet(entity.constructor);
                    }
                }
            };

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