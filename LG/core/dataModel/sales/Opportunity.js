BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.sales");

    var _globalObject = this;

    LG.core.dataModel.sales.Opportunity = (function (Super) {
        var Opportunity = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Opportunity constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['ownerId'] = null;
            self['owner'] = null;
            self['dateCreated'] = null;
            self['expectedPremium'] = null;
            self['policyExpirationDate'] = null;
            self['contestDetails'] = [];
            self['statuses'] = [];
            self['premiumSplits'] = [];
            self['clientId'] = null;
            self['client'] = null;
            self['id'] = null;
            self['createdDate'] = null;
            self['lastModifiedDate'] = null;                                      

            return self;
        };

        BASE.extend(Opportunity, Super);

        return Opportunity;
    }(Object));
});