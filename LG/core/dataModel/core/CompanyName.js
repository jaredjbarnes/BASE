BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.core");

    var _globalObject = this;

    LG.core.dataModel.core.CompanyName = (function (Super) {
        var CompanyName = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("CompanyName constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['companyNameType'] = null;
            self['companyId'] = null;
            self['company'] = null;
            self['startDate'] = null;
            self['endDate'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(CompanyName, Super);

        return CompanyName;
    }(Object));
});