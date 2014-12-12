BASE.require([
    "Array.prototype.asQueryable",
    "BASE.query.Provider",
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
    var Provider = BASE.query.Provider;
    
    var AddedResponse = BASE.data.responses.AddedResponse;
    var UpdatedResponse = BASE.data.responses.UpdatedResponse;
    var RemovedResponse = BASE.data.responses.RemovedResponse;
    var ErrorResponse = BASE.data.responses.ErrorResponse;
    
    var cloneObject = BASE.data.utils.flattenEntity;
    
    BASE.namespace("BASE.data.dataStores");
    
    BASE.data.dataStores.InMemoryDataStore = function (primaryKeyProperties) {
        var self = this;
        
        BASE.assertNotGlobal(self);
        
        BASE.util.Observable.call(self);
        
        var entities = new Hashmap();
        
        if (!Array.isArray(primaryKeyProperties) && primaryKeyProperties.length > 0) {
            throw new Error("Argument error: primaryKeyProperties needs to be an array of properties.");
        }
        
        var getUniqueValue = function (entity) {
            return primaryKeyProperties.reduce(function (current, next) {
                return current += entity[next];
            }, "");
        };
        
        var setUniqueValues = function (entity) {
            primaryKeyProperties.forEach(function (key) {
                if (typeof entity[key] === "undefined" || entity[key] === null) {
                    entity[key] = createGuid();
                }
            });
        };
        
        self.add = function (entity) {
            var result;
            if (!entity) {
                var error = new ErrorResponse("An Entity cannot be null or undefined.");
                result = Future.fromError(error);
            } else {
                var id = getUniqueValue(entity);
                
                if (entities.hasKey(id)) {
                    var error = new ErrorResponse("An Entity with that key already exists.");
                    result = Future.fromError(error);
                } else {
                    setUniqueValues(entity);
                    var clone = cloneObject(entity);
                    id = getUniqueValue(entity);

                    entities.add(id, clone);
                    clone.id = id;
                    result = Future.fromResult(new AddedResponse("Successfully added enity.", clone));
                    
                    self.notify({
                        type: "added",
                        entity: entity
                    });
                }
            }
            return result;
        };
        
        self.update = function (entity, updates) {
            var result;
            var id = getUniqueValue(entity);
            
            var inMemoryEntity = entities.get(id);
            
            if (inMemoryEntity) {
                Object.keys(updates).forEach(function (key) {
                    inMemoryEntity[key] = updates[key];
                });
                
                result = Future.fromResult(new UpdatedResponse("Update was successful."));
                
                self.notify({
                    type: "updated",
                    id: id,
                    updates: updates
                });

            } else {
                result = Future.fromError(new ErrorResponse("Unknown entity, couldn't update."));
            }
            
            return result;
        };
        
        self.remove = function (entity) {
            var id = getUniqueValue(entity);
            var result;
            var hasKey = entities.hasKey(id);
            
            if (hasKey) {
                entities.remove(id);
                result = Future.fromResult(new RemovedResponse("Entity was successfully removed."));
                
                self.notify({
                    type: "removed",
                    entity: entity
                });

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
        
        self.getQueryProvider = function () {
            var items = [];
            entities.getValues().forEach(function (entity) {
                items.push(cloneObject(entity));
            });
            
            return items.asQueryable().provider;
        };
        
        self.getEntities = function () {
            return entities;
        };
        
        self.setEntities = function (value) {
            if (value instanceof Hashmap) {
                entities = value;
            } else {
                throw new Error("Expected a Hashmap.");
            }
        };
        
        self.initialize = function () {
            return Future.fromResult(undefined);
        };
        
        self.dispose = function () {
            return Future.fromResult(undefined);
        };
    };


});