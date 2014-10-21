BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.Authentication = (function (Super) {
        var Authentication = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Authentication constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['credentialId'] = null;
            self['credential'] = null;
            self['accessType'] = null;
            self['location'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Authentication, Super);

        return Authentication;
    }(Object));
});