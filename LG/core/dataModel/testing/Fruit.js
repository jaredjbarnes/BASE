BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.testing");

    var _globalObject = this;

    LG.core.dataModel.testing.Fruit = (function (Super) {
        var Fruit = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Fruit constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['fruitShape'] = null;
            self['fruitMold'] = null;
            self['basketId'] = null;
            self['basket'] = null;
            self['pesticides'] = [];
            self['name'] = null;
            self['int641'] = null;
            self['int641Nullable'] = null;
            self['int1'] = null;
            self['int1Nullable'] = null;
            self['float1'] = null;
            self['float1Nullable'] = null;
            self['double1'] = null;
            self['double1Nullable'] = null;
            self['decimal1'] = null;
            self['decimal1Nullable'] = null;
            self['guid1'] = null;
            self['guid1Nullable'] = null;
            self['datetime1'] = null;
            self['datetime1Nullable'] = null;
            self['bool1'] = null;
            self['bool1Nullable'] = null;
            self['seasonAvailable'] = null;
            self['seasonAvailableNullable'] = null;
            self['byte1'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Fruit, Super);

        return Fruit;
    }(Object));
});