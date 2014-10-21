BASE.require(["LG.core.dataModel.core.PersonRole"], function () {
    BASE.namespace("LG.core.dataModel.sales");

    var _globalObject = this;

    LG.core.dataModel.sales.ClientContactPersonRole = (function (Super) {
        var ClientContactPersonRole = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("ClientContactPersonRole constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['clientId'] = null;
            self['client'] = null;
            self['title'] = null;
            self['type'] = null;
            self['createdDate'] = null;
            self['lastModifiedDate'] = null;
                                                  

            return self;
        };

        BASE.extend(ClientContactPersonRole, Super);

        return ClientContactPersonRole;
    }(LG.core.dataModel.core.PersonRole));
});