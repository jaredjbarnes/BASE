BASE.require(["LG.core.dataModel.core.BaseRole"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.PersonRole = (function (Super) {
        var PersonRole = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PersonRole constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['personId'] = null;
            self['person'] = null;
                                                  

            return self;
        };

        BASE.extend(PersonRole, Super);

        return PersonRole;
    }(LG.core.dataModel.core.BaseRole));
});