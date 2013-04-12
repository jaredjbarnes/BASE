BASE.require(["BASE.MultiKeyMap", "BASE.Hashmap", "BASE.ObservableEvent", "BASE.Observable"], function () {
    BASE.namespace("BASE.data");

    BASE.data.ObjectRelationManager = (function (Super) {

        var ObjectRelationManager = function (relationships) {

            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ObjectRelationManager(relationships);
            }

            Super.call(self);

            var trackedEntities = new BASE.Hashmap();
            var arrayObservers = new BASE.MultiKeyMap();

            var oneToOneRelationships = new BASE.MultiKeyMap();
            var oneToManyRelationships = new BASE.MultiKeyMap();
            var manyToManyRelationships = new BASE.MultiKeyMap();

            var oneToOneObservers = new BASE.MultiKeyMap();
            var oneToManyObservers = new BASE.MultiKeyMap();
            var manyToManyObservers = new BASE.MultiKeyMap();

            var _typeToPropertyRelationships = new BASE.MultiKeyMap();
            var _manyToManyMappingEntities = new BASE.MultiKeyMap();

            (function (relationships) {
                var oneToOne = relationships.oneToOne || [];
                var oneToMany = relationships.oneToMany || [];
                var manyToMany = relationships.manyToMany || [];

                oneToOne.forEach(function (relationship) {
                    // This if allows for one sided relationships. Example Apps.accessPermission is a OneToMany, that the Permission object doesn't care about.
                    if (relationship.hasOne) {
                        _typeToPropertyRelationships.add(relationship.Type, relationship.hasOne, relationship);
                        oneToOneRelationships.add(relationship.Type, relationship.hasOne, relationship);
                    }
                    if (relationship.withOne) {
                        _typeToPropertyRelationships.add(relationship.ofType, relationship.withOne, relationship);
                        oneToOneRelationships.add(relationship.ofType, relationship.withOne, relationship);
                    }
                });

                manyToMany.forEach(function (relationship) {
                    if (relationship.hasMany) {
                        var leftRelationship = {
                            Type: relationship.Type,
                            hasKey: relationship.hasKey,
                            hasMany: relationship.hasMany + "To" + relationship.withMany,
                            ofType: relationship.usingMappingType,
                            withKey: "id",
                            withForeignKey: relationship.withForeignKey,
                            withOne: relationship.withMany,
                        };
                        oneToMany.push(leftRelationship);
                        _typeToPropertyRelationships.add(relationship.Type, relationship.hasMany, relationship);
                        manyToManyRelationships.add(relationship.Type, relationship.hasMany, relationship);

                    }

                    if (relationship.withMany) {
                        var rightRelationship = {
                            Type: relationship.ofType,
                            hasKey: relationship.withKey,
                            hasMany: relationship.hasMany + "To" + relationship.withMany,
                            ofType: relationship.usingMappingType,
                            withKey: "id",
                            withForeignKey: relationship.hasForeignKey,
                            withOne: relationship.hasMany,
                        };

                        oneToMany.push(rightRelationship);
                        _typeToPropertyRelationships.add(relationship.ofType, relationship.withMany, relationship);
                        manyToManyRelationships.add(relationship.ofType, relationship.withMany, relationship);
                    }

                });

                oneToMany.forEach(function (relationship) {
                    if (relationship.hasMany) {
                        _typeToPropertyRelationships.add(relationship.Type, relationship.hasMany, relationship);
                        oneToManyRelationships.add(relationship.Type, relationship.hasMany, relationship);
                    }
                    if (relationship.withOne) {
                        _typeToPropertyRelationships.add(relationship.ofType, relationship.withOne, relationship);
                        oneToManyRelationships.add(relationship.ofType, relationship.withOne, relationship);
                    }
                });

            }(relationships));

            Object.defineProperties(self, {
                "relationships": {
                    get: function () {
                        return relationships;
                    }
                }
            });

            self.getRelationship = function (Type, property) {
                return _typeToPropertyRelationships.get(Type, property);
            };

            self.track = function (entity) {
                if (!trackedEntities.hasKey(entity)) {
                    trackedEntities.add(entity, entity);

                    var Type = entity.constructor;

                    var oneToOne = oneToOneRelationships.hasKey(Type) ? oneToOneRelationships.get(Type).getKeys() : [];
                    var oneToMany = oneToManyRelationships.hasKey(Type) ? oneToManyRelationships.get(Type).getKeys() : [];
                    var manyToMany = manyToManyRelationships.hasKey(Type) ? manyToManyRelationships.get(Type).getKeys() : [];

                    // Puts the mappings in
                    manyToMany.forEach(function (key) {
                        var relationship = manyToManyRelationships.get(Type, key);
                        if (relationship.Type === Type) {
                            // Add the array for storing the mapping.
                            entity[relationship.hasMany + "To" + relationship.withMany] = new BASE.ObservableArray();
                        } else {
                            // Add the array for storing the mapping.
                            entity[relationship.hasMany + "To" + relationship.withMany] = new BASE.ObservableArray();
                        }
                    });


                    oneToOne.forEach(function (key) {
                        var relationship = oneToOneRelationships.get(Type, key);
                        if (relationship.Type === Type) {
                            var observeOneToOneSource = function (e) {
                                var oldTarget = e.oldValue || {};
                                if (trackedEntities.hasKey(oldTarget)) {
                                    if (relationship.withOne) {
                                        oldTarget[relationship.withOne] = null;
                                    }
                                    oldTarget[relationship.withForeignKey] = null;
                                }

                                var newTarget = e.newValue;
                                if (newTarget) {
                                    if (relationship.withOne) {
                                        newTarget[relationship.withOne] = entity;
                                    }
                                    newTarget[relationship.withForeignKey] = entity[relationship.hasKey];

                                    if (entity[relationship.hasKey] === null) {
                                        var observeKey = function () {
                                            entity.unobserve(observeKey, relationship.hasKey);
                                            if (newTarget[relationship.withOne] === entity || typeof relationship.withOne === "undefined") {
                                                newTarget[relationship.withForeignKey] = entity[relationship.hasKey];
                                            }
                                        };
                                        entity.observe(observeKey, relationship.hasKey);
                                        self.onEntityUntracked(function untracked(event) {
                                            if (event.entity === entity) {
                                                self.removeOnEntityUntracked(untracked);
                                                entity.unobserve(observeKey, relationship.hasKey);
                                            }
                                        });
                                    }

                                    self.track(newTarget);
                                }

                            };

                            // Initial set
                            observeOneToOneSource({
                                property: relationship.hasOne,
                                source: entity,
                                oldValue: null,
                                newValue: entity[relationship.hasOne]
                            });

                            oneToOneObservers.add(Type, relationship.hasOne, observeOneToOneSource);
                            entity.observe(observeOneToOneSource, relationship.hasOne);

                        } else {
                            if (relationship.hasOne) {
                                var observeOneToOneTarget = function (e) {
                                    var oldSource = e.oldValue || {};
                                    if (trackedEntities.hasKey(oldSource)) {
                                        oldSource[relationship.hasOne] = null;
                                    }
                                    var newSource = e.newValue;
                                    if (newSource) {
                                        newSource[relationship.hasOne] = entity;
                                        self.track(newSource);
                                    }

                                    if ((entity[relationship.withOne] === newSource || typeof relationship.withOne === "undefined")) {
                                        if (newSource === null) {
                                            entity[relationship.withForeignKey] = null;
                                        } else {
                                            entity[relationship.withForeignKey] = newSource[relationship.hasKey];
                                        }
                                    }
                                };

                                // Initial set
                                observeOneToOneTarget({
                                    property: relationship.withOne,
                                    source: entity,
                                    oldValue: null,
                                    newValue: entity[relationship.withOne]
                                });

                                oneToOneObservers.add(Type, relationship.withOne, observeOneToOneTarget);
                                entity.observe(observeOneToOneTarget, relationship.withOne);
                            }
                        }
                    });

                    oneToMany.forEach(function (key) {
                        var relationship = oneToManyRelationships.get(Type, key);
                        if (relationship.Type === Type) {
                            var observeOneToManySource = function (e) {

                                e.oldItems.forEach(function (target) {
                                    if (trackedEntities.hasKey(target)) {
                                        if (relationship.withOne) {
                                            target[relationship.withOne] = null;
                                        }
                                        target[relationship.withForeignKey] = null;
                                    }
                                });

                                e.newItems.forEach(function (target) {
                                    if (relationship.withOne) {
                                        target[relationship.withOne] = entity;
                                    }
                                    target[relationship.withForeignKey] = entity[relationship.hasKey];

                                    if (entity[relationship.hasKey] === null) {
                                        var observeKey = function () {
                                            entity.unobserve(observeKey, relationship.hasKey);
                                            if (target[relationship.withOne] === entity || typeof relationship.withOne === "undefined") {
                                                target[relationship.withForeignKey] = entity[relationship.hasKey];
                                            }
                                        };
                                        entity.observe(observeKey, relationship.hasKey);
                                        self.onEntityUntracked(function untracked() {
                                            self.removeOnEntityUntracked(untracked);
                                            entity.unobserve(observeKey, relationship.hasKey);
                                        });
                                    }

                                    self.track(target);
                                });

                            };

                            observeOneToManySource({
                                property: relationship.hasMany,
                                source: entity,
                                oldItems: [],
                                newItems: entity[relationship.hasMany]
                            });

                            oneToManyObservers.add(Type, relationship.hasMany, observeOneToManySource);
                            entity.observe(observeOneToManySource, relationship.hasMany);

                            var arrayObserver = function (e) {
                                var event = new BASE.ObservableEvent(relationship.hasMany);
                                event.newItems = e.newItems;
                                event.oldItems = e.oldItems;
                                event.source = entity;
                                event.property = event.type;
                                entity.notify(event);
                            };
                            arrayObservers.add(Type, relationship.hasMany, arrayObserver);
                            entity[relationship.hasMany].observe(arrayObserver);

                        } else {
                            var observeOneToManyTarget = function (e) {
                                var oldSource = e.oldValue;
                                if (oldSource &&
                                    trackedEntities.hasKey(oldSource) && relationship.hasMany) {
                                    var index = oldSource[relationship.hasMany].indexOf(entity);
                                    if (index >= 0) {
                                        oldSource[relationship.hasMany].splice(index, 1);
                                    }
                                }
                                var newSource = e.newValue;
                                if (newSource && relationship.hasMany) {
                                    var index = newSource[relationship.hasMany].indexOf(entity);
                                    if (index < 0) {
                                        newSource[relationship.hasMany].push(entity);
                                    }
                                    self.track(e.newValue);
                                }

                                if ((entity[relationship.withOne] === newSource || typeof relationship.withOne === "undefined")) {
                                    if (newSource === null) {
                                        entity[relationship.withForeignKey] = null;
                                    } else {
                                        entity[relationship.withForeignKey] = newSource[relationship.hasKey];
                                    }
                                }

                            };

                            observeOneToManyTarget({
                                property: relationship.withOne,
                                source: entity,
                                oldValue: null,
                                newValue: entity[relationship.withOne]
                            });

                            oneToManyObservers.add(Type, relationship.withOne, observeOneToManyTarget);
                            entity.observe(observeOneToManyTarget, relationship.withOne);
                        }
                    });

                    manyToMany.forEach(function (key) {
                        var relationship = manyToManyRelationships.get(Type, key);

                        if (relationship.Type === Type && relationship.withMany) {
                            var observeManyToManySource = function (e) {

                                e.oldItems.forEach(function (target) {
                                    if (trackedEntities.hasKey(target)) {
                                        var index = target[relationship.withMany].indexOf(entity);
                                        if (index >= 0) {
                                            target[relationship.withMany].splice(index, 1);
                                        }
                                    }

                                    var instance = _manyToManyMappingEntities.get(entity, target);

                                    self.untrack(instance);
                                    entity[relationship.hasMany + "To" + relationship.withMany].remove(instance);
                                    target[relationship.hasMany + "To" + relationship.withMany].remove(instance);
                                });

                                e.newItems.forEach(function (target) {
                                    var index = target[relationship.withMany].indexOf(entity);
                                    if (index < 0) {
                                        target[relationship.withMany].push(entity);
                                    }

                                    self.track(target);

                                    var Type = relationship.usingMappingType;
                                    var instance = _manyToManyMappingEntities.get(entity, target);
                                    if (!instance) {
                                        instance = new Type();
                                    }
                                    var leftId = entity[relationship.hasKey];
                                    var rightId = target[relationship.withKey];

                                    instance[relationship.hasForeignKey] = rightId;
                                    instance[relationship.withForeignKey] = leftId;

                                    _manyToManyMappingEntities.add(entity, target, instance);
                                    entity[relationship.hasMany + "To" + relationship.withMany].add(instance);
                                    target[relationship.hasMany + "To" + relationship.withMany].add(instance);
                                });
                            };

                            observeManyToManySource({
                                property: relationship.hasMany,
                                source: entity,
                                oldItems: [],
                                newItems: entity[relationship.hasMany]
                            });

                            manyToManyObservers.add(Type, relationship.hasMany, observeManyToManySource);
                            entity.observe(observeManyToManySource, relationship.hasMany);

                            var arrayObserver = function (e) {
                                var event = new BASE.ObservableEvent(relationship.hasMany);
                                event.newItems = e.newItems;
                                event.oldItems = e.oldItems;
                                event.source = entity;
                                event.property = event.type;
                                entity.notify(event);
                            };

                            arrayObservers.add(Type, relationship.hasMany, arrayObserver);
                            entity[relationship.hasMany].observe(arrayObserver);

                        } else {

                            if (relationship.hasMany) {
                                var observeManyToManyTarget = function (e) {
                                    e.oldItems.forEach(function (source) {
                                        if (trackedEntities.hasKey(source)) {
                                            var index = source[relationship.hasMany].indexOf(entity);
                                            if (index >= 0) {
                                                source[relationship.hasMany].splice(index, 1);
                                            }
                                        }
                                    });

                                    e.newItems.forEach(function (source) {
                                        var index = source[relationship.hasMany].indexOf(entity);
                                        if (index < 0) {
                                            source[relationship.hasMany].push(entity);
                                        }
                                        self.track(source);
                                    });
                                };

                                observeManyToManyTarget({
                                    property: relationship.withMany,
                                    source: entity,
                                    oldItems: [],
                                    newItems: entity[relationship.withMany]
                                });

                                manyToManyObservers.add(Type, relationship.withMany, observeManyToManyTarget);
                                entity.observe(observeManyToManyTarget, relationship.withMany);

                                var arrayObserver = function (e) {
                                    var event = new BASE.ObservableEvent(relationship.withMany);
                                    event.newItems = e.newItems;
                                    event.oldItems = e.oldItems;
                                    event.source = entity;
                                    event.property = event.type;
                                    entity.notify(event);
                                };

                                arrayObservers.add(Type, relationship.withMany, arrayObserver);
                                entity[relationship.withMany].observe(arrayObserver);
                            }
                        }
                    });

                    var event = new BASE.ObservableEvent("tracked");
                    event.entity = entity;
                    self.notify(event);
                }
            };

            self.untrack = function (entity) {
                if (trackedEntities.hasKey(entity)) {
                    trackedEntities.remove(entity);

                    // Remove all mappingsObjects
                    _manyToManyMappingEntities.remove(entity);

                    var Type = entity.constructor;

                    var oneToOne = oneToOneRelationships.hasKey(Type) ? oneToOneRelationships.get(Type).getKeys() : [];
                    var oneToMany = oneToManyRelationships.hasKey(Type) ? oneToManyRelationships.get(Type).getKeys() : [];
                    var manyToMany = manyToManyRelationships.hasKey(Type) ? manyToManyRelationships.get(Type).getKeys() : [];

                    oneToOne.forEach(function (key) {
                        var relationship = oneToOneRelationships.get(Type, key);
                        if (relationship.Type === Type) {
                            var observeOneToOneSource = oneToOneObservers.remove(Type, relationship.hasOne);
                            entity.unobserve(observeOneToOneSource, relationship.hasOne);
                        } else {
                            var observeOneToOneTarget = oneToOneObservers.remove(Type, relationship.withOne);
                            entity.unobserve(observeOneToOneTarget, relationship.withOne);
                        }
                    });

                    oneToMany.forEach(function (key) {
                        var relationship = oneToManyRelationships.get(Type, key);
                        if (relationship.Type === Type) {
                            var observeOneToManySource = oneToManyObservers.remove(Type, relationship.hasMany);
                            entity.unobserve(observeOneToManySource, relationship.hasMany);

                            var arrayObserver = arrayObservers.remove(Type, relationship.hasMany);
                            entity[relationship.hasMany].unobserve(arrayObserver);

                        } else {
                            var observeOneToManyTarget = oneToManyObservers.remove(Type, relationship.hasOne);
                            entity.unobserve(observeOneToManyTarget, relationship.hasOne);
                        }
                    });

                    manyToMany.forEach(function (key) {
                        var relationship = manyToManyRelationships.get(Type, key);
                        if (relationship.Type === Type) {
                            var observeManyToManySource = manyToManyObservers.remove(Type, relationship.hasMany);
                            entity.unobserve(observeManyToManySource, relationship.hasMany);

                            var arrayObserver = arrayObservers.remove(Type, relationship.hasMany);
                            entity[relationship.hasMany].unobserve(arrayObserver);

                        } else {
                            var observeManyToManyTarget = manyToManyObservers.remove(Type, relationship.withMany);
                            entity.unobserve(observeManyToManyTarget, relationship.withMany);

                            var arrayObserver = arrayObservers.remove(Type, relationship.withMany);
                            entity[relationship.withMany].unobserve(arrayObserver);
                        }
                    });

                    var event = new BASE.ObservableEvent("untracked");
                    event.entity = entity;
                    self.notify(event);
                }
            };

            self.dependsOn = function (entity) {
                var dependsOn = [];
                if (entity) {
                    var Type = entity.constructor;

                    var oneToOne = oneToOneRelationships.hasKey(Type) ? oneToOneRelationships.get(Type).getKeys() : [];
                    var oneToMany = oneToManyRelationships.hasKey(Type) ? oneToManyRelationships.get(Type).getKeys() : [];

                    oneToOne.forEach(function (key) {
                        var relationship = oneToOneRelationships.get(Type, key);
                        if (relationship.ofType === Type && !relationship.optional) {
                            var source = entity[relationship.withOne];
                            if (source) {
                                dependsOn.push(source);
                            }
                        }
                    });

                    oneToMany.forEach(function (key) {
                        var relationship = oneToManyRelationships.get(Type, key);
                        if (relationship.ofType === Type && !relationship.optional) {
                            var source = entity[relationship.withOne];
                            if (source) {
                                dependsOn.push(source);
                            }
                        }
                    });

                }
                return dependsOn;
            };

            self.onEntityTracked = function (callback) {
                self.observe(callback, "tracked");
            };

            self.onEntityUntracked = function (callback) {
                self.observe(callback, "untracked");
            };

            self.removeOnEntityTracked = function (callback) {
                self.unobserve(callback, "tracked");
            };

            self.removeOnEntityUntracked = function (callback) {
                self.unobserve(callback, "untracked");
            };

            self.getOneToOneRelationships = function (Type) {
                return oneToOneRelationships.get(Type);
            }

            self.getOneToManyRelationships = function (Type) {
                return oneToManyRelationships.get(Type);
            }

            self.getManyToManyRelationships = function (Type) {
                return manyToManyRelationships.get(Type);
            }

        };

        BASE.extend(ObjectRelationManager, Super);

        return ObjectRelationManager;
    }(BASE.Observable));
});

/*
var relationships = {
    ManyToMany: [
        {
            Type: Person,
            hasKey: "id",
            hasForeignKey: "permissionId",
            hasMany: "permissions",
            ofType: Permission,
            withKey: "id",
            withForeignKey: "personId",
            withMany: "people",
            usingMappingType: PersonToPermission
        }
    ],
    OneToMany: [
        {
            Type: Application,
            hasKey: "id",
            hasMany: "permissions",
            ofType: Permission,
            withKey: "id",
            withForeignKey: "appId",
            withOne: "application",
            optional: false, // false is default
            cascadeDelete: false // false is default
        }
    ],
    OneToOne: [
        {
            Type: Person,
            hasKey: "id",
            hasOne: "ldapAccount",
            ofType: LdapAccount,
            withKey: "id",
            withForeignKey: "personId",
            withOne: "person"
        }
    ]
};
*/