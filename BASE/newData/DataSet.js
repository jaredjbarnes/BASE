BASE.require([], function () {

    BASE.namespace("BASE.data");

    BASE.data.DataSet = function (Type, dataContext) {
        var self = this;


        self.add = function () { };
        self.remove = function () { };
        self.load = function () { };

        self.createInstance = function () {
            var entity = new Type();
            dataContext.addEntity(entity);

            return entity;
        };

        self.asQueryable = function () { };

    };

});