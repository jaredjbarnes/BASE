BASE.require(["LG.core.dataModel.core.Address"], function () {
    BASE.namespace("LG.core.dataModel.sales");

    var _globalObject = this;

    LG.core.dataModel.sales.ClientAddress = (function (Super) {
        var ClientAddress = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("ClientAddress constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['clientId'] = null;
            self['client'] = null;
            self['createdDate'] = null;
            self['lastModifiedDate'] = null;
                                                  

            return self;
        };

        BASE.extend(ClientAddress, Super);

        return ClientAddress;
    }(LG.core.dataModel.core.Address));
});