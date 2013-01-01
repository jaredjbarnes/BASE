/// <reference path="/js/scripts/BASE.js" />
/// <reference path="/js/scripts/WEB/Region.js" />
/// <reference path="/js/scripts/jQuery/fn/region.js" />

BASE.require(["jQuery.fn.region", "Array.prototype.forEach"], function () {
    BASE.namespace("WEB");
    
    
    WEB.MouseEvent = (function(_Super){
        var MouseEvent = function(type, target, jQueryEvent){
            if (!(this instanceof arguments.callee)){
                return new MouseEvent(type, target, jQueryEvent);    
            }
            
            var self = this;
            _Super.call(self, type);
            
            self.x = jQueryEvent.pageX;
            self.y = jQueryEvent.pageY;
            self.target = target;
            self.jQueryEvent = jQueryEvent;
            self.startX = null;
            self.startY = null;
            
            return self;
        };
        
        BASE.extend(MouseEvent, _Super);
        return MouseEvent;
    })(BASE.ObserverEvent);
    
    
    WEB.MouseManager = (function(_Super){
    
        var MouseManager = function () {
            if (!(this instanceof arguments.callee)) {
                return new WEB.MouseManager();
            }
    
            var self = this;
            _Super.call(self);
            
            var target = null;
            var startX = null;
            var startY = null;
            
            var update = function(type, e){
                var event = new WEB.MouseEvent(type, target, e);
                event.startX = startX;
                event.startY = startY;
                self.notify(event);
                jQueryEvent = null;
            };
            
            var mousedown = function (e) {
                if (!target){
                    target = e.target;
                    startX = e.pageX;
                    startY = e.pageY;
                    update("dragstart", e);
                    $(document).bind("mousemove", mousemove);
                }
            };
    
            var mousemove = function (e) {
                update("drag", e);
            };
    
            var mouseup = function (e) {
                if (target){
                    update("dragend", e);
                    startX = null;
                    startY = null;
                    target = null;
                    $(document).unbind("mousemove", mousemove);
                }
            };
            
            $(document).bind("mousedown", mousedown);
            $(document).bind("mouseup", mouseup);

            return self;
        };
        
        BASE.extend(MouseManager, _Super);
        
        return MouseManager;
    })(BASE.Observer);
});