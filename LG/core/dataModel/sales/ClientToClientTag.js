BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.sales");

    var _globalObject = this;

    LG.core.dataModel.sales.ClientToClientTag = (function (Super) {
        var ClientToClientTag = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("ClientToClientTag constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['id'] = null;
            self['clientTagId'] = null;
            self['clientTag'] = null;
            self['clientId'] = null;
            self['client'] = null;
            self['createdDate'] = null;
            self['lastModifiedDate'] = null;
                                                  

            return self;
        };

        BASE.extend(ClientToClientTag, Super);

        return ClientToClientTag;
    }(Object));
});