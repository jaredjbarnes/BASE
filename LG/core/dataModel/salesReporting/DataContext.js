BASE.require([
    "BASE.data.DataContext",
    "LG.core.dataModel.salesReporting.Service"    
], function () {

    BASE.namespace("LG.core.dataModel.salesReporting");

    LG.core.dataModel.salesReporting.DataContext = (function (Super) {

        var DataContext = function (appId, userToken) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new DataContext(appId, userToken);
            }

            Super.call(self);

            service = new LG.core.dataModel.salesReporting.Service(appId, userToken, self.relationships);

            self.setService(service);

            var DataSet = BASE.data.DataSet;

            var core = LG.core.dataModel.core;
            var sales = LG.core.dataModel.sales;
            var salesReporting = LG.core.dataModel.salesReporting;

            self.overviewReportFavoriteSettings = new DataSet(salesReporting.OverviewReportFavoriteSetting, self);
            self.salesAppUserReportingPersonRoles = new DataSet(salesReporting.SalesAppUserReportingPersonRole, self);
            self.people = new DataSet(core.Person, self);
            self.profilePictureAttachments = new DataSet(core.ProfilePictureAttachment, self);
            self.clientUserSettings = new DataSet(sales.ClientUserSetting, self);
            self.salesAppUserPersonRoles = new DataSet(sales.SalesAppUserPersonRole, self);
            
            return self;
        };
        BASE.extend(DataContext, Super);

        return DataContext;
    }(BASE.data.DataContext));
});