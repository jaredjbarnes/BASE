BASE.require(["BASE.Observer"], function () {

    BASE.namespace("WEB.ui");

    WEB.ui.Controller = function (view) {
        if (!(this instanceof arguments.callee)) {
            return new WEB.ui.Controller(view);
        }

        var self = this;
        if (view) {
            var $element = $(view.element);
        }
        BASE.Observer.call(self);

        self.getViewById = function (id) {
            $view = $element.find("#" + id + "[data-view]");
            return $view[0].view;
        }

        self.view = view;
        return self;
    };

    WEB.ui.Controller.prototype = new BASE.Observer();
});