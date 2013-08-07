BASE.namespace("BASE.util");

BASE.util.NullObject = (function (Super) {
    var NullObject = function (Type) {
        var self = this;
        if (!(self instanceof arguments.callee)) {
            return new NullObject();
        }

        Super.call(self);
        var instance = new Type();
        for (var key in instance) (function (key) {
            if (typeof instance[key] === "function") {
                self[key] = function () { };
            } else {
                self[key] = instance[key];
            }
        }(key));

        return self;
    };

    BASE.extend(NullObject, Super);

    return NullObject;
}(Object));
