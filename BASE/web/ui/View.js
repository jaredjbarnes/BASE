BASE.require(["BASE.Observable", "jQuery", "jQuery.fn.region", "BASE.Future"], function () {

    BASE.namespace("BASE.web.ui");

    $(window).bind("resize", function () {
        var view = $("[data-view]").first().data("view");
        view.notifySubviews(new BASE.ObservableEvent("resize"));
    });

    BASE.web.ui.View = (function (Super) {

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
                            if (parentView instanceof View) {
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
                                var view = $this.data("view");
                                if (view instanceof View) {
                                    views.push(view);
                                }

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

            var _modalOverlayColor = "rgba(0,0,0,0.65)";
            Object.defineProperty(self, "modalOverlayColor", {
                get: function () {
                    return _modalOverlayColor;
                },
                set: function (value) {
                    var oldValue = _modalOverlayColor;
                    if (value !== _modalOverlayColor) {
                        _modalOverlayColor = value;
                        self.notify(new BASE.PropertyChangedEvent("modalOverlayColor", oldValue, value));
                    }
                }
            });

            var _modalView = null;
            var _modalOverlayView = null;
            Object.defineProperty(self, "modalView", {
                get: function () {
                    return _modalView;
                },
                set: function (value) {
                    var oldValue = _modalView;
                    if (value !== _modalView) {
                        _modalView = value;
                        self.notify(new BASE.PropertyChangedEvent("modalView", oldValue, value));
                    }
                }
            });

            Object.defineProperty(self, "data", {
                configurable: false,
                enumerable: false,
                value: function () {
                    return $element.data.apply($element, arguments);
                }
            });

            self.style = function () {
                $element.css.apply($element, arguments);
                return self;
            };

            self.onResize = function (callback) {
                self.observe(callback, "resize");
            };

            self.loadSubview = function (viewUri, options) {
                options = options || {};
                var beforeAppend = options.beforeAppend || function () { };
                var afterAppend = options.afterAppend || function () { };

                View.createViewFromUri(viewUri).then(function (view) {
                    beforeAppend(view);
                    self.addSubview(view, function () {
                        afterAppend(view);
                    });
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

            self.loadSubviewBefore = function (viewUri, view, options) {
                options = options || {};
                var beforeAppend = options.beforeAppend || function () { };
                var afterAppend = options.afterAppend || function () { };

                View.createViewFromUri(viewUri).then(function (newView) {
                    beforeAppend(newView);
                    self.insertSubviewBefore(newView, view, function () {
                        afterAppend(newView);
                    });
                });
            };

            self.insertSubviewBefore = function (newView, view, callback) {
                callback = callback || function () { };
                $element.find(view.element).before(newView.element);
                setTimeout(function () {
                    callback();
                }, 0);
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

            self.addModalView = function (view, callback) {
                _modalOverlayView = new BASE.web.ui.View();
                self.addSubview(_modalOverlayView, function () {
                    _modalOverlayView.style({
                        position: "absolute",
                        top: "0px",
                        left: "0px",
                        width: "100%",
                        height: "100%",
                        zIndex: 3999,
                        backgroundColor: _modalOverlayColor
                    });

                    _modalOverlayView.addSubview(view, function () {
                        view.style({
                            position: "absolute",
                            top: "5%",
                            left: "5%",
                            width: "90%",
                            height: "90%",
                            zIndex: 4000
                        });
                        _modalView = view;
                        callback();
                    });
                });
            };

            self.removeModalView = function (callback) {
                if (_modalView) {
                    callback = callback || function () { };
                    self.removeSubview(_modalOverlayView);
                    self.removeSubview(_modalView, function () {
                        _modalView = null;
                        callback();
                    });
                }
            };

            self.loadModalView = function (viewUri, options) {
                options = options || {};
                var beforeAppend = options.beforeAppend || function () { };
                var afterAppend = options.afterAppend || function () { };

                View.createViewFromUri(viewUri).then(function (view) {
                    beforeAppend(view);
                    self.addModalView(view, function () {
                        afterAppend(view);
                    });
                });
            };

            return self;
        };

        BASE.extend(View, Super);

        View.createViewFromUri = function (viewUri) {
            return new BASE.Future(function (setValue, setError) {
                $.loadFile(viewUri, {
                    success: function (html) {
                        var $elem = $(html);
                        BASE.web.ui.mvc.applyTo($elem[0], function () {
                            var view = $elem.data("view");
                            setValue(view);
                        });
                    },
                    error: function (e) {
                        throw new Error("Couldn't load view at \"" + viewUri + "\".");
                    }
                });
            });
        };

        return View;
    })(BASE.Observable);

});
