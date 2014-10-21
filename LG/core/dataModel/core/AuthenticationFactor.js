BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.AuthenticationFactor = (function (Super) {
        var AuthenticationFactor = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("AuthenticationFactor constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['credentialId'] = null;
            self['credential'] = null;
            self['lastUsed'] = null;
            self['isRequired'] = null;
            self['displayName'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(AuthenticationFactor, Super);

        return AuthenticationFactor;
    }(Object));
});