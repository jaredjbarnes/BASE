BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.salesExpectation");

    var _globalObject = this;

    LG.core.dataModel.salesExpectation.NewExpectedBook = (function (Super) {
        var NewExpectedBook = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("NewExpectedBook constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['expectation'] = null;
            self['amount'] = null;
            self['commissionPercent'] = null;
            self['paybackPercent'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(NewExpectedBook, Super);

        return NewExpectedBook;
    }(Object));
});