BASE.require([
    "BASE.collections.Hashmap",
    "Array.prototype.union"
    ], function () {
    
    BASE.namespace("BASE.data");
    
    var Hashmap = BASE.collections.Hashmap;
    var global = (function () { return this; }());
    
    Double = function () {
        Number.apply(this, arguments);
    };
    
    BASE.extend(Double, Number);
    
    Float = function () {
        Number.apply(this, arguments);
    };
    
    BASE.extend(Float, Number);
    
    Integer = function () {
        Number.apply(this, arguments);
    };
    
    BASE.extend(Integer, Number);
    
    Binary = function () {
        Number.apply(this, arguments);
    };
    
    BASE.extend(Binary, Number);
    
    Decimal = function () {
        Number.apply(this, arguments);
    };
    
    BASE.extend(Decimal, Number);
    
    Byte = function () {
        Number.apply(this, arguments);
    };
    
    BASE.extend(Byte, Number);
    
    BASE.data.Edm = function () {
        var self = this;
        BASE.assertNotGlobal(self);
        
        var oneToOneRelationships = [];
        var oneToManyRelationships = [];
        var manyToManyRelationships = [];
        var mappingTypes = new Hashmap();
        
        var collectionToModels = new Hashmap();
        var typeToModels = new Hashmap();
        
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
        
        self.addOneToOne = function (relationship) {
            oneToOneRelationships.push(relationship);
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
        
        self.getMappingTypes = function () {
            return mappingTypes.copy();
        };
        
        var getPrimaryKeyProperties = function (model) {
            return Object.keys(model.properties).filter(function (key) {
                var property = model.properties[key];
                // primaryKey may be undefined, so we turn it into a bool.
                return property.primaryKey === true;
            });
        };
        
        var joinModels = function (Type) {
            var model = BASE.clone(typeToModels.get(Type));
            if (model !== null) {
                
                var Type = model.type;
                var models = self.getAllModels(Type);
                
                models.forEach(function (m) {
                    Object.keys(m.properties).forEach(function (key) {
                        model.properties[key] = m.properties[key];
                    });
                });
                
                if (getPrimaryKeyProperties(model).length === 0) {
                    throw new Error("The Model with collection name \"" + model.collectionName + "\" needs at least one primary key.");
                }
                
                return model;
            } else {
                return null;
            }
            
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
        
        self.addModel = function (config) {
            config = config || {};
            var collectionName = config.collectionName;
            var Type = config.type;
            var properties = config.properties = config.properties || {};
            
            
            if (!collectionName) {
                throw new Error("Expected a collection name.");
            }
            
            if (collectionName.match(/\s/) !== null) {
                throw new Error("The collectionName cannot have spaces.");
            }
            
            if (typeof Type !== "function") {
                throw new Error("Expected a constructor in the configurations object.");
            }
            
            var defaultProperties = createDefaultProperties(Type);
            var keys = Object.keys(defaultProperties).union(Object.keys(config.properties));
            
            keys.forEach(function (key) {
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
            var model = collectionToModels.get(collectionName);
            
            if (model !== null) {
                return joinModels(model.type);
            } else {
                return null;
            }
            
        };
        
        self.getModels = function () {
            return collectionToModels.copy();
        };
        
        self.getModelByType = function (Type) {
            return joinModels(Type);
        };

    };

});