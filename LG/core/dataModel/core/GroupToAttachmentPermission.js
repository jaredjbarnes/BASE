BASE.require(["LG.core.dataModel.core.BaseChangeTracking"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.GroupToAttachmentPermission = (function (Super) {
        var GroupToAttachmentPermission = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("GroupToAttachmentPermission constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['peopleGroup'] = null;
            self['peopleGroupId'] = null;
            self['attachment'] = null;
            self['attachmentId'] = null;
            self['canRead'] = null;
            self['canUpdate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(GroupToAttachmentPermission, Super);

        return GroupToAttachmentPermission;
    }(LG.core.dataModel.core.BaseChangeTracking));
});