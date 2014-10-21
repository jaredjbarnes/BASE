BASE.require(["LG.core.dataModel.salesReporting.ReportSetting"], function () {
    BASE.namespace("LG.core.dataModel.salesReporting");

    var _globalObject = this;

    LG.core.dataModel.salesReporting.OverviewReportFavoriteSetting = (function (Super) {
        var OverviewReportFavoriteSetting = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("OverviewReportFavoriteSetting constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['favoriteId'] = null;
            self['favorite'] = null;
                                                  

            return self;
        };

        BASE.extend(OverviewReportFavoriteSetting, Super);

        return OverviewReportFavoriteSetting;
    }(LG.core.dataModel.salesReporting.ReportSetting));
});