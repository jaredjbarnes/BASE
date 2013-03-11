BASE.require([
    "BASE.query.Provider",
    "BASE.query.ArrayInterpreter"
], function () {
    BASE.namespace("LEAVITT.query");

    BASE.query.ArrayProvider = (function (Super) {
        var ArrayProvider = function (Type, array) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ArrayProvider(Type, array);
            }

            Super.call(self, Type);
            self.createInterpreter = function () {
                return new BASE.query.ArrayInterpreter(array);
            };
            
        };

        BASE.extend(ArrayProvider, Super);

        return ArrayProvider;
    }(BASE.query.Provider));

});