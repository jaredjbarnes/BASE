BASE.require([
    "BASE.data.ChangeTracker",
    "BASE.data.Orm",
    "BASE.collections.Hashmap",
    "BASE.query.Provider",
    "BASE.query.Queryable"
], function () {

    BASE.namespace("BASE.data");

    var Orm = BASE.data.Orm;
    var ChangeTracker = BASE.data.ChangeTracker;
    var Hashmap = BASE.collections.Hashmap;
    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Queryable = BASE.query.Queryable;
    var Provider = BASE.query.Provider;

    BASE.data.DataContext = function (relationships) {
        var self = this;
        BASE.assertNotGlobal(self);

        var dataContext = self;
        var orm = new Orm();

        var dataStoresHash = new Hashmap();
        var changeTrackersHash = new Hashmap();
        var loadedBucket = new Hashmap();
        var addedBucket = new Hashmap();
        var updatedBucket = new Hashmap();
        var removedBucket = new Hashmap();

        var removeEntityFromBuckets = function (entity) {
            addedBucket.remove(entity);
            updatedBucket.remove(entity);
            removedBucket.remove(entity);
            loadedBucket.remove(entity);
        };

        var saveEntity = function (entity) {
            return new Future(function (setValue, setError) {
                var task = new Task();

                var oneToOne = orm.getOneToOneAsTargetRelationships(entity);
                var oneToMany = orm.getOneToManyAsTargetRelationships(entity);
                var dependencies = oneToOne.concat(oneToMany);

                dependencies.forEach(function (relationship) {
                    var property = relationship.hasOne;

                    if (entity[property]) {
                        task.add(self.saveEntity(entity[property]));
                    }
                });

                task.start().whenAll(function (futures) {
                    changeTrackersHash.get(entity).save().then(setValue).ifError(setError);
                });
            }).then();
        };

        var getAddedEntities = function (Type) {
            return addedBucket.getValues().filter(function (entity) {
                if (entity.constructor === Type) {
                    return true;
                }
                return false;
            });
        };

        var setUpEntities = function(dtos){
            var entities;

            return entities;
        };

        var createManyToManyProvider = function(id){
        
        };

        var createOneToManyProvider = function(id, fillArray){
            var provider = new Provider();
            provider.toArray = provider.execute = function(queryable){

                return new Future(function(setValue, setError){

                    queryable.where(function(e){
                        return e.property("id").isEqualTo(id);
                    });

                    var dataStore = dataStoresHash.get( queryable.Type );

                    if (dataStore === null){
                        
                    }

                    var dataStoreQueryable = dataStore.asQueryable();
                    dataStoreQueryable.merge(queryable);
                
                    dataStoreQueryable.toArray(function(dtos){

                        var entities = setUpEntities(dtos);
                        fillArray.push.apply(fillArray, entities);
                    
                        setValue(entities);

                    }).ifError(setError);

                });
            };
        };

        var createEntity = function (Type) {
            var 
            orm.getOneToManyRelationships();
        };

        relationships.oneToOne = relationships.oneToOne || [];
        relationships.oneToMany = relationships.oneToMany || [];
        relationships.manyToMany = relationships.manyToMany || [];

        relationships.oneToOne.forEach(function (relationship) {
            orm.addOneToOne(relationship);
        });

        relationships.oneToMany.forEach(function (relationship) {
            orm.addOneToMany(relationship);
        });

        relationships.manyToMany.forEach(function (relationship) {
            orm.addManyToMany(relationship);
        });

        self.addEntity = function (entity) {
            orm.add(entity);
        };

        self.removeEntity = function (entity) {
            orm.remove(entity);
        };

        self.syncEntity = function (entity, dto) {
            var changeTracker = changeTrackersHash.get(entity);
            changeTracker.sync(dto);
        };

        self.saveEntity = function (entity) {
            var changeTracker = changeTrackersHash.get(entity);

            if (changeTracker === null) {
                throw new Error("The entity supplied wasn't part of the dataContext.");
            }

            return saveEntity(entity);
        };

        self.asQueryable = function (Type) {
            var dataStore = dataStoresHash.get(Type);
            if (dataStore === null) {
                throw new Error("Couldn't find dataStore for entity: " + Type);
            }

            var provider = new Provider();

            provider.toArray = provider.execute = function (queryable) {
                var dataStoreQueryable = dataStore.asQueryable();
                dataStoreQueryable.merge(queryable);

                dataStoreQueryable.toArray(loadEntities);
            };

            return dataStore.asQueryable();
        };

        self.getOrm = function () {
            return orm;
        };

        self.getPendingEntities = function () {
            return {
                added: addedBucket.getValues(),
                removed: removedBucket.getValues(),
                updated: updatedBucket.getValues()
            };
        };

        self.saveChanges = function () {
            return new Future(function (setValue, setError) {
                var task = new Task();

                var forEachEntity = function (entity) {
                    task.add(saveEntity(entity));
                };

                addedBucket.getValues().forEach(forEachEntity);
                updatedBucket.getValues().forEach(forEachEntity);
                removedBucket.getValues().forEach(forEachEntity);

                task.start().whenAll(setValue);

            }).then();
        };

        orm.observeType("entityAdded", function (e) {
            var entity = e.entity;
            var dataStore = dataStoresHash.get(e.entity.constructor);

            if (dataStore === null) {
                throw new Error("Couldn't find dataStore for entity: " + e.entity.constructor);
            }

            var changeTracker = new ChangeTracker(e.entity, dataStore);

            changeTracker.observeType("detached", function () {
                removeEntityFromBuckets(entity);
                changeTrackersHash.remove(entity);
            });

            changeTracker.observeType("added", function () {
                removeEntityFromBuckets(entity);
                addedBucket.add(entity, entity);
            });

            changeTracker.observeType("updated", function () {
                removeEntityFromBuckets(entity);
                updatedBucket.add(entity, entity);
            });

            changeTracker.observeType("removed", function () {
                removeEntityFromBuckets(entity);
                removedBucket.add(entity, entity);
            });

            changeTracker.observeType("loaded", function () {
                removeEntityFromBuckets(entity);
                // We want to use the entity's key as the key for the has, so we can sync.
                loadedBucket.add(entity.id, entity);
            });

            changeTrackersHash.add(entity, changeTracker);

            changeTracker.add();
        });

        orm.observeType("entityRemoved", function (e) {
            var entity = e.entity;
            var changeTracker = changeTrackersHash.get(entity);

            changeTracker.remove();
        });


    };

});