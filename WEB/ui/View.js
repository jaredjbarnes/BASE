BASE.require(["BASE.Observer"], function () {

    BASE.namespace("WEB.ui");

    WEB.ui.View = function (elem) {
        if (!(this instanceof arguments.callee)) {
            return new WEB.ui.View(elem);
        }

        var self = this;
        BASE.Observer.call(self);

        self.element = elem;
        return self;
    };

    WEB.ui.View.prototype = new BASE.Observer();
});