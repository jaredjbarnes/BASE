if (!Object.hasOwnProperty("create")) {
    Object.create = function (object, properties) {
        var result;
        var x;
        function F() { }
        F.prototype = object;
        result = new F();

        if (properties) {
            Object.defineProperties(result, properties);
        }

        return result;
    };
}