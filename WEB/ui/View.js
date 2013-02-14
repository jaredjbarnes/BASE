BASE.require(["BASE.Observable"], function () {

    BASE.namespace("WEB.ui");

    WEB.ui.View = (function (Super) {

        var View = function (elem) {
            if (!(this instanceof arguments.callee)) {
                return new View(elem);
            }

            var self = this;
            Super.call(self);

            self.element = elem || document.createElement("div");
            var $element = $(self.element);

            self.loadView = function (viewUrl, options) {
                options = options || {};
                var beforeAppend = options.beforeAppend || function () { };
                var afterAppend = options.afterAppend || function () { };

                $.loadFile(viewUrl, {
                    success: function (html) {
                        var $elem = $(html);
                        WEB.MVC.applyTo($elem[0], function () {
                            view = $elem.data("view");
                            beforeAppend(view);
                            $elem.appendTo(self.element);
                            afterAppend(view);
                        });
                    },
                    error: function (e) {
                        throw new Error("Couldn't load view at \"" + viewUrl + "\".");
                    }
                });
            };

            self.getViewByDataId = function (id) {
                return self.getViewByQuery("[data-id='" + id + "']");
            }

            self.getViewByQuery = function (query) {
                var $view = $element.find(query + "[data-view]");
                return $view.length > 0 ? $view.data("view") : null;
            };

            return self;
        };

        BASE.extend(View, Super);

        return View;
    })(BASE.Observable);

});
