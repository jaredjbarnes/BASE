BASE.require(["BASE.query.Queryable"], function () {

    BASE.namespace("BASE.data");

    var Queryable = BASE.query.Queryable;

    BASE.data.DataSet = function (Type, dataContext) {
        var self = this;

        BASE.assertNotGlobal(self);

        Queryable.apply(self, [Type]);

        var observer = dataContext.observe().filter(function (e) {
            return e.Type === Type;
        });

        var provider = dataContext.getQueryProvider(Type);
        self.provider = provider;

        self.add = function (entity) {
            return dataContext.addEntity(entity);
        };

        self.remove = function (entity) {
            return dataContext.removeEntity(entity);
        };

        self.load = function (entity) {
            return dataContext.loadEntity(entity);
        };

        self.createInstance = function () {
            var entity = new Type();
            dataContext.addEntity(entity);

            return entity;
        };

        self.observe = function () {
            return observer.copy();
        }

    };

});