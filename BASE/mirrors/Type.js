BASE.namespace("BASE.mirrors");

BASE.mirrors.Type = function (typeString) {
    /// <summary>
    ///     This creates a Mirror Type representing a real Type. In order to be able to 
    ///     represent types that aren't loaded yet we use String based namespaces.
    /// </summary>
    /// <param type="String" name="typeString" />
    var self = this;

    self.getTypeString = function () {
        /// <summary>Returns the namespace as a string.</summary>
        /// <returns type="String" />
        return typeString;
    };

    self.getRuntimeType = function () {
        /// <summary>Returns the constructor.</summary>
        /// <returns type="Function" />
        return BASE.getObject(typeString) || null;
    };
};

