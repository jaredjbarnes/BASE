BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.BaseAddress = (function (Super) {
        var BaseAddress = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("BaseAddress constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['street1'] = null;
            self['street2'] = null;
            self['city'] = null;
            self['state'] = null;
            self['zip'] = null;
            self['country'] = null;
            self['county'] = null;
            self['longitude'] = null;
            self['latitude'] = null;
            self['addressType'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
                                                  

            return self;
        };

        BASE.extend(BaseAddress, Super);

        return BaseAddress;
    }(Object));
});