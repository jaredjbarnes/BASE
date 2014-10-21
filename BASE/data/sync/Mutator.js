BASE.require([
    "BASE.data.DataContext"
], function () {
    BASE.namespace("BASE.data.sync");

    var LOCAL = "local";
    var REMOTE = "remote";
    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var DataContext = BASE.data.DataContext;

    // The edm is custom edm for the project.
    BASE.data.sync.Mutator = function (syncService, edm) {
        var self = this;
        BASE.assertNotGlobal(self);

        var syncEdm = syncService.getEdm();
        var mappingTypes = edm.getMappingTypes();

        var swapOneToOne = function (entity, from, to) {
            if (typeof entity === "undefined" || typeof to === "undefined" || typeof from === "undefined") {
                throw new Error("There are no optional arguments.");
            }

            var dataContext = new DataContext(syncService);

            return new Future(function (setValue, setError) {
                var relationships = edm.getOneToOneAsTargetRelationships(entity);
                var task = new Task();

                relationships.forEach(function (relationship) {
                    var foreignKey = entity[relationship.withForeignKey];

                    // There may or may not be a foreign key to swap.
                    if (foreignKey !== null && typeof foreignKey !== "undefined") {

                        var sourceModel = edm.getModelByType(relationship.type);
                        var tableName = sourceModel.collectionName;

                        var future = new Future(function (setValue, setError) {
                            dataContext.primaryKeys.where(function (e) {
                                return e.and(e.property("fieldName").isEqualTo(relationship.hasKey),
                            e.property(from).isEqualTo(foreignKey),
                            e.property("tableName").isEqualTo(tableName));
                            }).firstOrDefault().then(function (primaryKey) {
                                //TODO: We need to have a better way to handle this... Maybe be given the local service to add a stub.
                                if (primaryKey) {
                                    entity[relationship.withForeignKey] = primaryKey[to];
                                } else {
                                    entity[relationship.withForeignKey] = null;
                                }

                                setValue();
                            });
                        });

                        task.add(future);

                    }

                });

                task.start().whenAll(setValue);
            });

        };

        var swapOneToMany = function (entity, from, to) {
            if (typeof entity === "undefined" || typeof to === "undefined" || typeof from === "undefined") {
                throw new Error("There are no optional arguments.");
            }

            var dataContext = new DataContext(syncService);

            return new Future(function (setValue, setError) {
                var relationships = edm.getOneToManyAsTargetRelationships(entity);
                var task = new Task();

                relationships.forEach(function (relationship) {
                    var foreignKey = entity[relationship.withForeignKey];

                    if (foreignKey !== null && typeof foreignKey !== "undefined") {

                        var sourceModel = edm.getModelByType(relationship.type);
                        var tableName = sourceModel.collectionName;
                        var future = new Future(function (setValue, setError) {
                            dataContext.primaryKeys.where(function (e) {
                                return e.and(e.property("fieldName").isEqualTo(relationship.hasKey),
                            e.property(from).isEqualTo(foreignKey),
                            e.property("tableName").isEqualTo(tableName));
                            }).firstOrDefault().then(function (primaryKey) {

                                //TODO: We need to have a better way to handle this... Maybe be given the local service to add a stub.
                                if (primaryKey) {
                                    entity[relationship.withForeignKey] = primaryKey[to];
                                } else {
                                    entity[relationship.withForeignKey] = null;
                                }

                                setValue();
                            });
                        });

                        task.add(future);

                    }

                });

                task.start().whenAll(setValue);
            });
        };

        var swapManyToMany = function (entity, from, to) {
            if (typeof entity === "undefined" || typeof to === "undefined" || typeof from === "undefined") {
                throw new Error("There are no optional arguments.");
            }

            var dataContext = new DataContext(syncService);

            var relationships = edm.getManyToManyAsMappingRelationships(entity);
            if (relationships.length > 0) {
                return new Future(function (setValue, setError) {
                    var relationship = relationships[0];

                    var task = new Task();

                    var sourceFuture = new Future(function (setValue, setError) {
                        var foreignKey = entity[relationship.hasForeignKey];
                        var sourceModel = edm.getModelByType(relationship.ofType);
                        var tableName = sourceModel.collectionName;

                        dataContext.primaryKeys.where(function (e) {
                            return e.and(e.property("fieldName").isEqualTo(relationship.hasKey),
                            e.property(from).isEqualTo(foreignKey),
                            e.property("tableName").isEqualTo(tableName));
                        }).firstOrDefault().then(function (primaryKey) {
                            // This happens when the source is already deleted, so we need to look at the 
                            // MappingType for the keys.
                            if (primaryKey !== null) {
                                entity[relationship.hasForeignKey] = primaryKey[to];
                                setValue();
                            } else {
                                sourceModel = edm.getModelByType(relationship.usingMappingType);
                                tableName = sourceModel.collectionName;

                                dataContext.primaryKeys.where(function (e) {
                                    return e.and(e.property("fieldName").isEqualTo(relationship.hasForeignKey),
                                    e.property(from).isEqualTo(foreignKey),
                                    e.property("tableName").isEqualTo(tableName));
                                }).firstOrDefault().then(function (primaryKey) {
                                    entity[relationship.hasForeignKey] = primaryKey[to];
                                    setValue();
                                });
                            }

                        });
                    });

                    var targetFuture = new Future(function (setValue, setError) {
                        var foreignKey = entity[relationship.withForeignKey];
                        var targetModel = edm.getModelByType(relationship.type);
                        var tableName = targetModel.collectionName;

                        dataContext.primaryKeys.where(function (e) {
                            return e.and(e.property("fieldName").isEqualTo(relationship.withKey),
                            e.property(from).isEqualTo(foreignKey),
                            e.property("tableName").isEqualTo(tableName));
                        }).firstOrDefault().then(function (primaryKey) {
                            // This happens when the target is already deleted, so we need to look at the 
                            // MappingType for the keys.
                            if (primaryKey !== null) {
                                entity[relationship.withForeignKey] = primaryKey[to];
                                setValue();
                            } else {
                                sourceModel = edm.getModelByType(relationship.usingMappingType);
                                tableName = sourceModel.collectionName;

                                dataContext.primaryKeys.where(function (e) {
                                    return e.and(e.property("fieldName").isEqualTo(relationship.withForeignKey),
                                    e.property(from).isEqualTo(foreignKey),
                                    e.property("tableName").isEqualTo(tableName));
                                }).firstOrDefault().then(function (primaryKey) {
                                    entity[relationship.withForeignKey] = primaryKey[to];
                                    setValue();
                                });
                            }

                        });
                    });

                    task.add(sourceFuture, targetFuture);

                    task.start().whenAll(setValue);
                });
            }

            return Future.fromResult();
        };

        self.toRemote = function (entity) {
            var Type = entity.constructor;

            return new Future(function (setValue, setError) {
                var task = new Task;

                task.add(swapOneToOne(entity, LOCAL, REMOTE));
                task.add(swapOneToMany(entity, LOCAL, REMOTE));

                if (edm.getMappingTypes().hasKey(Type)) {
                    task.add(swapManyToMany(entity, LOCAL, REMOTE));
                }

                task.start().whenAll(setValue);

            });
        };

        self.toLocal = function (entity) {
            var Type = entity.constructor;

            return new Future(function (setValue, setError) {
                var task = new Task;

                task.add(swapOneToOne(entity, REMOTE, LOCAL));
                task.add(swapOneToMany(entity, REMOTE, LOCAL));

                if (edm.getMappingTypes().hasKey(Type)) {
                    task.add(swapManyToManyKeys(entity, REMOTE, LOCAL));
                }

                task.start().whenAll(setValue);
            });
        };

        var swapPrimaryKeys = function (entity, from, to) {
            return new Future(function (setValue, setError) {
                var Type = entity.constructor;
                var dataContext = new DataContext(syncService);
                var primaryKeys = edm.getPrimaryKeyProperties(entity.constructor);

                var model = edm.getModelByType(Type);
                var tableName = model.collectionName;

                dataContext.primaryKeys.where(function (e) {
                    var args = [];

                    primaryKeys.forEach(function (key) {
                        args.push(e.and(e.property("fieldName").isEqualTo(key), e.property(from).isEqualTo(entity[key])));
                    });

                    args.push(e.property("tableName").isEqualTo(tableName));

                    return e.and.apply(e, args);
                }).toArray(function (primaryKeys) {
                    primaryKeys.forEach(function (primaryKey) {
                        entity[primaryKey["fieldName"]] = primaryKey[to];
                    });

                    setValue();
                });
            });
        };

        self.swapPrimaryKeysToRemote = function (entity) {
            return swapPrimaryKeys(entity, LOCAL, REMOTE);
        };

        self.swapPrimaryKeysToLocal = function (entity) {
            return swapPrimaryKeys(entity, REMOTE, LOCAL);
        };

    };

});