BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.sales");

    var _globalObject = this;

    LG.core.dataModel.sales.Client = (function (Super) {
        var Client = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Client constructor invoked with global context.  Say new.");
            }

            Super.call(self);

            self['name'] = null;
            self['clientToClientTags'] = [];
            self['clientUserSettings'] = [];
            self['clientAddresses'] = [];
            self['opportunities'] = [];
            self['partners'] = [];
            self['attachments'] = [];
            self['contacts'] = [];
            self['notes'] = [];
            self['ownerId'] = null;
            self['owner'] = null;
            self['id'] = null;
            self['createdDate'] = null;
            self['lastModifiedDate'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['denormalizedClient'] = null;

            return self;
        };

        BASE.extend(Client, Super);

        return Client;
    }(Object));
});