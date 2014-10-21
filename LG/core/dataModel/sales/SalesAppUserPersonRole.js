BASE.require(["LG.core.dataModel.core.PersonRole"], function () {
    BASE.namespace("LG.core.dataModel.sales");

    var _globalObject = this;

    LG.core.dataModel.sales.SalesAppUserPersonRole = (function (Super) {
        var SalesAppUserPersonRole = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("SalesAppUserPersonRole constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['overviewReportFavoriteSettings'] = [];
            self['clientUserSettings'] = [];
            self['premiumSplits'] = [];
            self['clients'] = [];
            self['opportunities'] = [];
            self['clientPartners'] = [];
            self['createdDate'] = null;
            self['lastModifiedDate'] = null;
                                                  

            return self;
        };

        BASE.extend(SalesAppUserPersonRole, Super);

        return SalesAppUserPersonRole;
    }(LG.core.dataModel.core.PersonRole));
});