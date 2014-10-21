BASE.require(["LG.core.dataModel.core.Address"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.PersonAddress = (function (Super) {
        var PersonAddress = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PersonAddress constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['personId'] = null;
            self['person'] = null;
                                                  

            return self;
        };

        BASE.extend(PersonAddress, Super);

        return PersonAddress;
    }(LG.core.dataModel.core.Address));
});