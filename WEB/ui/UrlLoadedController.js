BASE.require(["WEB.ui.Controller", "WEB.ui.View", "jQuery.fn.loadModule"], function () {
    BASE.namespace("LEAVITT");

    WEB.ui.UrlLoadedController = (function (Super) {
        var UrlLoadedController = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new UrlLoadedController();
            }

            var element = document.createElement("div");
            var $element = $(element);
            $element.css({ width: "100%", height: "100%" });
            element.controller = self;
            var view = new WEB.ui.View(element);

            Super.call(self, view);

            self.load = function (url, callback) {
                $element.loadModule(url, {
                    afterAppend: callback
                });
            };

            return self;
        };

        BASE.extend(UrlLoadedController, Super);

        return UrlLoadedController;
    }(WEB.ui.Controller));
});