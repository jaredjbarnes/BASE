BASE.require(["LG.core.dataModel.core.Credential"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.LdapCredential = (function (Super) {
        var LdapCredential = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("LdapCredential constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
                                                  

            return self;
        };

        BASE.extend(LdapCredential, Super);

        return LdapCredential;
    }(LG.core.dataModel.core.Credential));
});