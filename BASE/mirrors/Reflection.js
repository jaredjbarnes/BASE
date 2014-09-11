BASE.require([
    "BASE.mirrors.Mirror"
], function () {
    
    BASE.namespace("BASE.mirrors");
    
    BASE.mirrors.Reflection = function (mirror) {
        /// <summary></summary>
        /// <param type="BASE.mirrors.Mirror" name="mirror">The mirror to reflect off.</param>
        var self = this;
        
        self.getNamespace = function () {
            return mirror.getType().getNamespace();
        };
        
        self.getType = function () {
            /// <summary>Returns the runtime Type of the mirror. It will return null if there isn't a match running in the current runtime.</summary>
            /// <returns type="Function" />
            return mirror.getType().getType();
        };
        
        self.getProperties = function () {
            /// <summary>Returns a key/value pair of the properties on the mirror.</summary>
            var result = {};
            mirror.getPropertyNames().forEach(function (name) {
                result[name] = mirror.getProperty(name);
            });
            
            return result;
        };
        
        self.getMethods = function () {
            /// <summary>Returns a key/value pair of the methods on the mirror.</summary>
            var result = {};
            mirror.getMethodNames().forEach(function (name) {
                result[name] = mirror.getMethod(name);
            });
            
            return result;
        };
    };

});