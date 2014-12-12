BASE.require([
    "BASE.query.Queryable",
    "BASE.query.Provider",
    "BASE.query.SqlVisitor",
    "BASE.util.Guid",
    "BASE.collections.Hashmap",
    "BASE.async.Future.prototype.toContinuation",
    "BASE.data.Edm",
    "BASE.data.responses.AddedResponse",
    "BASE.data.responses.UpdatedResponse",
    "BASE.data.responses.RemovedResponse",
    "BASE.data.responses.ErrorResponse",
    "Date.prototype.format",
    "BASE.data.utils"
], function () {

    var createGuid = BASE.util.Guid.create;
    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Hashmap = BASE.collections.Hashmap;
    var Provider = BASE.query.Provider;
    var Queryable = BASE.query.Queryable;
    var SqlVisitor = BASE.query.SqlVisitor;

    var AddedResponse = BASE.data.responses.AddedResponse;
    var UpdatedResponse = BASE.data.responses.UpdatedResponse;
    var RemovedResponse = BASE.data.responses.RemovedResponse;
    var ErrorResponse = BASE.data.responses.ErrorResponse;
    var flattenEntity = BASE.data.utils.flattenEntity;

    var sqlizePrimitive = function (value) {

        if (typeof value === "string") {
            return value;
        } else if (typeof value === "number") {
            return value.toString();
        } else if (typeof value === "boolean") {
            return value ? 1 : 0;
        } else if (value instanceof Date) {
            return value.getTime();
        } else if (value === null) {
            return null;
        }

    };

    var typesMap = new Hashmap();
    typesMap.add(Double, "REAL");
    typesMap.add(Float, "REAL");
    typesMap.add(Integer, "INTEGER");
    typesMap.add(Byte, "INTEGER");
    typesMap.add(Binary, "INTEGER");
    typesMap.add(Boolean, "NUMERIC");
    typesMap.add(Date, "NUMERIC");
    typesMap.add(DateTimeOffset, "NUMERIC");
    typesMap.add(Decimal, "NUMERIC");
    typesMap.add(String, "TEXT");

    BASE.namespace("BASE.data.dataStores");

    var filterReleventProperties = function (properties) {
        return Object.keys(properties).filter(function (key) {
            var property = properties[key];
            if (typeof property.type !== "undefined") {
                var sqlType = typesMap.get(property.type);

                if (sqlType !== null) {
                    return true;
                }
            }
            return false;
        });

    };

    var findPrimaryKeys = function (properties) {
        return filterReleventProperties(properties).filter(function (key) {
            if (properties[key].primaryKeyRelationships.length > 0) {
                return true;
            }
            return false;
        });
    };

    var getDefaultValue = function (model, property) {
        var defaultValue = null;
        var getter = model.properties[property].defaultValue;

        if (typeof getter === "function") {
            defaultValue = getter();
        } else if (typeof getter !== "undefined") {
            defaultValue = getter;
        }

        return defaultValue;
    };

    var SqlWriter = BASE.data.dataStores.SqlWriter = function (edm) {
        var self = this;

        BASE.assertNotGlobal(self);

        self.createTableClause = function (model) {
            return "CREATE TABLE " + model.collectionName + self.createColumnDefinition(model);
        };

        self.createColumnDefinition = function (model) {
            var foreignKeys = [];
            var columns = [];
            var indexes = new Hashmap();
            var primaryKeys = [];
            var properties = model.properties;

            Object.keys(properties).forEach(function (property) {
                if (properties[property].primaryKey) {
                    primaryKeys.push(property);
                }
            });

            Object.keys(model.properties).forEach(function (key) {
                var property = model.properties[key];
                if (typeof property.type !== "undefined") {
                    var sqlType = typesMap.get(property.type);
                    var primaryKey = "";

                    if (sqlType !== null) {
                        if (property.primaryKey) {
                            indexes.add(key, key);

                            if (primaryKeys.length === 1) {
                                primaryKey = " PRIMARY KEY";
                            }

                            if (property.autoIncrement) {
                                primaryKey += " AUTOINCREMENT";
                            }
                        }
                        columns.push(key + " " + sqlType + primaryKey);
                    }
                    if (property.foreignKeyRelationship) {
                        indexes.add(property.foreignKeyRelationship.withForeignKey, property.foreignKeyRelationship.withForeignKey);
                        var sourceModel = edm.getModelByType(property.foreignKeyRelationship.type);
                        foreignKeys.push("FOREIGN KEY (" + property.foreignKeyRelationship.withForeignKey + ") REFERENCES " + sourceModel.collectionName + "(" + property.foreignKeyRelationship.hasKey + ")");
                    }
                }
            });
            primaryKeysStatement = "";
            if (primaryKeys.length > 1) {
                primaryKeysStatement = ", PRIMARY KEY (" + primaryKeys.join(", ") + ")";
            }

            var indexValues = indexes.getValues();
            var definition = "(\n\t";
            definition += columns.concat(foreignKeys).join(", \n\t");
            definition += primaryKeysStatement;
            definition += "\n)";
            return definition;
        };

        self.createIndexes = function (model) {
            var indexes = new Hashmap();

            Object.keys(model.properties).forEach(function (key) {
                var property = model.properties[key];
                if (typeof property.type !== "undefined") {
                    var sqlType = typesMap.get(property.type);

                    if (sqlType !== null) {
                        if (property.primaryKeyRelationships.length > 0 || property.primaryKey) {
                            indexes.add(key, key);
                        }
                    }
                    if (property.foreignKeyRelationship) {
                        indexes.add(property.foreignKeyRelationship.withForeignKey, property.foreignKeyRelationship.withForeignKey);
                    }
                }
            });

            var indexValues = indexes.getValues();
            definition = "CREATE INDEX IF NOT EXISTS " + indexValues.join("_") + " ON " + model.collectionName + " (\n\t" + indexValues.join(", \n\t") + "\n)";
            return definition;
        };

        self.createInsertStatement = function (entity) {
            var Type = entity.constructor
            var model = edm.getModelByType(Type);
            var columns = [];
            var values = [];
            var properties = model.properties;

            filterReleventProperties(properties).forEach(function (key) {
                var defaultValue = getDefaultValue(model, key);
                if (typeof entity[key] !== "undefined" && entity[key] !== null) {
                    columns.push(key);
                    if (entity[key] === null) {
                        values.push(sqlizePrimitive(defaultValue));
                    } else {
                        values.push(sqlizePrimitive(entity[key]));
                    }
                }
            });

            if (values.length === 0) {
                return {
                    statement: "INSERT INTO " + model.collectionName + " DEFAULT VALUES",
                    values: values
                };
            } else {
                return {
                    statement: "INSERT INTO " + model.collectionName + " (" + columns.join(", ") + ") VALUES (" + values.map(function () { return "?"; }).join(", ") + ")",
                    values: values
                };
            }


        };

        self.createUpdateStatement = function (entity, updates) {
            var model = edm.getModelByType(entity.constructor);
            var primaryKeyExpr = [];
            var primaryKeyValues = [];
            var columnSet = [];
            var values = [];
            var properties = model.properties;

            Object.keys(properties).forEach(function (key) {
                var property = properties[key];

                if (typeof updates[key] !== "undefined" && typesMap.hasKey(property.type)) {
                    columnSet.push(key + " = ?");
                    values.push(sqlizePrimitive(updates[key]));
                }
            });

            filterReleventProperties(properties).forEach(function (key) {
                if (properties[key].primaryKeyRelationships.length !== 0 || properties[key].primaryKey) {
                    primaryKeyExpr.push(key + " = ?");
                    primaryKeyValues.push(entity[key]);
                }
            });

            values = values.concat(primaryKeyValues);

            return {
                statement: "UPDATE " + model.collectionName + " SET " + columnSet.join(", ") + " WHERE " + primaryKeyExpr.join(" AND "),
                values: values
            };
        };

        self.createDeleteStatement = function (entity) {
            var model = edm.getModelByType(entity.constructor);
            var primaryKeysExpr = [];
            var values = [];
            var properties = model.properties;
            var primaryKeys = edm.getPrimaryKeyProperties(entity.constructor);

            primaryKeys.forEach(function (primaryKey) {

                if (entity[primaryKey] === null) {
                    primaryKeysExpr.push(primaryKey + " IS NULL");
                } else {
                    primaryKeysExpr.push(primaryKey + " = ?");
                    values.push(sqlizePrimitive(entity[primaryKey]));
                }

            });

            return {
                statement: "DELETE FROM " + model.collectionName + " WHERE " + primaryKeysExpr.join(" AND "),
                values: values
            };
        };

    };

    BASE.data.dataStores.SqliteDataStore = function (Type, db, edm) {
        var self = this;

        BASE.assertNotGlobal(self);

        var edmModel = edm.getModelByType(Type);
        var properties = edmModel.properties;
        var tableName = edmModel.collectionName;
        var sqlWriter = new SqlWriter(edm);
        var tableSql = sqlWriter.createTableClause(edmModel);
        var indexesSql = sqlWriter.createIndexes(edmModel);
        var primaryKeys = findPrimaryKeys(edmModel.properties);
        var primaryKey = primaryKeys[0];

        var createTable = function () {
            return new Future(function (setValue, setError) {
                execute(tableSql).then(function () {
                    execute(indexesSql).then(setValue).ifError(setError);
                }).ifError(setError);
            });
        };

        var readyFuture = new Future(function (setValue, setError) {

            execute("SELECT sql FROM sqlite_master WHERE tbl_name = '" + tableName + "'").then(function (results) {

                if (results.rows.length > 0) {

                    var oldTableSql = results.rows.item(0).sql;
                    if (oldTableSql !== tableSql) {
                        execute("DROP TABLE IF EXISTS " + tableName).then(function () {
                            createTable().then(setValue).ifError(function (e) {
                                console.log(e.message, tableSql);
                                throw e;
                            });
                        });
                    } else {
                        setValue();
                    }

                } else {
                    createTable().then(setValue).ifError(function (e) {
                        console.log(e.message, tableSql, indexesSql);
                        throw e;
                    });
                }

            }).ifError(function () {
                throw new Error("Everything is broken. :(");
            });

        });

        var execute = function (sql, values) {
            if (!Array.isArray(values)) {
                values = [];
            }

            return new Future(function (setValue, setError) {
                db.transaction(function (transaction) {
                    transaction.executeSql(sql, values, function (transaction, results) {
                        setValue(results);
                    }, function (transaction, error) {
                        setError(error);
                    });
                });

            }).then();
        };

        self.add = function (entity) {
            var relationships = edm.getOneToOneAsTargetRelationships(entity);
            relationships = relationships.concat(edm.getOneToManyAsTargetRelationships(entity));

            var constraint;
            var isEmptyTarget = relationships.some(function (relationship) {
                if (relationship.optional !== true) {
                    var value = typeof entity[relationship.withForeignKey] === "undefined" || entity[relationship.withForeignKey] === null;
                    if (value) {
                        constraint = relationship
                    }
                    return value;
                } else {
                    return false;
                }
            });

            if (isEmptyTarget) {
                console.log(constraint);
                throw new Error("Foreign key constraint on relationship.");
            }

            var addSql = sqlWriter.createInsertStatement(entity);

            return new Future(function (setValue, setError) {

                execute(addSql.statement, addSql.values).then(function (results) {
                    var id = results.insertId;
                    var newEntity = flattenEntity(entity, true);

                    // This could be problematic, because many to many entities often times use the two
                    // Foreign keys as their primary key.
                    var primaryKeys = edm.getPrimaryKeyProperties(Type);
                    if (primaryKeys.length === 1) {
                        newEntity[primaryKeys[0]] = id;
                    }

                    var response = new AddedResponse("Entity was successfully added.", newEntity);

                    setValue(response);
                }).ifError(function (error) {
                    // TODO: we need to get the error messages of the sql.
                    setError(new ErrorResponse("Sql error."));
                });

            }).then();

        };

        self.update = function (entity, updates) {
            return new Future(function (setValue, setError) {
                var sql = sqlWriter.createUpdateStatement(entity, updates);

                execute(sql.statement, sql.values).then(function (results) {
                    var response = new UpdatedResponse("Successfully updated the entity.");
                    setValue(response);
                }).ifError(function (error) {
                    // TODO: Better error messages.
                    setError(new ErrorResponse("Failed to updated entity."));
                });
            }).then();
        };

        self.remove = function (entity) {
            return new Future(function (setValue, setError) {
                var sql = sqlWriter.createDeleteStatement(entity);

                execute(sql.statement, sql.values).then(function (results) {
                    var response = new RemovedResponse("Successfully removed the entity.");
                    setValue(response);
                }).ifError(function (error) {
                    // TODO: Better error messages.
                    setError(new ErrorResponse("Failed to updated entity."));
                });
            }).then();
        };

        self.drop = function () {
            return new Future(function (setValue, setError) {
                var sql = "DROP TABLE '" + tableName + "'";
                execute(sql).then(function () {
                    setValue();
                }).ifError(function (error) {
                    setError(new ErrorResponse("Failed to drop table: " + tableName));
                });
            }).then();
        };

        self.getQueryProvider = function () {
            var provider = new Provider();

            provider.toArray = provider.execute = function (queryable) {
                return new Future(function (setValue, setError) {
                    var expression = queryable.getExpression();
                    var model = edm.getModelByType(Type);
                    var visitor = new SqlVisitor(tableName, model);
                    var dtos = [];


                    var where = "";
                    var take = "";
                    var skip = "";
                    var orderBy = "";
                    var defaultTake = 1000;
                    var atIndex = 0;
                    var sql = "SELECT * FROM " + tableName + " ";

                    if (expression.where) {
                        where = visitor.parse(expression.where);
                    }

                    if (expression.skip) {
                        skip = visitor.parse(expression.skip);
                        atIndex = expression.skip.children[0].value;
                    }

                    if (expression.take) {
                        take = visitor.parse(expression.take);
                        defaultTake = expression.take.children[0].value;
                    }

                    if (expression.orderBy) {
                        orderBy = " " + visitor.parse(expression.orderBy);
                    }


                    sql += where + orderBy + take + skip;
                    execute(sql).then(function (results) {
                        var entities = [];
                        var length = results.rows.length;

                        for (var x = 0; x < length ; x++) (function (x) {
                            var dto = results.rows.item(x);
                            var entity = new Type();

                            Object.keys(dto).forEach(function (key) {
                                var Type = properties[key].type;

                                if ((Type === Date || Type === DateTimeOffset) && dto[key] !== null) {
                                    entity[key] = new Date(dto[key]);
                                } else if (Type === Boolean) {
                                    entity[key] = dto[key] ? true : false;
                                } else {
                                    entity[key] = dto[key];
                                }

                            });

                            entities.push(entity);
                        }(x));

                        setValue(entities);
                    }).ifError(function (error) {
                        throw new Error(sql);
                        setError(error);
                    });
                });
            };

            return provider;
        };

        self.asQueryable = function () {
            var queryable = new Queryable(Type);

            queryable.provider = self.getQueryProvider();
            return queryable;
        };


        self.dispose = function () {
            return Future.fromResult();
        };

        self.onReady = function (callback) {
            return readyFuture.then(callback);
        };

        readyFuture.then();
    };

});