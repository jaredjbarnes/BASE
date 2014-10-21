BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.PasswordFactorResetCode = (function (Super) {
        var PasswordFactorResetCode = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PasswordFactorResetCode constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['passwordFactor'] = null;
            self['attempts'] = null;
            self['startDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(PasswordFactorResetCode, Super);

        return PasswordFactorResetCode;
    }(Object));
});