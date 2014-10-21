BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.PhoneNumber = (function (Super) {
        var PhoneNumber = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("PhoneNumber constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['phoneNumberType'] = null;
            self['countryCode'] = null;
            self['areaCode'] = null;
            self['lineNumber'] = null;
            self['extension'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(PhoneNumber, Super);

        return PhoneNumber;
    }(Object));
});