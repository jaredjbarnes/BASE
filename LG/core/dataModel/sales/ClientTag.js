BASE.require(["LG.core.dataModel.core.Tag"], function () {
    BASE.namespace("LG.core.dataModel.sales");

    var _globalObject = this;

    LG.core.dataModel.sales.ClientTag = (function (Super) {
        var ClientTag = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("ClientTag constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['clientToClientTags'] = [];
            self['createdDate'] = null;
            self['lastModifiedDate'] = null;
                                                  

            return self;
        };

        BASE.extend(ClientTag, Super);

        return ClientTag;
    }(LG.core.dataModel.core.Tag));
});