BASE.require(["LG.core.dataModel.core.AuthenticationFactor"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.PasswordFactor = (function (Super) {
        var PasswordFactor = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PasswordFactor constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['displayName'] = null;
                                                  

            return self;
        };

        BASE.extend(PasswordFactor, Super);

        return PasswordFactor;
    }(LG.core.dataModel.core.AuthenticationFactor));
});