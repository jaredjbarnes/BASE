BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.testing");

    var _globalObject = this;

    LG.core.dataModel.testing.Basket = (function (Super) {
        var Basket = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Basket constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['fruits'] = [];
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Basket, Super);

        return Basket;
    }(Object));
});