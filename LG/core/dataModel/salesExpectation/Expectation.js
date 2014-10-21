BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.salesExpectation");

    var _globalObject = this;

    LG.core.dataModel.salesExpectation.Expectation = (function (Super) {
        var Expectation = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Expectation constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['salesContractId'] = null;
            self['salesContract'] = null;
            self['assignedExpectedBook'] = null;
            self['newExpectedBook'] = null;
            self['renewExpectedBook'] = null;
            self['investment'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Expectation, Super);

        return Expectation;
    }(Object));
});