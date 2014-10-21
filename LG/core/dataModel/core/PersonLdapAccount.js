BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.PersonLdapAccount = (function (Super) {
        var PersonLdapAccount = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PersonLdapAccount constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['person'] = null;
            self['sid'] = null;
            self['guid'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(PersonLdapAccount, Super);

        return PersonLdapAccount;
    }(Object));
});