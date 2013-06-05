BASE.require(["BASE.Observable", "BASE.query.Queryable", "BASE.query.ExpressionBuilder", "BASE.query.ExpressionParser"], function () {
    BASE.namespace("BASE.query");

    BASE.query.Query = (function () {
        var Query = function (filter, builder, queryable) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Query(filter);
            }

            var _builder = builder;
            var _queryable = queryable;

            Object.defineProperties(self, {
                builder: {
                    get: function () {
                        return _builder;
                    },
                    set: function (builder) {
                        _builder = builder;
                    }
                },
                queryable: {
                    get: function () {
                        return _queryable;
                    },
                    set: function (queryable) {
                        _queryable = queryable;
                    }
                }
            });

            self.run = function (Type) {
                try {
                    filter.call(self.queryable, self.builder);
                } catch (e) {
                    throw new Error("Invalid where clause.");
                }

                return queryable;
            };

        };

        return Query;
    }());

});