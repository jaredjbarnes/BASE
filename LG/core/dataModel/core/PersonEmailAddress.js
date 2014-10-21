BASE.require(["LG.core.dataModel.core.EmailAddress"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.PersonEmailAddress = (function (Super) {
        var PersonEmailAddress = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PersonEmailAddress constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['personId'] = null;
            self['person'] = null;
                                                  

            return self;
        };

        BASE.extend(PersonEmailAddress, Super);

        return PersonEmailAddress;
    }(LG.core.dataModel.core.EmailAddress));
});