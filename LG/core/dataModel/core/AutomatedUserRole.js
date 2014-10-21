BASE.require(["LG.core.dataModel.core.PersonRole"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.AutomatedUserRole = (function (Super) {
        var AutomatedUserRole = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("AutomatedUserRole constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
                                                  

            return self;
        };

        BASE.extend(AutomatedUserRole, Super);

        return AutomatedUserRole;
    }(LG.core.dataModel.core.PersonRole));
});