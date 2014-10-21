BASE.require(["LG.core.dataModel.core.BaseAddress"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.Address = (function (Super) {
        var Address = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Address constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Address, Super);

        return Address;
    }(LG.core.dataModel.core.BaseAddress));
});