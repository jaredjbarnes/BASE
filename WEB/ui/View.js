BASE.require(["BASE.Observer"], function () {

    BASE.namespace("WEB.ui");

    WEB.ui.View = (function (Super) {

        var View = function (elem) {
            if (!(this instanceof arguments.callee)) {
                return new View(elem);
            }

            var self = this;
            Super.call(self);

            self.element = elem;
            return self;
        };

        BASE.extend(View, Super);

        return View;
    })(BASE.Observer);

});