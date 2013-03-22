BASE.require(["BASE.query.ArrayProvider"], function () {
    Object.defineProperties(Array.prototype, {
        "where": {
            enumerable: false,
            configurable: false,
            value: function (Type, filter) {
                var self = this;
                var provider = new BASE.query.ArrayProvider(Type, self);
                var providerResults = provider.execute(filter);

                return providerResults.queryBuilder.filteredArray;
            }
        }
    });
});