BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.Credential = (function (Super) {
        var Credential = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Credential constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['authenticationFactors'] = [];
            self['authentications'] = [];
            self['personId'] = null;
            self['person'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Credential, Super);

        return Credential;
    }(Object));
});