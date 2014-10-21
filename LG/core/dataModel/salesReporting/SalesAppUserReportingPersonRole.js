BASE.require(["LG.core.dataModel.core.PersonRole"], function () {
    BASE.namespace("LG.core.dataModel.salesReporting");

    var _globalObject = this;

    LG.core.dataModel.salesReporting.SalesAppUserReportingPersonRole = (function (Super) {
        var SalesAppUserReportingPersonRole = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("SalesAppUserReportingPersonRole constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['reportSettings'] = [];
                                                  

            return self;
        };

        BASE.extend(SalesAppUserReportingPersonRole, Super);

        return SalesAppUserReportingPersonRole;
    }(LG.core.dataModel.core.PersonRole));
});