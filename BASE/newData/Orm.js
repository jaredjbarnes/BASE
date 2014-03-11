BASE.require([
"BASE.collections.MultiKeyMap",
"BASE.collections.Hashmap",
"BASE.behaviors.NotifyPropertyChange",
"BASE.behaviors.collections.ObservableArray"
], function () {
    BASE.namespace("BASE.data");

    var Hashmap = BASE.collections.Hashmap;
    var MultiKeyMap = BASE.collections.MultiKeyMap;

    BASE.data.Orm = function () {
        var self = this;
        BASE.assertNotGlobal(self);

        var oneToOneRelationships = new MultiKeyMap();
        var oneToOneAsTargetRelationships = new MultiKeyMap();
        var oneToManyRelationships = new MultiKeyMap();
        var oneToManyAsTargetRelationships = new MultiKeyMap();

        var oneToOneObservers = new MultiKeyMap();
        var oneToOneAsTargetObservers = new MultiKeyMap();
        var oneToManyObservers = new MultiKeyMap();
        var oneToManyAsTargetObservers = new MultiKeyMap();

        var oneToOneForeignKeyObservers = new MultiKeyMap();

        var entities = new Hashmap();

        var makeSetter = function (property) {
            return "set" + property.substr(0, 1).toUpperCase() + property.substr(1);
        };

        var observeOneToOne = function (entity) {
            var Type = entity.constructor;

            var hashmap = oneToOneRelationships.get(Type) || new Hashmap();
            hashmap.getKeys().forEach(function (property) {
                var relationship = hashmap.get(property);

                var withOneSetter = makeSetter(relationship.withOne);
                var withForeignKeySetter = makeSetter(relationship.withForeignKey);

                var action = function (e) {
                    var oldTarget = e.oldValue;
                    var newTarget = e.newValue;
                    var foreignKeyObserver;

                    self.add(oldTarget);
                    self.add(newTarget);

                    if (oldTarget && oldTarget[relationship.withOne] === entity) {
                        oldTarget[withOneSetter](null);
                        oldTarget[withForeignKeySetter](null);
                    }

                    if (newTarget && newTarget[relationship.withOne] !== entity) {
                        newTarget[withOneSetter](entity);
                    }

                    if (entity.id === null) {
                        var idObserver = entity.observeProperty("id", function (e) {
                            if (newTarget && entity[property] === newTarget) {
                                newTarget[withForeignKeySetter](e.newValue);
                            }
                            idObserver.dispose();
                        });

                    } else {
                        if (newTarget !== null) {
                            newTarget[withForeignKeySetter](entity.id);
                        }
                    }

                };

                // Link if there is a entity already there.
                action({
                    oldValue: null,
                    newValue: entity[property]
                });

                var observer = entity.observeProperty(property, action);
                oneToOneObservers.add(entity, property, observer);
            });

        };

        var observeOneToOneAsTarget = function (entity) {
            var Type = entity.constuctor;
            var hashmap = oneToOneAsTargetRelationships.get(Type) || new Hashmap();

            hashmap.getKeys().forEach(function (property) {
                var relationship = hashmap.get(property);

                var hasOneSetter = makeSetter(relationship.hasOne);

                var action = function (e) {
                    var oldSource = e.oldValue;
                    var newSource = e.newValue;

                    self.add(oldSource);
                    self.add(newSource);

                    if (oldSource && oldSource[relationship.hasOne] === entity) {
                        oldSource[hasOneSetter](null);
                    }

                    if (newSource && newSource[relationship.hasOne] !== entity) {
                        newSource[hasOneSetter](entity);
                    }

                };
                // Link if there is a entity already there.
                action({
                    oldValue: null,
                    newValue: entity[property]
                });

                var observer = entity.observeProperty(property, action);
                oneToOneAsTargetObservers.add(entity, property, observer);
            });

        };

        var observeToAllOneToManys = function () {

        };

        var observeOneToMany = function () { };

        self.addOneToOne = function (relationship) {
            oneToOneRelationships.add(relationship.type, relationship.hasOne, relationship);
            oneToOneAsTargetRelationships.add(relationship.ofType, relationship.withOne, relationship);
        };

        self.addOneToMany = function (relationship) {
            oneToManyRelationships.add(relationship.type, relationship.hasOne, relationship);
            oneToManyAsTargetRelationships.add(relationship.ofType, relationship.withMany, relationship);
        };

        self.add = function (entity) {
            if (entity && !entities.hasKey(entity)) {
                entities.add(entity, entity);

                BASE.behaviors.NotifyPropertyChange.apply(entity);

                observeOneToOne(entity);
                observeOneToOneAsTarget(entity);


            }
        };

        self.remove = function (entity) {
            if (entity && entities.hasKey(entity)) {
                entities.remove(entity);

                oneToOneObservers.get(entity).getValues().forEach(function (observer) {
                    observer.dispose();
                });

                oneToOneAsTargetObservers.get(entity).getValues().forEach(function (observer) {
                    observer.dispose();
                });
            }

        };
    };

});