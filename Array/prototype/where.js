BASE.require(["BASE.query.ArrayQuery"], function () {
    Object.defineProperties(Array.prototype, {
        "where": {
            enumerable: false,
            configurable: false,
            value:function (Type, filter) {
                var self = this;
                var query = new BASE.query.ArrayQuery(filter);
                return query.run(Type, self);
            }
        }
    });
});