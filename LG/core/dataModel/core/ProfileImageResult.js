BASE.require(["LG.Result"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.ProfileImageResult = (function (Super) {
        var ProfileImageResult = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("ProfileImageResult constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['image'] = null;
                                                  

            return self;
        };

        BASE.extend(ProfileImageResult, Super);

        return ProfileImageResult;
    }(LG.Result));
});