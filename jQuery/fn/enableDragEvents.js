/// <reference path="/scripts/BASE.js" />
/// <reference path="/scripts/jQuery/mouseManager.js" />

BASE.require(["jQuery", "jQuery.fn.region", "jQuery.mouseManager"], function () {
    jQuery.fn.enableDragEvents = function () {
        return this.each(function () {
            var elem = this;
            var $elem = $(this);

            if (!$elem.data("dragEventsInitialized")) {
                $elem.data("dragEventsInitialized", true)

                var mouseManager = jQuery.mouseManager;
                var offsetX = null;
                var offsetY = null;

                var initialize = function(){
                    
                };
                
                var mousedown = function(e){
                    if ( offsetX === null && e.target === elem){
                        
                        $elem.trigger(new $.Event("dragstart"));
                        
                        var region = $elem.region();
                        offsetX = Math.abs(region.x-e.pageX);
                        offsetY = Math.abs(region.y-e.pageY);
                        
                        var drag = function(e){
                            $elem.offset({top: e.y-offsetY, left: e.x-offsetX});
                            $elem.trigger(new $.Event("drag"));
                        };
                        
                        var dragend = function(e){
                            $elem.offset({top: e.y-offsetY, left: e.x-offsetX});
                            mouseManager.unobserve(drag, "drag");
                            mouseManager.unobserve(dragend, "dragend");
                            
                            offsetX = null;
                            offsetY = null;
                            $elem.trigger(new $.Event("dragend"));
                        };
                        
                        mouseManager.observe(drag, "drag");
                        mouseManager.observe(dragend, "dragend");
                        
                    }    
                };
                
                $elem.bind("mousedown", mousedown);
                  
            }
        });
    };
});