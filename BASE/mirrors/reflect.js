BASE.require([
    "BASE.collections.Hashmap",
    "BASE.mirrors.Reflection",
    "BASE.mirrors.Mirror"
], function () {

    BASE.namespace("BASE.mirrors");

    var Hashmap = BASE.collections.Hashmap;
    var Reflection = BASE.mirrors.Reflection;
    var registeredMirrors = new Hashmap();
    var registeredRuntimeMirrors = new Hashmap();

    BASE.mirrors.reflect = function (obj) {
        var mirror = registeredRuntimeMirrors.get(obj.constructor);

        if (mirror === null) {
            throw new Error("Couldn't find mirror of object.");
        }

        return new Reflection(mirror);
    };

    BASE.mirrors.reflect.register = function (mirror) {
        /// <summary>Register a mirror to represent a type of object.</summary>
        /// <param name="mirror" type="BASE.mirrors.Mirror" />

        var namespace = mirror.getType().getNamespace();
        var Type = mirror.getType().getType();

        if (Type !== null) {
            registeredRuntimeMirrors.add(Type, mirror);
        }

        registeredMirrors.add(namespace, mirror);
    };

});