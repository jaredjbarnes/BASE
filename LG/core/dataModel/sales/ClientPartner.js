BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.sales");

    var _globalObject = this;

    LG.core.dataModel.sales.ClientPartner = (function (Super) {
        var ClientPartner = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("ClientPartner constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['clientId'] = null;
            self['client'] = null;
            self['salesAppUserPersonRoleId'] = null;
            self['salesAppUserPersonRole'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
            self['createdDate'] = null;
            self['lastModifiedDate'] = null;
                                                  

            return self;
        };

        BASE.extend(ClientPartner, Super);

        return ClientPartner;
    }(Object));
});