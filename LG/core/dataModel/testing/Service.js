BASE.require([
    "LG.rest.Service",
    "LG.core.dataModel.testing.Fruit",
    "LG.core.dataModel.testing.Pesticide",
    "LG.core.dataModel.testing.Basket",
    "LG.core.dataModel.testing.FruitMold",
    "LG.core.dataModel.testing.FruitShape",
    "LG.core.dataModel.testing.FruitToPesticide",
    "LG.JsonAjaxProvider"
], function () {
    BASE.namespace("LG.core.dataModel.testing");

    LG.core.dataModel.testing.Service = (function (Super) {
        var Service = function (appId, token) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Service(appId, token);
            }

            Super.call(self, appId, token);

            self.ajaxProvider = new LG.JsonAjaxProvider(appId, token);
            self.host = "https://my.leavitt.com/webapi/";
            //self.host = "http://localhost:3508"

            self.typeUri.add(LG.core.dataModel.testing.Fruit, "/Testing/Fruits");
            self.serverTypeToClientType.add("Fruit", LG.core.dataModel.testing.Fruit);
            self.typeUri.add(LG.core.dataModel.testing.FruitMold, "/Testing/FruitMolds");
            self.serverTypeToClientType.add("FruitMold", LG.core.dataModel.testing.FruitMold);
            self.typeUri.add(LG.core.dataModel.testing.FruitShape, "/Testing/FruitShapes");
            self.serverTypeToClientType.add("FruitShape", LG.core.dataModel.testing.FruitShape);
            self.typeUri.add(LG.core.dataModel.testing.Pesticide, "/Testing/Pesticides");
            self.serverTypeToClientType.add("Pesticide", LG.core.dataModel.testing.Pesticide);
            self.typeUri.add(LG.core.dataModel.testing.Basket, "/Testing/Baskets");
            self.serverTypeToClientType.add("Basket", LG.core.dataModel.testing.Basket);

            self.typeUri.add(LG.core.dataModel.testing.FruitToPesticide, "/Testing/PesticideToFruit");

            self.relationships = {
                oneToOne: [{
                    type: LG.core.dataModel.testing.Fruit,
                    hasKey: "id",
                    hasOne: "fruitShape",
                    ofType: LG.core.dataModel.testing.FruitShape,
                    withKey: "id",
                    withForeignKey: "id",
                    withOne: "fruit",
                    cascadeDelete: true
                }, {
                    type: LG.core.dataModel.testing.Fruit,
                    hasKey: "id",
                    hasOne: "fruitMold",
                    ofType: LG.core.dataModel.testing.FruitMold,
                    withKey: "id",
                    withForeignKey: "id",
                    withOne: "fruit"
                }],
                oneToMany: [{
                    type: LG.core.dataModel.testing.Basket,
                    hasKey: "id",
                    hasMany: "fruits",
                    ofType: LG.core.dataModel.testing.Fruit,
                    withKey: "id",
                    withForeignKey: "basketId",
                    withOne: "basket",
                    optional: true
                }],
                manyToMany: [{
                    type: LG.core.dataModel.testing.Fruit,
                    hasKey: "id",
                    hasForeignKey: "pesticideId",
                    hasMany: "pesticides",
                    ofType: LG.core.dataModel.testing.Pesticide,
                    withKey: "id",
                    withForeignKey: "fruitId",
                    withMany: "fruits",
                    usingMappingType: LG.core.dataModel.testing.FruitToPesticide
                }]
            };

            return self;
        };

        BASE.extend(Service, Super);

        return Service;
    }(LG.rest.Service));
});