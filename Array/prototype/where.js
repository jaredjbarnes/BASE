﻿
BASE.require([
    "BASE.query.ArrayProvider",
    "BASE.query.Queryable"
], function () {
    var ArrayProvider = BASE.query.ArrayProvider;
    var Queryable = BASE.query.Queryable;

    var _where = function (Type, expression) {
        var self = this;
        if (arguments.length < 2) {
            Type = Object;
        }

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