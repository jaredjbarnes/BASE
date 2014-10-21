BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.EmailAddress = (function (Super) {
        var EmailAddress = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("EmailAddress constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['emailAddressType'] = null;
            self['address'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(EmailAddress, Super);

        return EmailAddress;
    }(Object));
});