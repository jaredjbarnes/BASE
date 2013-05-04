BASE.require([
    "BASE.Observable",
    "jQuery",
    "jQuery.fn.region",
    "BASE.Future",
    "BASE.Hashmap",
    "BASE.PropagatingEvent"
], function () {

    BASE.namespace("BASE.web.ui");

    // This is an effecient way to notify views that the window resized.
    $(window).bind("resize", function () {
        var view = $("[data-view]").first().data("view");
        if (view instanceof BASE.web.ui.View) {
            view.trickle(new BASE.PropagatingEvent("boundsChange"));
        }
    });

    var Task = BASE.Task;
    var Future = BASE.Future;

    BASE.web.ui.View = (function (Super) {

        var View = function (elem) {
            if (!(this instanceof arguments.callee)) {
                return new View(elem);
            }

            var self = this;
            Super.call(self);

            if (!elem) {
                if (self.constructor === BASE.web.ui.View) {
                    elem = document.createElement("div");
                    $(elem).attr("data-view", "BASE.web.ui.View");
                    $(elem).data("view", self);
                } else {
                    throw new Error("Views cannot be instantiated directly without a element to belong to.");
                }
            }

            self.element = elem;
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
                        if (typeof val === "number" && val !== parseInt($element.css("width"))) {
                            $element.css("width", val + "px");
                            var event = new BASE.ObservableEvent("boundsChange");
                            self.notify(event);
                        }
                    }
                },
                "height": {
                    get: function () {
                        return parseInt($element.css("height"), 10);
                    },
                    set: function (val) {
                        if (typeof val === "number" && val !== parseInt($element.css("height"))) {
                            $element.css("height", val + "px");
                            var event = new BASE.ObservableEvent("boundsChange");
                            self.notify(event);
                        }
                    }
                },
                "region": {
                    get: function () {
                        //This forces a redraw on browsers to ensure accurate regions.
                        $element.css("left");
                        return $element.region();
                    }
                }
            });

            var _containerElement = elem;
            Object.defineProperty(self, "containerElement", {
                configurable: true,
                enumerable: true,
                get: function () {
                    return _containerElement;
                },
                set: function (value) {
                    var oldValue = _containerElement;
                    if (value !== _containerElement) {
                        _containerElement = value;
                        self.notify(new BASE.PropertyChangedEvent("containerElement", oldValue, value));
                    }
                }
            });

            Object.defineProperty(self, "rootView", {
                get: function () {
                    var rootView = self;
                    while (rootView.parent) {
                        rootView = rootView.parent;
                    }
                    return rootView;
                }
            });

            Object.defineProperty(self, "data", {
                configurable: false,
                enumerable: false,
                value: function () {
                    return $element.data.apply($element, arguments);
                }
            });

            Object.defineProperty(self, "style", {
                enumerable: true,
                configurable: false,
                value: function () {
                    var result = $element.css.apply($element, arguments);
                    if (result === $element) {
                        return self;
                    } else {
                        return result;
                    }
                }
            });

            Object.defineProperty(self, "onBoundsChange", {
                enumerable: true,
                configurable: false,
                value: function (callback) {
                    self.observe(callback, "boundsChange");
                }
            });

            Object.defineProperty(self, "removeOnBoundsChange", {
                enumerable: true,
                configurable: false,
                value: function (callback) {
                    self.unobserve(callback, "boundsChange");
                }
            });

            Object.defineProperty(self, "bubble", {
                enumerable: true,
                configurable: false,
                value: function (event) {
                    if (!(event instanceof BASE.PropagatingEvent)) {
                        throw new Error("Event wasn't an instance of PropagationEvent");
                    }

                    if (!event.isPropagationStopped) {

                        self.notify(event);
                        if (self.parentView) {
                            self.parentView.bubble(event);
                        }

                    }
                }
            });

            Object.defineProperty(self, "trickle", {
                enumerable: true,
                configurable: false,
                value: function (event) {
                    if (!(event instanceof BASE.PropagatingEvent)) {
                        throw new Error("Event wasn't an instance of PropagationEvent");
                    }

                    if (!event.isPropagationStopped) {
                        self.notify(event);
                        self.subviews.forEach(function (view) {
                            view.trickle(event);
                        });
                    }
                }
            });

            Object.defineProperty(self, "insertSubviewBefore", {
                enumerable: true,
                configurable: false,
                value: function (newView, view) {
                    var childView = $(self.containerElement).find(view.element);

                    if (childView.length > 0) {
                        var beforeEvent = new BASE.ObservableEvent("beforeSubviewAdded");
                        beforeEvent.subview = newView;
                        self.notify(beforeEvent);

                        var beforeViewAddedToParentEvent = new BASE.ObservableEvent("beforeViewAddedToParent");
                        beforeViewAddedToParentEvent.subview = view;
                        view.notify(beforeViewAddedToParentEvent)

                        childView.before(newView.element);

                        return new Future(function (setValue, setError) {
                            var afterViewAddedToParentEvent = new BASE.ObservableEvent("afterViewAddedToParent");
                            afterViewAddedToParentEvent.subview = view;

                            var afterEvent = new BASE.ObservableEvent("afterSubviewAdded");
                            afterEvent.subview = newView;

                            new Task(view.notify(afterViewAddedToParentEvent), self.notify(afterEvent)).start().whenAll(function () {
                                setValue(newView);
                            });
                        }).then();

                    } else {
                        throw new Error("Cannot find view to insert before.");
                    }
                }
            });

            Object.defineProperty(self, "addSubview", {
                enumerable: true,
                configurable: false,
                value: function (view) {
                    var beforeEvent = new BASE.ObservableEvent("beforeSubviewAdded");
                    beforeEvent.subview = view;
                    self.notify(beforeEvent);

                    var beforeViewAddedToParentEvent = new BASE.ObservableEvent("beforeViewAddedToParent");
                    beforeViewAddedToParentEvent.subview = view;
                    view.notify(beforeViewAddedToParentEvent);

                    $(view.element).appendTo(self.containerElement);

                    return new Future(function (setValue, setError) {
                        var afterViewAddedToParentEvent = new BASE.ObservableEvent("afterViewAddedToParent");
                        afterViewAddedToParentEvent.subview = view;

                        var afterEvent = new BASE.ObservableEvent("afterSubviewAdded");
                        afterEvent.subview = view;

                        new Task(view.notify(afterViewAddedToParentEvent), self.notify(afterEvent)).start().whenAll(function () {
                            setValue(view);
                        });

                    }).then();

                }
            });

            Object.defineProperty(self, "removeSubview", {
                enumerable: true,
                configurable: false,
                value: function (view) {

                    var beforeSubviewRemovedEvent = new BASE.ObservableEvent("beforeSubviewRemoved");
                    beforeSubviewRemovedEvent.subview = view;

                    var beforeViewRemovedFromParentEvent = new BASE.ObservableEvent("beforeViewRemovedFromParent");
                    beforeViewRemovedFromParentEvent.subview = view;

                    return new Future(function (setValue, setError) {
                        new Task(view.notify(beforeViewRemovedFromParentEvent), self.notify(beforeSubviewRemovedEvent)).start().whenAll(function () {

                            $(view.element).remove();

                            setValue(view);

                            var afterViewRemovedFromParentEvent = new BASE.ObservableEvent("afterViewRemovedFromParent");
                            afterViewRemovedFromParentEvent.subview = view;
                            view.notify(afterViewRemovedFromParentEvent);

                            var afterSubviewRemovedEvent = new BASE.ObservableEvent("afterSubviewRemoved");
                            afterSubviewRemovedEvent.subview = view;
                            self.notify(afterSubviewRemovedEvent);

                        });
                    }).then();

                }
            });

            Object.defineProperty(self, "loadSubview", {
                enumerable: true,
                configurable: false,
                value: function (uri) {
                    var beforeSubviewAdded = function () { };
                    var afterSubviewAdded = function () { };

                    var future = View.createViewFromUri(uri).then(function (view) {
                        beforeSubviewAdded(view);
                        self.addSubview(view).then(function () {
                            afterSubviewAdded(view);
                        });
                    });

                    future.beforeSubviewAdded = function (callback) {
                        beforeSubviewAdded = callback;
                        return future;
                    };

                    future.afterSubviewAdded = function (callback) {
                        afterSubviewAdded = callback;
                        return future;
                    };
                    return future;
                }
            });

            Object.defineProperty(self, "loadSubviewBefore", {
                enumerable: true,
                configurable: false,
                value: function (uri, beforeView) {
                    var beforeSubviewAdded = function () { };
                    var afterSubviewAdded = function () { };

                    var future = View.createViewFromUri(uri).then(function (view) {
                        beforeSubviewAdded(view);
                        self.insertSubviewBefore(view, beforeView).then(function () {
                            afterSubviewAdded(view);
                        });
                    });

                    future.beforeSubviewAdded = function (callback) {
                        beforeSubviewAdded = callback;
                        return future;
                    };

                    future.afterSubviewAdded = function (callback) {
                        afterSubviewAdded = callback;
                        return future;
                    };

                    return future;
                }
            });

            Object.defineProperty(self, "getViewByDataId", {
                enumerable: true,
                configurable: false,
                value: function (id) {
                    return self.getViewByQuery("[data-id='" + id + "']");
                }
            });

            Object.defineProperty(self, "getViewByQuery", {
                enumerable: true,
                configurable: false,
                value: function (query) {
                    var $view = $element.find(query + "[data-view]");
                    return $view.length > 0 ? $view.data("view") : null;
                }
            });

            Object.defineProperty(self, "remove", {
                enumerable: true,
                configurable: false,
                value: function () {
                    var parent = self.parentView;

                    if (parent) {
                        return parent.removeSubview(self);
                    } else {
                        return BASE.Future(function (setValue) {
                            setTimeout(function () {
                                setValue(self);
                            }, 0);
                        });
                    }
                }
            });

            var _behaviors = new BASE.Hashmap();

            Object.defineProperty(self, "behaviors", {
                enumerable: true,
                configurable: false,
                value: {
                    get: function (Type) {
                        return _behaviors.get(Type);
                    },
                    add: function (Type) {
                        var instance;
                        if (!_behaviors.hasKey(Type)) {
                            instance = new Type();
                            instance.start(self);
                            _behaviors.add(Type, instance);
                        } else {
                            instance = _behaviors.get(Type);
                        }
                        return instance;
                    },
                    remove: function (Type) {
                        var instance = _behaviors.remove(Type);
                        instance.end();
                    }
                }
            });

            return self;
        };

        BASE.extend(View, Super);

        Object.defineProperty(View, "createViewFromUri", {
            enumerable: true,
            configurable: false,
            value: function (viewUri) {
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
            }
        });

        return View;
    })(BASE.Observable);

});
