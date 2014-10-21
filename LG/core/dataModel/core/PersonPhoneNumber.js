BASE.require(["LG.core.dataModel.core.PhoneNumber"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.PersonPhoneNumber = (function (Super) {
        var PersonPhoneNumber = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PersonPhoneNumber constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['personId'] = null;
            self['person'] = null;
                                                  

            return self;
        };

        BASE.extend(PersonPhoneNumber, Super);

        return PersonPhoneNumber;
    }(LG.core.dataModel.core.PhoneNumber));
});