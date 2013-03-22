BASE.require([
    "BASE.query.Provider",
    "BASE.query.ODataQueryBuilder",
], function () {
    BASE.namespace("BASE.query");

    BASE.query.ODataProvider = (function (Super) {
        var ODataProvider = function (Type) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ODataProvider(Type);
            }

            Super.call(self, Type);
            self.createQueryBuilder = function () {
                return new BASE.query.ODataQueryBuilder();
            };
        };

        BASE.extend(ODataProvider, Super);

        return ODataProvider;
    }(BASE.query.Provider));

});