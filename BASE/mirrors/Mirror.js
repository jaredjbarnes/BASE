BASE.require([
    "BASE.mirrors.Type"
], function () {
    
    BASE.namespace("BASE.mirrors");
    
    var MirrorType = BASE.mirrors.Type;
    
    var isMirrorType = function (mirrorType) {
        return mirrorType instanceof MirrorType;
    };
    
    var assertMirrorType = function (mirrorType) {
        if (!isMirrorType(mirrorType)) {
            throw new Error("Expected a Mirror Type.");
        }
    };
    
    var assertArrayOfMirrorTypes = function (array) {
        if (array.every(function (mirrorType) {
            return isMirrorType(mirrorType);
        })) {
            throw new Error("Expected an Array of Mirror Types.");
        }
    };
    
    var DefaultProperty = function () {
        /// <summary ></summary>
        /// <field name="type" type="BASE.mirrors.Type"></field>
        /// <field name="length" type="Number" ></field>
        /// <field name="nullable" type="Boolean"></field>
        /// <field name="defaultValue" type="Object"></field>
        var self = this;
        
        self.storeType = null;
        self.length = Infinity;
        self.nullable = true;
        self.defaultValue = null;
    };
    
    var DefaultMethodSignature = function () {
        /// <summary ></summary>
        /// <field name="parameters" type="Array" elementType="BASE.mirrors.Type"></field>
        /// <field name="arity" type="Number" ></field>
        /// <field name="returnType" type="BASE.mirrors.Type"></field>
        var self = this;
        
        self.returnType = undefined;
        self.arity = Infinity;
        self.parameters = null;
    };
    
    BASE.mirrors.Mirror = function (mirrorType, baseMirrorType) {
        /// <summary>
        ///     This is used to make a mirror for an object.
        ///     Example: new BASE.mirrors.Mirror(new BASE.mirrors.Type("Car"));
        /// </summary>
        /// <param name="mirrorType" type="BASE.mirrors.Type">The mirror Type being defined.</param>
        var self = this;
        var allProperties = {};
        var allMethods = {};
        
        if (typeof mirrorType === "string") {
            mirrorType = new MirrorType(mirrorType);
        }
        
        if (!mirrorType) {
            throw new Error("Invalid mirror type.");
        }
        
        if (typeof baseMirrorType === "string") {
            baseMirrorType = new MirrorType(baseMirrorType);
        }
        
        if (typeof baseMirrorType === "undefined") {
            baseMirrorType = new MirrorType("Object");
        }
        
        self.defineProperty = function (name, properties) {
            /// <summary>
            ///     Defines a property on this type.
            /// </summary>
            /// <param type="String" name="name">The name of the property.</param>
            /// <param type="BASE.mirrors.Mirror.DefaultProperty" name="properties"></param>
            
            properties = properties || {};
            
            if (typeof properties.storeType === "string") {
                properties.storeType = new MirrorType(properties.storeType);
            }
            
            properties.storeType = properties.storeType || new MirrorType("Object");
            properties.length = typeof properties.length === "number" ? properties.length : Infinity;
            properties.nullable = typeof properties.nullable === "boolean" ? properties.nullable : true;
            
            if (!properties.nullable && typeof properties.defaultValue === "undefined") {
                throw new Error("If the property isn't nullable then you need to specify a default value.");
            }
            
            if (properties.nullable) {
                properties.defaultValue = null;
            }
            
            assertMirrorType(properties.storeType);
            allProperties[name] = properties;
        };
        
        self.defineProperties = function (properties) {
            /// <summary>
            ///     Defines a multiple properties on this type.
            /// </summary>
            /// <param type="Object" name="properties">Key/Value pair of properties. See defineProperty to see</param>
            
            Object.keys(properties).forEach(function (key) {
                self.defineProperty(key, properties[key]);
            })
        };
        
        self.getProperty = function (name) {
            /// <summary>
            ///     Gets the definition of a property.
            /// </summary>
            /// <param name="name" type="String">Property name.</param>
            /// <returns type="BASE.mirrors.Mirror.DefaultProperty" />
            
            var properties = allProperties[name];
            
            if (properties) {
                return BASE.clone(properties, true);
            } else {
                return null;
            }

        };
        
        self.getPropertyNames = function () {
            /// <summary>Returns all the method names found on the mirror.</summary>
            /// <returns type="Array" elementType="String" />
            return Object.keys(allProperties);
        };
        
        self.defineMethod = function (name, properties) {
            /// <summary>
            ///     Defines a method signature.
            /// </summary>
            /// <params name="name" type="String"></params>
            /// <params name="properties" type="BASE.mirrors.Mirror.DefaultMethodSignature"></params>
            
            properies.arity = typeof properties.arity === "number" ? properties.arity : Infinity;
            assertArrayOfMirrorTypes(properties.parameters);
            
            if (!isMirrorType(properties.returnType) && typeof properties !== "undefined") {
                throw new Error("Expected either a Mirror Type or undefined.");
            }
            
            allMethods[name] = properties;
        };
        
        self.defineMethods = function (methods) {
            /// <summary>
            ///     Defines mutliple method signatures.
            ///     Look at defineMethod to see what is expected to define a method signature.
            /// </summary>
            /// <params name="methods" type="Object">Key/Value pair of method signatures.</params>
            
            Object.keys(methods).forEach(function (key) {
                self.defineMethod(key, properties[key]);
            });
        };
        
        self.getMethod = function (name) {
            /// <summary>
            ///     Returns the method signature assigned to this Mirror with the provided name.
            /// </summary>
            /// <returns type="BASE.mirrors.Mirror.DefaultMethodSignature" />
            var methods = allMethods[name];
            
            if (methods) {
                return BASE.clone(methods, true);
            } else {
                return null;
            }
        };
        
        self.getMethodNames = function () {
            /// <summary>Returns all the method names found on the mirror.</summary>
            /// <returns type="Array" elementType="String" />
            return Object.keys(allMethods);
        };
        
        self.getType = function () {
            /// <summary>Returns the BASE.mirrors.Type that this mirror represents.</summary>
            /// <returns type="BASE.mirrors.Type" />
            return mirrorType;
        };
        
        self.getNamespace = function () {
            return mirrorType.getNamespace();
        };
        
        self.getBaseType = function () {
            return baseMirrorType;
        }

    };
    
    BASE.mirrors.Mirror.DefaultProperty = DefaultProperty;
    BASE.mirrors.Mirror.DefaultMethodSignature = DefaultMethodSignature;

});