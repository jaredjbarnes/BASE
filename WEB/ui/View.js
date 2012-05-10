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

    // Finds all active views on load.
    // and initializes them.
    if (document.body) {
        $(function () {
            $("[data-viewUrl]").each(function () {
                var $this = $(this);
                var script = $this.attr("[data-script]");
                var view = $this.data("WEB.ui.View");
                if ((!view || (view && !view.isInitialized)) && script) {
                    BASE.require([script], function () {
                        var UIView = BASE.getObject(script);
                        var uiView = typeof UIView === "function" ? new UIView($this[0]) : new WEB.ui.View($this[0]);

                        if (uiView instanceof WEB.ui.View) {

                        } else {
                            throw new Error(script + " was not an instance of WEB.ui.ViewController");
                        }
                    });
                }
            });
        });
    }
});