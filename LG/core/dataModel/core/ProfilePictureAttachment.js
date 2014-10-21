BASE.require(["LG.core.dataModel.core.Attachment"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.ProfilePictureAttachment = (function (Super) {
        var ProfilePictureAttachment = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("ProfilePictureAttachment constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
                                                  

            return self;
        };

        BASE.extend(ProfilePictureAttachment, Super);

        return ProfilePictureAttachment;
    }(LG.core.dataModel.core.Attachment));
});