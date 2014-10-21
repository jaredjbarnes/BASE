BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.salesExpectation");

    var _globalObject = this;

    LG.core.dataModel.salesExpectation.AssignedExpectedBook = (function (Super) {
        var AssignedExpectedBook = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("AssignedExpectedBook constructor invoked with global context.  Say new.");
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

        BASE.extend(AssignedExpectedBook, Super);

        return AssignedExpectedBook;
    }(Object));
});