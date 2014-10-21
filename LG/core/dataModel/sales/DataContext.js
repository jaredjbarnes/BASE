BASE.require([
    "BASE.data.DataContext",
    "BASE.data.services.SqliteService",
    "LG.core.dataModel.sales.Edm"
], function () {

    BASE.namespace("LG.core.dataModel.sales");

    var DataContext = BASE.data.DataContext;
    var SqliteService = BASE.data.services.SqliteService;

    LG.core.dataModel.sales.DataContext = function (sqliteService) {

        var self = this;
        BASE.assertNotGlobal(self);

        var readyFuture = sqliteService.onReady();

        DataContext.call(self, sqliteService, sqliteService.getEdm());

        self.onReady = function (callback) {
            if (typeof callback === "function") {
                return readyFuture.then(callback);
            } else {
                throw new Error("Callback needed.");
            }
        };

        return self;
    };

    BASE.extend(LG.core.dataModel.sales.DataContext, DataContext);

});