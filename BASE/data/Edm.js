BASE.require([
    "BASE.collections.Hashmap",
    "Array.prototype.union",
    "Array.prototype.except"
], function () {
    
    BASE.namespace("BASE.data");
    
    var Hashmap = BASE.collections.Hashmap;
    var global = (function () { return this; }());
    
    global.Double = function () {
        Number.apply(this, arguments);
    };
    
    BASE.extend(Double, Number);
    
    global.Float = function () {
        Number.apply(this, arguments);
    };
    
    BASE.extend(Float, Number);
    
    global.Integer = function () {
        Number.apply(this, arguments);
    };
    
    BASE.extend(Integer, Number);
    
    global.Binary = function () {
        Number.apply(this, arguments);
    };
    
    BASE.extend(Binary, Number);
    
    global.Decimal = function () {
        Number.apply(this, arguments);
    };
    
    BASE.extend(Decimal, Number);
    
    global.Byte = function () {
        Number.apply(this, arguments);
    };
    
    BASE.extend(Byte, Number);
    
    global.DateTimeOffset = function () {
        Date.apply(this, arguments);
    };
    
    BASE.extend(DateTimeOffset, Date);
    
    var makeArray = function () { return []; };
    
    var primitives = new Hashmap();
    primitives.add(String, String);
    primitives.add(Number, Number);
    primitives.add(Boolean, Boolean);
    primitives.add(Date, Date);
    primitives.add(DateTimeOffset, DateTimeOffset);
    primitives.add(Double, Double);
    primitives.add(Float, Float);
    primitives.add(Integer, Integer);
    primitives.add(Decimal, Decimal);
    primitives.add(Binary, Binary);
    primitives.add(Byte, Byte);
    
    BASE.data.Edm = function () {
        var self = this;
        BASE.assertNotGlobal(self);
        
        var oneToOneRelationships = [];
        var oneToManyRelationships = [];
        var manyToManyRelationships = [];
        var mappingTypes = new Hashmap();
        
        var collectionToModels = new Hashmap();
        var typeToModels = new Hashmap();
        var originalModels = [];
        var localTypes = {};
        var hiddenTableCount = 0;
        
        var createDefaultProperties = function (Type) {
            
            var entity = new Type();
            var properties = {};
            
            Object.keys(entity).forEach(function (key) {
                properties[key] = {
                    type: undefined
                };
            });
            
            return properties;

        };
        
        var findAllBaseTypeModels = function (Type) {
            var matchedModels = [];
            var instance = new Type();
            var models = collectionToModels.getValues();
            
            models.forEach(function (model) {
                if (instance instanceof model.type) {
                    matchedModels.push(model);
                }
            });
            
            return matchedModels;
        };
        
        var getOneToOneRelationships = function (entity) {
            return oneToOneRelationships.filter(function (relationship) {
                if (entity instanceof relationship.type) {
                    return true;
                }
                return false;
            });
        };
        
        var getOneToOneAsTargetRelationships = function (entity) {
            return oneToOneRelationships.filter(function (relationship) {
                if (entity instanceof relationship.ofType) {
                    return true;
                }
                return false;
            });
        };
        
        var getOneToManyRelationships = function (entity) {
            return oneToManyRelationships.filter(function (relationship) {
                if (entity instanceof relationship.type) {
                    return true;
                }
                return false;
            });
        };
        
        var getOneToManyAsTargetRelationships = function (entity) {
            return oneToManyRelationships.filter(function (relationship) {
                if (entity instanceof relationship.ofType) {
                    return true;
                }
                return false;
            });
        };
        
        var getManyToManyRelationships = function (entity) {
            return manyToManyRelationships.filter(function (relationship) {
                if (entity instanceof relationship.type) {
                    return true;
                }
                return false;
            });
        };
        
        var getManyToManyAsTargetRelationships = function (entity) {
            return manyToManyRelationships.filter(function (relationship) {
                if (entity instanceof relationship.ofType) {
                    return true;
                }
                return false;
            });
        };
        
        var getManyToManyAsMappingRelationships = function (mappingEntity) {
            return manyToManyRelationships.filter(function (relationship) {
                if (mappingEntity instanceof relationship.usingMappingType) {
                    return true;
                }
                return false;
            });
        };
        
        var getSourceAndTargetsModel = function (relationship) {
            var sourceModel = typeToModels.get(relationship.type);
            var targetModel = typeToModels.get(relationship.ofType);
            
            if (!sourceModel) {
                throw new Error("Couldn't find model for source.");
            }
            
            if (!targetModel) {
                throw new Error("Couldn't find model for target.");
            }
            
            return {
                source: sourceModel,
                target: targetModel
            };
        };
        
        var addRelationalProperties = function (relationship) {
            var models = getSourceAndTargetsModel(relationship);
            
            addPrimaryKeyRelationship(models.source, relationship);
            addForeignKeyRelationship(models.target, relationship);
        };
        
        var addPrimaryKeyRelationship = function (model, relationship) {
            model.properties[relationship.hasKey].primaryKeyRelationships.push(relationship);
        };
        
        var addForeignKeyRelationship = function (model, relationship) {
            model.properties[relationship.withKey].foreignKeyRelationship = relationship;
            model.properties[relationship.withKey].primaryKeyRelationships.push(relationship);
        };
        
        var removePrimaryKeyRelationship = function (model, relationship) {
            var primaryKeyRelationships = models.source.properties[relationship.hasKey].primaryKeyRelationships;
            var index = primaryKeyRelationships.indexOf(relationship);
            
            if (index >= 0) {
                primaryKeyRelationships.splice(index, 1);
            }
        };
        
        var removeForeignKeyRelationship = function (model, relationship) {
            model.properties[relationship.withKey].foreignKeyRelationship = null;
        };
        
        var removeRelationalProperties = function (relationship) {
            var models = getSourceAndTargetsModel(relationship);
            removePrimaryKeyRelationship(models.source, relationship);
            removeForeignKeyRelationship(models.target, relationship);
        };
        
        var getPrimaryKeyProperties = function (model) {
            return Object.keys(model.properties).filter(function (key) {
                var property = model.properties[key];
                // primaryKey may be truthy or falsy, so we turn it into a bool.
                return property.primaryKey === true;
            });
        };
        
        var getAllKeyProperties = function (Type) {
            var properties = [];
            var entity = new Type();
            
            getOneToOneRelationships(entity).forEach(function (relationship) {
                properties.push(relationship.hasKey);
            });
            
            getOneToOneAsTargetRelationships(entity).forEach(function (relationship) {
                properties.push(relationship.withForeignKey);
            });
            
            getOneToManyRelationships(entity).forEach(function (relationship) {
                properties.push(relationship.hasKey);
            });
            
            getOneToManyAsTargetRelationships(entity).forEach(function (relationship) {
                properties.push(relationship.withForeignKey);
            });
            
            return properties;
        };
        
        self.addOneToOne = function (relationship) {
            oneToOneRelationships.push(relationship);
            
            var models = getSourceAndTargetsModel(relationship);
            var source = models.source;
            var target = models.target;
            
            source.properties[relationship.hasOne] = {
                type: Object
            };
            
            target.properties[relationship.withOne] = {
                type: Object
            };
            
            addRelationalProperties(relationship);
        };
        
        self.removeOneToOne = function (relationship) {
            removeRelationalProperties(relationship);
            
            var index = oneToOneRelationships.indexOf(relationship);
            if (index >= 0) {
                oneToOneRelationships.splice(index, 1);
            }
        };
        
        self.addOneToMany = function (relationship) {
            oneToManyRelationships.push(relationship);
            
            var models = getSourceAndTargetsModel(relationship);
            var source = models.source;
            var target = models.target;
            
            source.properties[relationship.hasMany] = {
                type: Array
            };
            
            target.properties[relationship.withOne] = {
                type: Object
            };
            
            addRelationalProperties(relationship);
        };
        
        self.removeOneToMany = function (relationship) {
            removeRelationalProperties(relationship);
            
            var index = oneToManyRelationships.indexOf(relationship);
            if (index >= 0) {
                oneToManyRelationships.splice(index, 1);
            }
        };
        
        self.addManyToMany = function (relationship) {
            var mappingType = relationship.usingMappingType;
            if (!mappingType) {
                throw new Error("Many to many relationship needs to supply the mapping Type.");
            } else {
                mappingTypes.add(mappingType, mappingType);
                manyToManyRelationships.push(relationship);
            }
            
            
            var models = getSourceAndTargetsModel(relationship);
            var mappingModel = typeToModels.get(relationship.usingMappingType);
            
            var source = models.source;
            var target = models.target;
            
            source.properties[relationship.hasMany] = {
                type: Array
            };
            
            target.properties[relationship.withMany] = {
                type: Array
            };
            
            models.source.properties[relationship.hasKey].primaryKeyRelationships.push(relationship);
            models.target.properties[relationship.withKey].primaryKeyRelationships.push(relationship);
            
            var sourceRelationship = {
                type: relationship.type,
                hasKey: relationship.hasKey,
                ofType: relationship.usingMappingType,
                withForeignKey: relationship.hasForeignKey
            };
            
            var targetRelationship = {
                type: relationship.ofType,
                hasKey: relationship.withKey,
                ofType: relationship.usingMappingType,
                withForeignKey: relationship.withForeignKey
            };
            
            mappingModel.properties[relationship.hasForeignKey].foreignKeyRelationship = sourceRelationship;
            mappingModel.properties[relationship.withForeignKey].foreignKeyRelationship = targetRelationship;
        };
        
        self.removeManyToMany = function (relationship) {
            var models = getSourceAndTargetsModel(relationship);
            var mappingModel = typeToModels.get(relationship.usingMappingType);
            var sourcePrimaryKeyRelationships = models.source.properties[relationship.hasKey].primaryKeyRelationships;
            var targetPrimaryKeyRelationships = models.target.properties[relationship.withKey].primaryKeyRelationships;
            
            var sourceIndex = sourcePrimaryKeyRelationships.indexOf(relationship);
            if (sourceIndex >= 0) {
                sourcePrimaryKeyRelationships.splice(sourceIndex, 1);
            }
            
            var targetIndex = targetPrimaryKeyRelationships.indexOf(relationship);
            if (targetIndex >= 0) {
                targetPrimaryKeyRelationships.splice(targetIndex, 1);
            }
            
            mappingModel.properties[relationship.hasForeignKey].foreignKeyRelationship = null;
            mappingModel.properties[relationship.withForeignKey].foreignKeyRelationship = null;
            
            var index = manyToManyRelationships.indexOf(relationship);
            if (index >= 0) {
                manyToManyRelationships.splice(index, 1);
                var mappingType = relationship.usingMappingType;
                mappingTypes.remove(mappingType);
            }
        };
        
        self.getOneToOneRelationships = getOneToOneRelationships;
        self.getOneToManyRelationships = getOneToManyRelationships;
        self.getManyToManyRelationships = getManyToManyRelationships;
        self.getOneToOneAsTargetRelationships = getOneToOneAsTargetRelationships;
        self.getOneToManyAsTargetRelationships = getOneToManyAsTargetRelationships;
        self.getManyToManyAsTargetRelationships = getManyToManyAsTargetRelationships;
        self.getManyToManyAsMappingRelationships = getManyToManyAsMappingRelationships;
        
        self.getMappingTypes = function () {
            return mappingTypes.copy();
        };
        
        self.getAllModels = function (Type) {
            var models = [];
            var instance = new Type();
            
            typeToModels.getKeys().forEach(function (T) {
                if (instance instanceof T) {
                    models.push(typeToModels.get(T));
                }
            });
            
            return models;
        };
        
        self.getPrimaryKeyProperties = function (Type) {
            var model = self.getModelByType(Type);
            return getPrimaryKeyProperties(model);
        };
        
        self.getAllKeyProperties = getAllKeyProperties;
        
        self.createModel = function (config) {
            config = config || {};
            var properties = config.properties || {};
            var BaseType = config.baseType;
            
            var Type = function () {
                var self = this;
                
                if (typeof BaseType === "function") {
                    BaseType.call(self);
                }
                
                Object.keys(properties).forEach(function (key) {
                    var property = properties[key];
                    
                    if (property.type === Array) {
                        property.nullable = false;
                        property.defaultValue = makeArray;
                    }
                    
                    if (property.nullable === false) {
                        if (typeof property.defaultValue === "undefined") {
                            throw new Error("Property \"" + key + "\" can't be nullable and now default value given");
                        }
                        
                        if (typeof property.defaultValue === "function") {
                            self[key] = property.defaultValue();
                        } else {
                            self[key] = property.defaultValue;
                        }
                    } else {
                        self[key] = null;
                    }

                });
            };
            
            config.type = Type;
            BASE.extend(Type, BaseType || Object);
            
            self.addModel(config);
            
            return Type;

        };
        
        self.addModel = function (config) {
            config = config || {};
            var collectionName = config.collectionName;
            var Type = config.type;
            var BaseType = config.baseType || null;
            var properties = config.properties = config.properties || {};
            var baseModel = null;
            var baseProperties = {};
            
            if (!collectionName) {
                collectionName = "hidden_table_" + hiddenTableCount;
                hiddenTableCount++;
            }
            
            if (collectionName.match(/\s/) !== null) {
                throw new Error("The collectionName cannot have spaces.");
            }
            
            if (typeof Type !== "function") {
                throw new Error("Expected a constructor in the configurations object.");
            }
            
            originalModels.push(BASE.clone(config, true));
            
            if (BaseType !== null) {
                var baseModels = findAllBaseTypeModels(BaseType);
                baseModels.forEach(function (baseModel) {
                    Object.keys(baseModel.properties).forEach(function (key) {
                        baseProperties[key] = baseModel.properties[key];
                    });
                });
            }
            
            var defaultProperties = createDefaultProperties(Type);
            var keys = Object.keys(properties).union(Object.keys(defaultProperties).union(Object.keys(baseProperties)));
            
            keys.forEach(function (key) {
                if (baseProperties[key] && !properties[key]) {
                    properties[key] = BASE.clone(baseProperties[key]);
                }
                
                if (!properties[key]) {
                    properties[key] = defaultProperties[key];
                }
                
                properties[key].primaryKeyRelationships = [];
                properties[key].foreignKeyRelationship = null;
            });
            
            collectionToModels.add(collectionName, config);
            typeToModels.add(Type, config);

        };
        
        self.removeModel = function (collectionName) {
            var model = collectionToModels.remove(collectionName);
            typeToModels.remove(model.type);
        };
        
        self.getModel = function (collectionName) {
            return collectionToModels.get(collectionName);
        };
        
        self.getModels = function () {
            return collectionToModels.copy();
        };
        
        self.getModelByType = function (Type) {
            return typeToModels.get(Type);
        };
        
        self.getPrimitiveTypes = function () {
            return primitives.copy();
        };
        
        self.clone = function () {
            var edm = new Edm();
            
            var models = BASE.clone(originalModels, true);
            models.forEach(function (model) {
                edm.addModel(model);
            });
            
            oneToOneRelationships.forEach(function (relationship) {
                edm.addOneToOne(BASE.clone(relationship, true));
            });
            
            oneToManyRelationships.forEach(function (relationship) {
                edm.addOneToMany(BASE.clone(relationship, true));
            });
            
            manyToManyRelationships.forEach(function (relationship) {
                edm.addManyToMany(BASE.clone(relationship, true));
            });
            
            return edm;
        };

    };

});