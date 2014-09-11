BASE.namespace("BASE.mirrors");

BASE.mirrors.Type = function (namespaceOrType) {
    /// <summary>
    ///     This creates a Mirror Type representing a real Type. In order to be able to 
    ///     represent types that aren't loaded yet we use String based namespaces.
    /// </summary>
    /// <param type="String" name="namespace" />
    var self = this;
    var namespace;
    var Type;
    
    if (typeof namespaceOrType === "string") {
        namespace = namespaceOrType;
    }
    
    if (typeof namespaceOrType === "function") {
        Type = namespaceOrType;
    }
    
    
    self.getNamespace = function () {
        /// <summary>Returns the namespace as a string.</summary>
        /// <returns type="String" />
        return namespace;
    };
    
    self.getType = function () {
        /// <summary>Returns the constructor.</summary>
        /// <returns type="Function" />
        if (namespace) {
            return BASE.getObject(namespace);
        } else {
            return Type;
        }
    };
    
};

