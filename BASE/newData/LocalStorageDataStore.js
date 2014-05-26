BASE.require([
    "Array.prototype.asQueryable",
    "BASE.util.Guid",
    "BASE.collections.Hashmap",
    "BASE.data.responses.AddedResponse",
    "BASE.data.responses.UpdatedResponse",
    "BASE.data.responses.RemovedResponse",
    "BASE.data.responses.ErrorResponse",
    "BASE.data.utils"
], function () {

    var createGuid = BASE.util.Guid.create;
    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Hashmap = BASE.collections.Hashmap;

    var AddedResponse = BASE.data.responses.AddedResponse;
    var UpdatedResponse = BASE.data.responses.UpdatedResponse;
    var RemovedResponse = BASE.data.responses.RemovedResponse;
    var ErrorResponse = BASE.data.responses.ErrorResponse;

    var isPrimitive = BASE.data.utils.isPrimitive;

    var cloneObject = function (obj) {
        var clone = {};

        Object.keys(obj).forEach(function (key) {
            var value = obj[key];

            if (isPrimitive(value)) {
                if (key !== "_hash") {
                    clone[key] = obj[key];
                }
            }

        });

        return clone;
    };

    BASE.namespace("BASE.data");

    BASE.data.LocalStorageDataStore = function (name) {
        var self = this;

        BASE.assertNotGlobal(self);

        var entities = new Hashmap();

        self.add = function (entity) {
            var result;
            if (!entity) {

                var error = new ErrorResponse("An Entity cannot be null or undefined.");
                result = Future.fromError(error);

            } else {
                var clone = cloneObject(entity);
                var id = clone.id || createGuid();

                if (entities.hasKey(id)) {
                    var error = new ErrorResponse("An Entity with that key already exists.");
                    result = Future.fromError(error);
                } else {
                    entities.add(id, clone);
                    clone.id = id;
                    result = Future.fromResult(new AddedResponse("Successfully added enity.", clone));
                }
            }
            return result;
        };

        self.update = function (id, updates) {
            var entity = entities.get(id);
            var result;

            if (entity) {
                Object.keys(updates).forEach(function (key) {
                    entity[key] = updates[key];
                });

                result = Future.fromResult(new UpdatedResponse("Update was successful."));
            } else {
                result = Future.fromError(new ErrorResponse("Unknown entity, couldn't update."));
            }

            return result;
        };

        self.remove = function (entity) {
            var id = entity.id;
            var result;
            var hasKey = entities.hasKey(id);

            if (hasKey) {
                entities.remove(id);
                result = Future.fromResult(new RemovedResponse("Entity was successfully removed."));
            } else {
                result = Future.fromError(new ErrorResponse("Unknown entity, couldn't remove."));
            }

            return result;
        };

        self.asQueryable = function () {
            var items = [];
            entities.getValues().forEach(function (entity) {
                items.push(cloneObject(entity));
            });

            return items.asQueryable();
        };

        self.initialize = function () {
            var json = localStorage[name];
            if (json) {
                var object = JSON.parse(json);
                Object.keys(object).forEach(function (key) {
                    entities.add(key, object[key]);
                });
            }
            return Future.fromResult(undefined);
        };

        self.saveToDisk = function () {
            var object = {};
            entities.getKeys().forEach(function (key) {
                object[key] = entities.get(key);
            });

            localStorage[name] = JSON.stringify(object);
        };

        self.dispose = function () {
            self.saveToDisk();
            return Future.fromResult(undefined);
        };
    };


});