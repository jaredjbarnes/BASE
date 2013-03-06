BASE.require(["BASE.ArrayQuery"], function () {
    Object.defineProperties(Array.prototype, {
        "where": {
            enumerable: false,
            configurable: false,
            value:function (Type, filter) {
                var self = this;
                var query = new BASE.ArrayQuery(filter);
                return query.run(Type, self);
            }
        }
    });
});