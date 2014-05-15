BASE.require([
    "BASE.query.ArrayProvider",
    "BASE.query.Queryable",
    "BASE.behaviors.collections.ObservableArray"
], function () {
    var ArrayProvider = BASE.query.ArrayProvider;
    var Queryable = BASE.query.Queryable;

    var _asQueryable = function (Type) {
        var self = this;
        Type = Type || self.Type;
        var queryable = new Queryable(Type || Object);
        queryable.provider = self.getProviderFactory();
        return queryable;
    };

    var _providerFactory = function () {
        var self = this;
        return new ArrayProvider(self);
    };

    Array.prototype.getProviderFactory = _providerFactory;
    Array.prototype.asQueryable = _asQueryable;
});
