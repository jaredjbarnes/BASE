BASE.require([
    "BASE.data.DataContext",
    "LG.core.dataModel.testing.Fruit",
    "LG.core.dataModel.testing.Pesticide",
    "LG.core.dataModel.testing.Basket",
    "LG.core.dataModel.testing.FruitShape",
    "LG.core.dataModel.testing.FruitMold",
    "LG.core.dataModel.testing.Service",
    "LG.core.dataModel.testing.FruitToPesticide"
], function () {

    BASE.namespace("LG.core.dataModel.testing");

    var DataSet = BASE.data.DataSet;

    LG.core.dataModel.testing.DataContext = (function (Super) {

        var DataContext = function (appId, userToken) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new DataContext(appId, userToken);
            }

            Super.call(self, appId, userToken);

            self.setService(new LG.core.dataModel.testing.Service(appId, userToken));

            self.fruitShapes = new DataSet(LG.core.dataModel.testing.FruitShape, self);
            self.fruitMolds = new DataSet(LG.core.dataModel.testing.FruitMold, self);
            self.fruits = new DataSet(LG.core.dataModel.testing.Fruit, self);
            self.pesticides = new DataSet(LG.core.dataModel.testing.Pesticide, self);
            self.baskets = new DataSet(LG.core.dataModel.testing.Basket, self);
            self.fruitToPesticides = new DataSet(LG.core.dataModel.testing.FruitToPesticide, self);

            return self;
        };
        BASE.extend(DataContext, Super);
        return DataContext;
    }(BASE.data.DataContext));
});