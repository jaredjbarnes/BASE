BASE.require([
    "BASE.Future"
], function () {
    BASE.namespace("BASE.query");

    BASE.query.Provider = (function (Super) {
        var Provider = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Provider();
            }

            Super.call(self);

            //This should always return a Future of an array of objects.
            self.execute = function (queryable) {
                return new BASE.Future(function (setValue, setError) {
                    setTimeout(function () {
                        setValue([]);
                    }, 0);
                });
            };
        };

        BASE.extend(Provider, Super);

        return Provider;
    }(Object));

});