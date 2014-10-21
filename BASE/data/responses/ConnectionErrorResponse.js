BASE.require([
    "BASE.data.responses.ErrorResponse"
], function () {
    BASE.namespace("BASE.data.responses");
    
    BASE.data.responses.ConnectionErrorResponse = (function (Super) {
        var ConnectionErrorResponse = function (message) {
            var self = this;
            BASE.assertNotGlobal(self);
            
            Super.call(self, message);
            
            return self;
        };
        
        BASE.extend(ConnectionErrorResponse, Super);
        
        return ConnectionErrorResponse;
    }(BASE.data.responses.ErrorResponse));
});