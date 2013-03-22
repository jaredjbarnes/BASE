BASE.require([
    "BASE.query.Provider",
    "BASE.query.ArrayQueryBuilder"
], function () {
    BASE.namespace("LEAVITT.query");

    BASE.query.ArrayProvider = (function (Super) {
        var ArrayProvider = function (Type, array) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ArrayProvider(Type, array);
            }

            Super.call(self, Type);
            self.createQueryBuilder = function () {
                return new BASE.query.ArrayQueryBuilder(array);
            };
            
        };

        BASE.extend(ArrayProvider, Super);

        return ArrayProvider;
    }(BASE.query.Provider));

});