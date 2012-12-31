BASE.require(["WEB.Region"], function(){
    BASE.namespace("WEB");
    
    WEB.ElementRegion = (function(_Super){
        var ElementRegion = function(top, right, bottom, left){
            if (!(this  instanceof arguments.callee)){
                return ElementRegion(top, right, bottom, left);
            }
            
            var self = this;
            _Super.call(self, top, right, bottom, left);
            
            return self;
        };
        
        BASE.extend(ElementRegion, _Super);
        return ElementRegion;
    })(WEB.Region);
});