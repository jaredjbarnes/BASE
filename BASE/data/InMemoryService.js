BASE.require([
    "Array.prototype.asQueryable",
    "BASE.query.ArrayProvider",
    "BASE.collections.Hashmap",
    "BASE.util.Guid",
    "BASE.async.Future",
    "BASE.query.Expression",
    "BASE.data.UnauthorizedError",
    "BASE.data.ForbiddenError",
    "BASE.data.ValidationError",
    "BASE.data.NetworkError",
    "BASE.data.EntityNotFoundError",
    "BASE.data.AddedResponse",
    "BASE.data.UpdatedResponse",
    "BASE.data.RemovedResponse",
], function () {

    var Hashmap = BASE.collections.Hashmap;
    var Future = BASE.async.Future;
    var Guid = BASE.util.Guid;

    BASE.namespace("BASE.data");

    BASE.data.InMemoryService = function () {
        var self = this;
        var dataStores = new Hashmap();

        var makeDto = function (entity) {
            var Dto = {};

            for (var x in entity) {
                var objX = x;
                if ((typeof entity[x] === "string" ||
                    typeof entity[x] === "number" ||
                    typeof entity[x] === "boolean" ||
                    entity[x] === null ||
                    entity[x] instanceof Date) &&
                    x.indexOf("_") !== 0) {
                    if (x === "id") {
                        if (entity.id !== null) {
                            Dto[objX] = entity[x];
                        }
                    } else {
                        Dto[objX] = entity[x];
                    }
                }
            }
            Dto._Type = entity.constructor;
            return Dto;
        };

        self.addType = function (Type) {
            dataStores.add(Type, []);
        };

        self.getSetProvider = function (Type) {
            var providerPrototype = new BASE.query.ArrayProvider([]);

            var Provider = function () {
                var self = this;

                self.execute = function (queryable) {
                    return new Future(function (setValue, setError) {
                        var Type = queryable.Type;
                        var dataStore = dataStores.get(Type);

                        var provider = dataStore.asQueryable().provider;
                        provider.execute(queryable).then(setValue).ifError(setError);
                    });
                };

                self.count = function (queryable) {
                    return new Future(function (setValue, setError) {
                        self.execute(queryable).then(function (array) {
                            setValue(array.length);
                        }).setError(setError);
                    });
                };
            };

            Provider.prototype = providerPrototype;

            return new Provider();
        };

        self.getTargetProvider = function (entity, property) {
            var providerPrototype = [].asQueryable().getProviderFactory();

            var Provider = function () {
                var self = this;

                self.execute = function (queryable) {

                    queryable.and(function () {
                        return Expression.equal(Expression.property("id"), Expression.number(entity.id));
                    });

                    return new Future(function (setValue, setError) {
                        var Type = queryable.Type;
                        var dataStore = dataStores.get(Type);

                        var dataStoreQueryable = dataStore.asQueryable();
                        dataStoreQueryable.expression = queryable.getExpression();
                        dataStoreQueryable.ToArray().then(setValue).setError(setError);
                    });
                };

                self.count = function (queryable) {
                    return new Future(function (setValue, setError) {
                        self.execute(queryable).then(function (array) {
                            setValue(array.length);
                        }).setError(setError);
                    });
                };
            };

            Provider.prototype = providerPrototype;

            return new Provider();
        };

        self.addEntity = function (entity) {
            return new Future(function (setValue, setError) {
                var dto = makeDto(entity);
                dto.id = Guid.create();

                var array = dataStores.get(entity.constructor);

                if (array) {
                    array.push(dto);
                } else {
                    setError("Couldn't find a store for that type.");
                }

                setValue();
            }).then();
        };

        self.updateEntity = function (entity) {
            var dto = makeDto(entity);
            var id = dto.id;

            return new Future(function (setValue, setError) {
                var array = dataStores.get(entity.constructor);
                if (!id) {
                    setError("Cannot update an entity that doesn't have an id.");
                }

                if (array) {
                    array.forEach(function (item) {
                        if (item.id === id) {
                            array[index] = dto;
                        }
                    });

                    setValue();
                } else {
                    setError("Couldn't find a store for that type.");
                }

                setValue();
            }).then();
        };

        self.removeEntity = function (entity) {
            var id = entity.id;
            return new Future(function (setValue, setError) {
                var array = dataStores.get(entity.constructor);

                if (array) {
                    var index = -1;
                    array.forEach(function (item, i) {
                        if (item.id === id) {
                            index = i;
                        }
                    });

                    if (index > -1) {
                        array.splice(index, 1);
                    }

                    setValue();
                } else {
                    setError("Couldn't find a store for that type.");
                }

                setValue();
            }).then();
        };

        self.getTypeForDto = function (dto) {
            return dto._Type;
        };

    };

});