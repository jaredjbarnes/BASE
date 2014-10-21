BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.salesExpectation");

    var _globalObject = this;

    LG.core.dataModel.salesExpectation.RenewExpectedBook = (function (Super) {
        var RenewExpectedBook = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("RenewExpectedBook constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['expectation'] = null;
            self['amount'] = null;
            self['commissionPercent'] = null;
            self['paybackPercent'] = null;
            self['additionalAmount'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(RenewExpectedBook, Super);

        return RenewExpectedBook;
    }(Object));
});