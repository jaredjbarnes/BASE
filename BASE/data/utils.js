BASE.require([
    "BASE.collections.MultiKeyMap"
], function () {
    
    BASE.namespace("BASE.data");
    
    var MultiKeyMap = BASE.collections.MultiKeyMap;
    
    BASE.data.utils = {
        isPrimitive: function (value) {
            
            if (typeof value === "number" ||
                typeof value === "string" ||
                typeof value === "boolean" ||
                value instanceof Date ||
                value === null ||
                typeof value === "undefined") {
                
                return true;

            }
            
            return false;
        }
    };

});