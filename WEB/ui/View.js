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

            Object.defineProperties(self, {
                "parentView": {
                    get: function () {
                        var $parent = $element.parents("[data-view]");
                        if ($parent.length > 0) {
                            return $parent.first().data("view");
                        } else {
                            return null;
                        }
                    }
                },
                "subviews": {
                    get: function () {
                        var views = [];
                        var $children = $element.find("[data-view]");
                        if ($children.length > 0) {
                            var $siblings = $children.first().siblings();

                            $siblings.add($children.first()).each(function () {
                                var $this = $(this);
                                var view = $this.data("view");
                                if (view && view instanceof WEB.ui.View) {
                                    views.push(view);
                                } else {
                                    view = $this.find("[data-view]").first().data("view");
                                    if (view && view instanceof WEB.ui.View) {
                                        views.push(view);
                                    }
                                }

                            });
                        }
                        return views;
                    }
                }
            });

            self.loadSubview = function (viewUrl, options) {
                options = options || {};
                var beforeAppend = options.beforeAppend || function () { };
                var afterAppend = options.afterAppend || function () { };

                $.loadFile(viewUrl, {
                    success: function (html) {
                        var $elem = $(html);
                        WEB.MVC.applyTo($elem[0], function () {
                            view = $elem.data("view");
                            beforeAppend(view);
                            self.addSubview(view, function () {
                                afterAppend(view);
                            });
                        });
                    },
                    error: function (e) {
                        throw new Error("Couldn't load view at \"" + viewUrl + "\".");
                    }
                });
            };

            self.addSubview = function (view, callback) {
                callback = callback || function () { };
                $(view.element).appendTo(self.element);
                setTimeout(function () {
                    callback();
                }, 0);
            };

            self.removeSubview = function (view, callback) {
                callback = callback || function () { };
                $(self.element).remove();
                setTimeout(function () {
                    callback();
                }, 0);
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
