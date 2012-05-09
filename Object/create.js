if (!Object.hasOwnProperty("create")) {
    Object.create = function (object, properties) {
        var result;
        var x;
        function F() { }
        F.prototype = object;
        result = new F();

        if (Object.defineProperties && properties) {
            Object.defineProperties(result, properties);
        } else if (properties) {
            for (var p in properties) {
                if (properties.hasOwnProperty(p)) {
                    result[p] = properties[p];
                }
            }
        }

        return result;
    };
}