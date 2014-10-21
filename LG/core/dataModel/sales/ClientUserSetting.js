BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.sales");

    var _globalObject = this;

    LG.core.dataModel.sales.ClientUserSetting = (function (Super) {
        var ClientUserSetting = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("ClientUserSetting constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['clientId'] = null;
            self['client'] = null;
            self['displayState'] = null;
            self['salesAppUserPersonRoleId'] = null;
            self['salesAppUserPersonRole'] = null;
            self['id'] = null;
            self['createdDate'] = null;
            self['lastModifiedDate'] = null;
                                                  

            return self;
        };

        BASE.extend(ClientUserSetting, Super);

        return ClientUserSetting;
    }(Object));
});