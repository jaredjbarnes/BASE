BASE.require([
    "BASE.query.ArrayProvider",
    "BASE.query.Queryable"
], function () {
    var ArrayProvider = BASE.query.ArrayProvider;
    var Queryable = BASE.query.Queryable;

    var _asQueryable = function (Type) {
        var self = this;
        Type = Type || self.Type;
        var queryable = new Queryable(Type || Object);
        queryable.provider = self.providerFactory();
        return queryable;
    };

    var _providerFactory = function () {
        var self = this;
        return new ArrayProvider(self);
    };

    Object.defineProperties(Array.prototype, {
        "providerFactory": {
            configurable: true,
            enumerable: false,
            value: _providerFactory
        },
        "asQueryable": {
            enumerable: false,
            value: _asQueryable
        }
    });
});


