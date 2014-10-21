BASE.require([
    "BASE.data.Edm"
], function () {
    
    BASE.namespace("LG.core.dataModel.testing");
    
    var Edm = BASE.data.Edm;
    
    var Basket = LG.core.dataModel.testing.Basket = function () {
        var self = this;
        self.id = null;
        self.name = null;
        self.fruits = [];
    };
    
    var Fruit = LG.core.dataModel.testing.Fruit = function () {
        var self = this;
        self.id = null;
        self.fruitShape = null;
        self.fruitMold = null;
        self.basketId = null;
        self.basket = null;
        self.pesticides = [];
        self.name = null;
        self.int641 = 0;
        self.int641Nullable = null;
        self.int1 = 0;
        self.int1Nullable = null;
        self.float1 = 0;
        self.float1Nullable = null;
        self.double1 = 0;
        self.double1Nullable = null;
        self.guid1 = "";
        self.guid1Nullable = null;
        self.dateTime1 = new Date();
        self.dateTime1Nullable = null;
        self.bool1 = false;
        self.bool1Nullable = null;
        self.seasonAvailable = "Spring",
        self.seasonAvailableNullable = null;
        self.byte1 = 0;
    };
    
    var FruitShape = LG.core.dataModel.testing.FruitShape = function () {
        var self = this;
        self.id = null;
        self.name = null;
        self.fruit = null;
        self.fruitId = null;
    };
    
    var Pesticide = LG.core.dataModel.testing.Pesticide = function () {
        var self = this;
        self.id = null;
        self.name = null;
        self.fruits = [];
    };
    
    var PesticideToFruit = LG.core.dataModel.testing.PesticideToFruit = function () {
        var self = this;
        self.pesticideId = null;
        self.fruitId = null;
    };
    
    LG.core.dataModel.testing.Edm = function () {
        var self = this;
        
        BASE.assertNotGlobal(self);
        
        Edm.call(self);
        
        self.addModel({
            type: Fruit,
            collectionName: "fruits",
            properties: {
                id : {
                    type: Integer,
                    primaryKey: true
                },
                basketId : {
                    type: Integer
                },
                name : {
                    type: String
                },
                int641: {
                    type: Integer
                },
                int641Nullable: {
                    type: Integer
                },
                int1: {
                    type: Integer
                },
                int1Nullable: {
                    type: Integer
                },
                float1: {
                    type: Float,
                    nullable: false
                },
                float1Nullable: {
                    type: Float
                },
                double1 : {
                    type: Double,
                    nullable: false
                },
                double1Nullable: {
                    type: Double
                },
                guid1 : {
                    type: String
                },
                guid1Nullable: {
                    type: String
                },
                dateTime1: {
                    type: Date,
                    nullable: false
                },
                dateTime1Nullable: {
                    type: Date
                },
                bool1 : {
                    type: Boolean,
                    nullable: false
                },
                bool1Nullable: {
                    type: Boolean
                },
                seasonAvailable : {
                    type: String,
                    nullable: false
                },
                seasonAvailableNullable: {
                    type: String
                },
                byte1: {
                    type: Integer
                }
            }
        });
        
        self.addModel({
            type: Basket,
            collectionName: "baskets",
            properties: {
                id: {
                    type: Integer,
                    primaryKey: true
                },
                name: {
                    type: String
                }
            }
        });
        
        self.addModel({
            type: FruitShape,
            collectionName: "fruitShapes",
            properties: {
                id: {
                    type: Integer,
                    primaryKey: true
                },
                name: {
                    type: String
                },
                fruitId: {
                    type: Integer
                }
            }
        });
        
        self.addModel({
            type: Pesticide,
            collectionName: "pesticides",
            properties: {
                id: {
                    type: Integer,
                    primaryKey: true
                },
                name: {
                    type: String
                }
            }
        });
        
        self.addModel({
            type: PesticideToFruit,
            collectionName: "pesticidesToFruits",
            properties: {
                id: {
                    type: Integer,
                    primaryKey: true
                },
                name: {
                    type: String
                }
            }
        });

    };

});