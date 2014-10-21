BASE.require([
   "BASE.data.DataContext",
   "BASE.data.sync.Edm"
], function () {
    
    BASE.namespace("BASE.data.sync");
    
    var DataContext = BASE.data.DataContext;
    var Edm = BASE.data.sync.Edm;
    
    BASE.data.sync.DataContext = function (service) {
        var self = this;
        
        BASE.assertNotGlobal(self);
        
        var edm = new Edm();
        DataContext.call(self, service, edm);
        
    };

});