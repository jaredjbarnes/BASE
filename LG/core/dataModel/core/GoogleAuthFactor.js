BASE.require(["LG.core.dataModel.core.AuthenticationFactor"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.GoogleAuthFactor = (function (Super) {
        var GoogleAuthFactor = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("GoogleAuthFactor constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['displayName'] = null;
            self['QRCode'] = null;
            self['preSharedKeyBase32'] = null;
                                                  

            return self;
        };

        BASE.extend(GoogleAuthFactor, Super);

        return GoogleAuthFactor;
    }(LG.core.dataModel.core.AuthenticationFactor));
});