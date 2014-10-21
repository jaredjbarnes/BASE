BASE.require(["LG.core.dataModel.core.BaseChangeTracking"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.PersonToAttachmentPermission = (function (Super) {
        var PersonToAttachmentPermission = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PersonToAttachmentPermission constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['person'] = null;
            self['personId'] = null;
            self['attachment'] = null;
            self['attachmentId'] = null;
            self['canRead'] = null;
            self['canUpdate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(PersonToAttachmentPermission, Super);

        return PersonToAttachmentPermission;
    }(LG.core.dataModel.core.BaseChangeTracking));
});