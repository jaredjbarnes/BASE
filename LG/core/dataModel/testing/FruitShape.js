BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.testing");

    var _globalObject = this;

    LG.core.dataModel.testing.FruitShape = (function (Super) {
        var FruitShape = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("FruitShape constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['fruit'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(FruitShape, Super);

        return FruitShape;
    }(Object));
});