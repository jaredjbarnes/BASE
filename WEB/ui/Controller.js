BASE.require(["BASE.Observer"], function () {

    BASE.namespace("WEB.ui");

    WEB.ui.Controller = (function (Super) {

        var Controller = function (view) {
            if (!(this instanceof arguments.callee)) {
                return new Controller(view);
            }

            var self = this;
            if (view) {
                var $element = $(view.element);
            }
            Super.call(self);

            self.getViewByDataId = function (id) {
                $view = $element.find("[data-id='" + id + "'][data-view]");
                return $view.length > 0 ? $view[0].view : null;
            }

            self.getViewByQuery = function (query) {
                var $view = $element.find(query + "[data-view]");
                return $view.length > 0 ? $view[0].view : null;
            };

            self.view = view;
            return self;
        };
        BASE.extend(Controller, Super);

        return Controller;

    })(BASE.Observer);

    WEB.ui.Controller.prototype = new BASE.Observer();
});