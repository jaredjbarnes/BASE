BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.testing");

    var _globalObject = this;

    LG.core.dataModel.testing.FruitMold = (function (Super) {
        var FruitMold = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("FruitMold constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['fruit'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(FruitMold, Super);

        return FruitMold;
    }(Object));
});