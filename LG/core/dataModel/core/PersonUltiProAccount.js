BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.PersonUltiProAccount = (function (Super) {
        var PersonUltiProAccount = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PersonUltiProAccount constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['personId'] = null;
            self['person'] = null;
            self['eeId'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(PersonUltiProAccount, Super);

        return PersonUltiProAccount;
    }(Object));
});