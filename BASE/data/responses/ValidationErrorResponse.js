BASE.require([
    "BASE.data.responses.ErrorResponse"
], function () {
    BASE.namespace("BASE.data.responses");
    
    BASE.data.responses.ValidationErrorResponse = (function (Super) {
        var ValidationErrorResponse = function (message, validationErrors) {
            var self = this;
            BASE.assertNotGlobal(self);
            
            Super.call(self, message);
            
            self.errors = validationErrors;
            
            return self;
        };
        
        BASE.extend(ValidationErrorResponse, Super);
        
        return ValidationErrorResponse;
    }(BASE.data.responses.ErrorResponse));
});