BASE.require([
    "BASE.query.ArrayProvider",
    "BASE.query.Queryable"
], function () {
    var ArrayProvider = BASE.query.ArrayProvider;
    var Queryable = BASE.query.Queryable;

    // Type is the constructor of a Class, or object mirror.
    // expression is a function expression.
    // Provider is opitional, and will us
    var _where = function (Type, expression, Provider) {
        var self = this;
        var queryable = new Queryable(Type).where(expression);
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
        "where": {
            enumerable: false,
            value: _where
        }
    });
});