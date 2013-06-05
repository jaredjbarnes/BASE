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

            var _queryable = null;
            Object.defineProperty(self, "queryable", {
                get: function () {
                    return _queryable;
                },
                set: function (value) {
                    var oldValue = _queryable;
                    if (value !== _queryable) {
                        if (_queryable && _queryable.provider === self) {
                            _queryable.provider = null;
                        }

                        _queryable = value;
                        _queryable.provider = self;
                    }
                }
            });

            //This should always return a Future of an array of objects.
            self.execute = function (filter) {
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