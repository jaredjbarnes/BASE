BASE.require([
    "BASE.query.Queryable",
    "BASE.query.Provider",
    "BASE.query.IndexedDbVisitor",
    "BASE.data.utils",
    "Array.convertToArray",
    "BASE.data.responses.AddedResponse",
    "BASE.data.responses.UpdatedResponse",
    "BASE.data.responses.RemovedResponse",
    "BASE.data.responses.ErrorResponse"
], function () {

    var Future = BASE.async.Future;
    var Queryable = BASE.query.Queryable;
    var Provider = BASE.query.Provider;
    var IndexedDbVisitor = BASE.query.IndexedDbVisitor;
    var flattenEntity = BASE.data.utils.flattenEntity;
    var convertEntity = BASE.data.utils.convertDtoToJavascriptEntity;

    var AddedResponse = BASE.data.responses.AddedResponse;
    var UpdatedResponse = BASE.data.responses.UpdatedResponse;
    var RemovedResponse = BASE.data.responses.RemovedResponse;
    var ErrorResponse = BASE.data.responses.ErrorResponse;

    BASE.namespace("BASE.data.dataStores");

    BASE.data.dataStores.IndexedDbDataStore = function (Type, edm) {
        var self = this;

        var db = null;
        var model = edm.getModelByType(Type);
        var properties = model.properties;
        var primaryKeys = edm.getPrimaryKeyProperties(Type);
        var indexes = edm.getAllKeyProperties(Type);
        var mappingTypes = edm.getMappingTypes();
        var collectionName = model.collectionName;

        var primaryKeyHash = primaryKeys.reduce(function (hash, key) {
            hash[key] = key;
            return hash;
        }, {});

        var indexHash = indexes.reduce(function (hash, key) {
            hash[key] = key;
            return hash;
        }, {});

        var primaryKeyColumn = primaryKeys.join("_");

        var createStore = function (db) {
            return new Future(function (setValue, setError) {
                var config = {};

                if (primaryKeys.length === 1) {
                    if (properties[primaryKeys[0]].autoIncrement) {
                        config.autoIncrement = true;
                    }
                    config.keyPath = primaryKeys[0];
                } else {
                    var keyPath = primaryKeyColumn;
                    config.keyPath = keyPath;
                }

                var objectStore = db.createObjectStore(model.collectionName, config);

                indexes.forEach(function (key) {
                    if (!primaryKeyHash[key]) {
                        objectStore.createIndex(key, key, { unique: false });
                    }
                });

                objectStore.transaction.oncomplete = function (event) {
                    setValue();
                };

            });
        };

        var walkExpression = function (expression, action) {
            if (expression && expression.children) {
                expression.children.forEach(function (childExpression) {
                    walkExpression(childExpression, action);
                });
            }

            action(expression);
        };

        var isAFilterByIndex = function (expression) {
            var allProperties = [];
            walkExpression(expression, function (expression) {
                if (expression.nodeName === "property") {
                    allProperties.push(expression.value);
                }
            });


            return allProperties.length === 1 && indexHash[allProperties[0]];

        };

        var isAPrimaryKeyFilter = function (expression) {
            var allProperties = [];
            walkExpression(expression, function (expression) {
                if (expression.nodeName === "property") {
                    allProperties.push(expression.value);
                }
            });


            return allProperties.length > 0 && allProperties.every(function (key) {
                return primaryKeyHash[key] ? true : false;
            });
        };

        var getIndexKeyAndValue = function (expression) {
            var value = {};
            walkExpression(expression, function (expression) {
                if (expression.nodeName === "isEqualTo") {
                    value.value = expression.children[1].value;
                    value.key = expression.children[0].value;
                }
            });


            return value;

        };

        var getPrimaryKey = function (obj) {
            var keyValue;

            if (primaryKeys.length === 1) {
                keyValue = obj[primaryKeys[0]];
            } else {
                keyValue = primaryKeys.map(function (key) {
                    return obj[key];
                }).join("_");
            }

            return keyValue;
        };

        var getPrimaryKeyValue = function (expression) {

            var values = {};
            walkExpression(expression, function (expression) {
                if (expression.nodeName === "isEqualTo") {
                    values[expression.children[0].value] = expression.children[1].value;
                }
            });

            return getPrimaryKey(values);

        };

        var getPrimaryKeyByEntity = getPrimaryKey;

        self.add = function (entity) {
            return new Future(function (setValue, setError) {
                var objectStore = db.transaction([collectionName], "readwrite").objectStore(collectionName);
                var storedEntity = flattenEntity(entity);

                if (primaryKeys.length > 1) {
                    // If the key is multi column then we expect the keys to be there.
                    var primaryKeyValue = getPrimaryKeyByEntity(entity);
                    storedEntity[primaryKeyColumn] = primaryKeyColumn;
                } else {
                    // This is because of we auto increment if we only have one key.
                    delete storedEntity[primaryKeys[0]];
                }

                var request = objectStore.add(storedEntity);
                request.onsuccess = function (event) {

                    if (primaryKeys.length === 1) {
                        var keyValue = event.target.result;
                        storedEntity[primaryKeys[0]] = keyValue;
                    }

                    setValue(new AddedResponse("Successfully updated the entity.", storedEntity));

                };

                request.onerror = function (event) {
                    setError(new ErrorResponse("Failed to save Entity."));
                };
            }).then();
        };

        self.update = function (entity, updates) {
            return new Future(function (setValue, setError) {
                var objectStore = db.transaction([collectionName], "readwrite").objectStore(collectionName);
                var updatedEntity = flattenEntity(entity);
                var key = getPrimaryKey(updatedEntity);

                if (primaryKeys.length > 1) {
                    updatedEntity[primaryKeyColumn] = key;
                }

                if (key === null) {
                    throw new Error("Cannot save an entity that doesn't have an key.");
                }

                Object.keys(updates).forEach(function (key) {
                    updatedEntity[key] = updates[key];
                });

                var updateRequest = objectStore.put(updatedEntity);

                updateRequest.onsuccess = function (event) {
                    setValue(new UpdatedResponse("Successfully updated the entity."));
                };

                updateRequest.onerror = function () {
                    setError(new ErrorResponse("Failed to save."));
                };

            }).then();
        };

        self.remove = function (entity) {
            return new Future(function (setValue, setError) {
                var objectStore = db.transaction([collectionName], "readwrite").objectStore(collectionName);
                var key = getPrimaryKey(entity);
                var request = objectStore.delete(key);

                request.onsuccess = function (event) {
                    setValue(new RemovedResponse("Successfully removed the entity."));
                };

                request.onerror = function (event) {
                    setError(new ErrorResponse("Failed to save Entity."));
                };
            }).then();
        };

        self.asQueryable = function () {
            var queryable = new Queryable();
            queryable.provider = self.getQueryProvider();
            return queryable;
        };

        self.getQueryProvider = function () {
            var provider = new Provider();
            provider.toArray = provider.execute = function (queryable) {
                return new Future(function (setValue, setError) {
                    var expression = queryable.getExpression();

                    // This checks to see if the entity has multiple columns for a primary key.
                    // We have to do a hack for IE, because it doesn't support multi-column key lookups.
                    if (isAPrimaryKeyFilter(expression)) {
                        var primaryKey = getPrimaryKeyValue(expression);
                        var objectStore = db.transaction(collectionName).objectStore(collectionName);
                        var index = objectStore.get(primaryKeyColumn);
                        var request = index.get(primaryKey);

                        request.onsuccess = function (event) {
                            setValue([request.result]);
                        };

                        request.onerror = function (event) {
                            setError(event);
                        };

                    } else {

                        // This is an optimization.
                        if (isAFilterByIndex(expression)) {
                            var indexKeyValue = getIndexKeyAndValue(expression);
                            var objectStore = db.transaction(collectionName).objectStore(collectionName);
                            var index = objectStore.get(indexKeyValue.key);
                            var request = index.get(indexKeyValue.value);

                            request.onsuccess = function (event) {
                                setValue([request.result]);
                            };

                            request.onerror = function (event) {
                                setError(event);
                            };

                        } else {

                            // For other queries we need to use the cursor.
                            var objectStore = db.transaction(collectionName).objectStore(collectionName);
                            var request = objectStore.openCursor();
                            var visitor = new IndexedDbVisitor();
                            var expression = queryable.getExpression();
                            var results = [];
                            var skip = 0;
                            var filter = function () { return true; };
                            var sort;
                            var take;

                            if (expression.where) {
                                filter = visitor.parse(expression.where);
                            }

                            if (expression.orderBy) {
                                sort = visitor.parse(expression.orderBy);
                            }

                            if (expression.take) {
                                take = expression.take.children[0].value;
                            }

                            if (expression.skip) {
                                skip = expression.skip.children[0].value;
                            }

                            request.onsuccess = function (event) {
                                var cursor = event.target.result;

                                if (cursor) {

                                    if (filter(cursor.value)) {
                                        results.push(cursor.value);
                                    }

                                    cursor.continue();
                                } else {

                                    if (sort) {
                                        results = results.sort();
                                    }

                                    if (take === null) {
                                        take = undefined;
                                    } else {
                                        take = skip + take;
                                    }

                                    results = results.slice(skip, take);

                                    setValue(results.map(function (item) {
                                        return convertEntity(Type, item);
                                    }));

                                }
                            };

                            request.onerror = function (event) {
                                setError(event);
                            };

                        }
                    }
                });
            };

            return provider;
        };

        self.setDatabase = function (database) {
            db = database;
        };

        self.initialize = function (db) {
            var collectionNames = Array.convertToArray(db.objectStoreNames);

            if (collectionNames.indexOf(collectionName) >= 0) {
                return Future.fromResult();
            } else {
                return createStore(db);
            }
        };

        self.dispose = function () {
            // Return a Future.
            throw new Error("This method is expected to be overridden.");
        };

    };

});