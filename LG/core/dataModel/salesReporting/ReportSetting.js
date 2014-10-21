BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.salesReporting");

    var _globalObject = this;

    LG.core.dataModel.salesReporting.ReportSetting = (function (Super) {
        var ReportSetting = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("ReportSetting constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['salesAppUserReportingPersonRoleId'] = null;
            self['salesAppUserReportingPersonRole'] = null;
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(ReportSetting, Super);

        return ReportSetting;
    }(Object));
});