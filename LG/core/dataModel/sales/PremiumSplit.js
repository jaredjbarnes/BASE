BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.sales");

    var _globalObject = this;

    LG.core.dataModel.sales.PremiumSplit = (function (Super) {
        var PremiumSplit = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PremiumSplit constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['opportunity'] = null;
            self['opportunityId'] = null;
            self['salesAppUserPersonRoleId'] = null;
            self['salesAppUserPersonRole'] = null;
            self['percent'] = null;
            self['id'] = null;
            self['createdDate'] = null;
            self['lastModifiedDate'] = null;
                                                  

            return self;
        };

        BASE.extend(PremiumSplit, Super);

        return PremiumSplit;
    }(Object));
});