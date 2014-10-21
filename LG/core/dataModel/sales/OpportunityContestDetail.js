BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.sales");

    var _globalObject = this;

    LG.core.dataModel.sales.OpportunityContestDetail = (function (Super) {
        var OpportunityContestDetail = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("OpportunityContestDetail constructor invoked with global context.  Say new.");
            }

            Super.call(self);

            self['id'] = null;
            self['opportunityId'] = null;
            self['opportunity'] = null;
            self['type'] = null;
            self['value'] = null;
                                
            return self;
        };

        BASE.extend(OpportunityContestDetail, Super);

        return OpportunityContestDetail;
    }(Object));
});