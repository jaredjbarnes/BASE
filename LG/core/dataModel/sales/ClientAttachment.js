BASE.require(["LG.core.dataModel.core.Attachment"], function () {
    BASE.namespace("LG.core.dataModel.sales");

    var _globalObject = this;

    LG.core.dataModel.sales.ClientAttachment = (function (Super) {
        var ClientAttachment = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("ClientAttachment constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['clientId'] = null;
            self['client'] = null;
            self['length'] = null;
            self['createdDate'] = null;
            self['lastModifiedDate'] = null;
                                                  

            return self;
        };

        BASE.extend(ClientAttachment, Super);

        return ClientAttachment;
    }(LG.core.dataModel.core.Attachment));
});