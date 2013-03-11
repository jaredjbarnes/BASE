BASE.require(["BASE.Observable", "jQuery", "jQuery.fn.region"], function () {

    BASE.namespace("WEB.ui");

    $(window).bind("resize", function () {
        $("[data-view]").first().data("view").notifySubviews(new BASE.ObservableEvent("resize"));
    });

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
                            var parentView = $parent.first().data("view");
                            if (parentView instanceof WEB.ui.View) {
                                return parentView;
                            } else {
                                return null;
                            }
                            return
                        } else {
                            return null;
                        }
                    }
                },
                "subviews": {
                    get: function () {
                        var views = [];
                        var $children = $element.find("[data-view]").each(function () {
                            var $this = $(this);
                            if ($this.parents("[data-view]")[0] === $element[0]) {
                                views.push($this.data("view"));
                            }
                        });
                        return views;
                    }
                },
                "width": {
                    get: function () {
                        return parseInt($element.css("width"), 10);
                    },
                    set: function (val) {
                        if (typeof val === "number") {
                            $element.css("width", val + "px");
                        }
                    }
                },
                "height": {
                    get: function () {
                        return parseInt($element.css("height"), 10);
                    },
                    set: function (val) {
                        if (typeof val === "number") {
                            $element.css("height", val + "px");
                        }
                    }
                },
                "region": {
                    get: function () {
                        //This forces a redraw
                        $element.css("left");
                        return $element.region();
                    }
                }
            });

            self.onResize = function (callback) {
                self.observe(callback, "resize");
            };

            self.loadSubview = function (viewUrl, options) {
                options = options || {};
                var beforeAppend = options.beforeAppend || function () { };
                var afterAppend = options.afterAppend || function () { };

                $.loadFile(viewUrl, {
                    success: function (html) {
                        var $elem = $(html);
                        WEB.MVC.applyTo($elem[0], function () {
                            var view = $elem.data("view");
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

            var defaultNotify = self.notify;

            self.notify = function (event) {
                defaultNotify.call(self, event);
                if (self.parentView) {
                    self.parentView.notify(event);
                }
            };

            self.notifySubviews = function (event) {
                defaultNotify.call(self, event);
                self.subviews.forEach(function (view) {
                    view.notifySubviews(event);
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
                $(view.element).remove();

                var event = new BASE.ObservableEvent("viewRemoved");
                event.view = view;
                self.notify(event);

                view.notify(event);

                var sEvent = new BASE.ObservableEvent("subviewRemoved");
                sEvent.view = view;
                defaultNotify.call(self, sEvent);

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

            self.remove = function (callback) {
                if (self.parentView) {
                    self.parentView.removeSubview(self, callback);
                }
            };

            return self;
        };

        BASE.extend(View, Super);

        return View;
    })(BASE.Observable);

});
