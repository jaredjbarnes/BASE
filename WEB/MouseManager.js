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
            _Super.call(type);
            
            self.x = jQueryEvent.pageX;
            self.y = jQueryEvent.pageY;
            self.target = target;
            self.jQueryEvent = jQueryEvent;
            
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
            var dropRegions = {};
            
            var update = function(type, e){
                self.notify(new WEB.MouseEvent(type, self.target, e));
                jQueryEvent = null;
            };
            
            var mousedown = function (e) {
                if (!target){
                    self.target = e.target;
                    update("dragstart", e);
                    $(document).bind("mousemove", mousemove);
                }
            };
    
            var mousemove = function (e) {
                update("drag", e);
            };
    
            var mouseup = function (e) {
                if (self.target){
                    update("dragend", e);
                    
                    self.target = null;
                    $(document).unbind("mousemove", mousemove);
                }
            };
            
            self.addDropRegion = function(mode, region){
                
            };
            
            $(document).bind("mousedown", mousedown);
            $(document).bind("mouseup", mouseup);

            return self;
        };
        
        BASE.extend(MouseManager, _Super);
        
        return MouseManager;
    })(BASE.Observer);
});