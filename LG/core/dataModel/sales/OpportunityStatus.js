BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.sales");

    var _globalObject = this;

    LG.core.dataModel.sales.OpportunityStatus = (function (Super) {
        var OpportunityStatus = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("OpportunityStatus constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['type'] = null;
            self['opportunityId'] = null;
            self['opportunity'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
            self['createdDate'] = null;
            self['lastModifiedDate'] = null;
                                                  

            return self;
        };

        BASE.extend(OpportunityStatus, Super);

        return OpportunityStatus;
    }(Object));
});