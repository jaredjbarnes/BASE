BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.salesExpectation");

    var _globalObject = this;

    LG.core.dataModel.salesExpectation.Investment = (function (Super) {
        var Investment = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Investment constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['amount'] = null;
            self['expectation'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Investment, Super);

        return Investment;
    }(Object));
});