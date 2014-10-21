BASE.require([
    "BASE.data.responses.ErrorResponse"
], function () {
    BASE.namespace("BASE.data.responses");
    
    BASE.data.responses.EntityNotFoundErrorResponse = (function (Super) {
        var EntityNotFoundErrorResponse = function (message, entity) {
            var self = this;
            BASE.assertNotGlobal(self);
            
            Super.call(self, message);
            
            self.entity = entity;
            
            return self;
        };
        
        BASE.extend(EntityNotFoundErrorResponse, Super);
        
        return EntityNotFoundErrorResponse;
    }(BASE.data.responses.ErrorResponse));
});