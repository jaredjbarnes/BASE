BASE.require([
   "BASE.data.DataContext",
   "BASE.data.PersistentChangeTrackerEdm"
], function () {
    
    BASE.namespace("BASE.data");
    
    var DataContext = BASE.data.DataContext;
    var Edm = BASE.data.PersistentChangeTrackerEdm;
    
    var Status = BASE.data.PersistentChangeTrackerEdm.Status;
    var StatusDatum = BASE.data.PersistentChangeTrackerEdm.StatusDatum;
    var SyncError = BASE.data.PersistentChangeTrackerEdm.SyncError;
    
    BASE.data.PersistentChangeTrackerDataContext = function (service) {
        var self = this;
        
        BASE.assertNotGlobal(self);
        
        var edm = new Edm();
        
        DataContext.call(self, service, edm);
        
    };

});