/// <reference path="/scripts/BASE.js" />

BASE.require(["jQuery"], function () {
    BASE.namespace("WEB.ui");

    WEB.ui.View = function (DOMElement) {
        var self = this;

        var isInitialized = true;
        Object.defineProperties(self, {
            isInitialized: {
                get: function () {
                    return isInitialized;
                }
            }
        });
    };

    WEB.ui.View.initializeFromRoot = function( root ){
        
        var findFirstParent = function($elem, condition, callback){
            callback = callback || function(){};
            condition = condition || function(){};
            var $children = $elem.children();
            $children.each(function(){
                var $this = $(this);
                if (condition($this)){
                     callback($this);
                     console.log("found");
                } else {
                    findFirstParent($this);
                }
            });
        };
        
        findFirstParent($(root), function($elem){
            if ($elem.attr("data-viewUrl") && $elem.attr("data-script")){return true;} else {return false;}
        }, function($this){
            var script = $this.attr("[data-script]");
                var view = $this.data("WEB.ui.View");
                if ((!view || (view && !view.isInitialized)) && script) {
                    BASE.require([script], function () {
                        var UIView = BASE.getObject(script);
                        var uiView = typeof UIView === "function" ? new UIView($this[0]) : new WEB.ui.View($this[0]);

                        if (uiView instanceof WEB.ui.View) {

                        } else {
                            throw new Error(script + " was not an instance of WEB.ui.View");
                        }
                    });
                }
        });
        
    };
    
    // Finds all active views on load.
    // and initializes them.
    if (document.body) {
        $(function () {
            WEB.ui.View.initializeFromRoot();
        });
    }
});