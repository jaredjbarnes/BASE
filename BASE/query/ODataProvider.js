BASE.require([
    "BASE.query.Provider",
    "BASE.query.ODataInterpreter",
], function () {
    BASE.namespace("BASE.query");

    BASE.query.ODataProvider = (function (Super) {
        var ODataProvider = function (Type) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ODataProvider(Type);
            }

            Super.call(self, Type);
            self.createInterpreter = function () {
                return new BASE.query.ODataInterpreter();
            };
        };

        BASE.extend(ODataProvider, Super);

        return ODataProvider;
    }(BASE.query.Provider));

});