BASE.require([
    "BASE.collections.MultiKeyMap",
    "BASE.collections.Hashmap",
    "BASE.util.ObservableEvent",
    "BASE.util.Observable",
    "BASE.data.inflection"
], function () {
    BASE.namespace("BASE.data");

    var inflection = BASE.data.inflection;
    var Hashmap = BASE.collections.Hashmap;

    var capitalizeFirstLetter = function (word) {
        return word.substr(0, 1).toUpperCase() + word.substr(1);
    };

    BASE.data.ObjectRelationManager = (function (Super) {

        var ObjectRelationManager = function (relationships) {

            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ObjectRelationManager(relationships);
            }

            Super.call(self);

            // We store all the relationships in these maps.
            var _oneToOneRelationships = new BASE.collections.MultiKeyMap();
            var _oneToManyRelationships = new BASE.collections.MultiKeyMap();
            var _manyToManyRelationships = new BASE.collections.MultiKeyMap();

            // We store all the relationships here from the perspective of the targets.
            var _oneToOneTargetRelationships = new BASE.collections.MultiKeyMap();
            var _oneToManyTargetRelationships = new BASE.collections.MultiKeyMap();
            var _manyToManyTargetRelationships = new BASE.collections.MultiKeyMap();

            // We store the dependency properties of a Type in this map.
            var _dependsOn = new BASE.collections.MultiKeyMap();

            (function (relationships) {
                var oneToOne = relationships.oneToOne || [];
                var oneToMany = relationships.oneToMany || [];
                var manyToMany = relationships.manyToMany || [];

                oneToOne.forEach(function (relationship) {
                    // Add to the relationship map.
                    _oneToOneRelationships.add(relationship.type, relationship.hasOne, relationship);

                    // Add relationship from targets perspective.
                    _oneToOneTargetRelationships.add(relationship.ofType, relationship.withOne, relationship);

                    // Add dependency property
                    _dependsOn.add(relationship.ofType, relationship.withOne, relationship);
                });

                // Since we accept many to many, we need to make real one to many relationships from the many to many.
                // This is why we run many to many before one to many.
                manyToMany.forEach(function (relationship) {
                    // We singularize the property names so we can use them as the property name on the mapping type.
                    var sourceProperty = inflection.singularize(relationship.withMany);
                    var targetProperty = inflection.singularize(relationship.hasMany);

                    // We create a mapping property name from the other two names.
                    var mappingProperty = inflection.pluralize(sourceProperty + "To" + capitalizeFirstLetter(targetProperty));
                    var MappingType = relationship.usingMappingType;

                    // Just creating two relationships that represented the many to many.
                    var oneToManySource = {
                        type: relationship.type,
                        hasKey: relationship.hasKey,
                        hasMany: mappingProperty,
                        ofType: MappingType,
                        withKey: "id",
                        withForeignKey: relationship.withForeignKey,
                        withOne: sourceProperty
                    };

                    var oneToManyTarget = {
                        type: relationship.ofType,
                        hasKey: relationship.withKey,
                        hasMany: mappingProperty,
                        ofType: MappingType,
                        withKey: "id",
                        withForeignKey: relationship.hasForeignKey,
                        withOne: targetProperty
                    };

                    // Assign the new relationship to the many to many relatioship for ease of use.
                    // The EntityRelationManager will use this.
                    relationship.sourceMappingRelationship = oneToManySource;
                    relationship.targetMappingRelationship = oneToManyTarget;

                    // Add relationship to the one to many.
                    oneToMany.push(oneToManySource);
                    oneToMany.push(oneToManyTarget);

                    // Add the many to many relationships..
                    _manyToManyRelationships.add(relationship.type, relationship.hasMany, relationship);

                    // Add the many to many relationships from targets perspective.
                    _manyToManyTargetRelationships.add(relationship.ofType, relationship.withMany, relationship);

                });

                // Now that we have all the relationships iterate through the one to many, and add them.
                oneToMany.forEach(function (relationship) {
                    _oneToManyRelationships.add(relationship.type, relationship.hasMany, relationship);

                    // Add the one to many relationships from targets perspective.
                    _oneToManyTargetRelationships.add(relationship.ofType, relationship.withOne, relationship);

                    // Add dependency property
                    _dependsOn.add(relationship.ofType, relationship.withOne, relationship);
                });

            }(relationships));

            Object.defineProperties(self, {
                oneToOne: {
                    enumerable: false,
                    configurable: false,
                    value: _oneToOneRelationships
                },
                oneToMany: {
                    enumerable: false,
                    configurable: false,
                    value: _oneToManyRelationships
                },
                manyToMany: {
                    enumerable: false,
                    configurable: false,
                    value: _manyToManyRelationships
                },
                oneToOneAsTargets: {
                    enumerable: false,
                    configurable: false,
                    value: _oneToOneTargetRelationships
                },
                oneToManyAsTargets: {
                    enumerable: false,
                    configurable: false,
                    value: _oneToManyTargetRelationships
                },
                manyToManyAsTargets: {
                    enumerable: false,
                    configurable: false,
                    value: _manyToManyTargetRelationships
                },
                relationships: {
                    get: function () {
                        return relationships;
                    }
                }
            });

            // This method allows you to send an entity, and it will return which entities,
            // need to be saved before this entity can be.
            self.dependsOn = function (entity) {
                var dependsOn = [];
                if (entity) {
                    var Type = entity.constructor;
                    var dependencies = _dependsOn.get(Type) || new Hashmap();

                    dependencies.getKeys().forEach(function (property) {
                        var relationship = dependencies.get(property);
                        var source = entity[property];
                        // We need to make sure that the relationship isn't optional.
                        // Before stating that it's dependent.
                        if (source && !relationship.optional) {
                            dependsOn.push(source);
                        }

                    });

                }
                return dependsOn;
            };

        };

        BASE.extend(ObjectRelationManager, Super);

        return ObjectRelationManager;
    }(BASE.util.Observable));
});

/*
var relationships = {
    ManyToMany: [
        {
            type: Person,
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
            type: Application,
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
            type: Person,
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