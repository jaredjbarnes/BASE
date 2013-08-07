BASE.require([
    "BASE.util.Observable",
    "jQuery.loadFile",
    "BASE.web.ui.View",
    "BASE.async.Future",
    "BASE.async.Task"
], function () {

    BASE.namespace("BASE.web.ui");

    var Task = BASE.async.Task;
    var Future = BASE.async.Future;

    BASE.web.ui.Controller = (function (Super) {

        var Controller = function (view) {

            if (!(this instanceof arguments.callee)) {
                return new Controller(view);
            }

            var self = this;
            view = view || new BASE.web.ui.View();
            var $element = $(view.element);
            Super.call(self);

            self.getViewByDataId = function (id) {
                return self.view.getViewByDataId(id);
            }

            self.getViewByQuery = function (query) {
                return self.view.getViewByQuery(query);
            };

            self.getControllerByDataId = function (id) {
                return self.getControllerByQuery("[data-id='" + id + "']");
            };

            self.getControllerByQuery = function (query) {
                var $controller = $element.find(query + "[data-controller]");
                return $controller.length > 0 ? $controller.data("controller") : null;
            };

            self.removeController = function (controller) {
                if ($element.find(controller.view.element).length > 0) {
                    controller.view.remove();
                }
            };

            self.remove = function () {
                var parent = self.parentController;
                if (parent) {
                    parent.removeController(self);
                }
            };

            Object.defineProperty(self, "addController", {
                enumerable: true,
                configurable: false,
                value: function (controller, view) {
                    view = view || self.view;
                    view.addSubview(controller.view);
                }
            });

            Object.defineProperty(self, "loadController", {
                enumerable: true,
                configurable: false,
                value: function (uri, view) {
                    var beforeControllerAdded = function () { };
                    var afterControllerAdded = function () { };

                    var future = Controller.createControllerFromUri(uri).then(function (controller) {
                        beforeControllerAdded(controller);
                        self.addController(controller, view);
                        afterControllerAdded(controller);
                    });

                    future.beforeControllerAdded = function (callback) {
                        beforeControllerAdded = callback;
                        return future;
                    };

                    future.afterControllerAdded = function (callback) {
                        afterControllerAdded = callback;
                        return future;
                    };

                    return future;
                }
            });

            Object.defineProperties(self, {
                childControllers: {
                    get: function () {
                        var controllers = [];
                        var $children = $element.find("[data-controller]").each(function () {
                            var $this = $(this);
                            if ($this.parents("[data-controller]")[0] === $element[0]) {
                                controllers.push($this.data("controller"));
                            }
                        });
                        return controllers;
                    }
                },
                view: {
                    get: function () {
                        return view;
                    }
                },
                parentController: {
                    get: function () {
                        var $parent = $element.parents("[data-controller]");
                        if ($parent.length > 0) {
                            return $parent.first().data("controller");
                        } else {
                            return null;
                        }
                    }
                }
            });

            Object.defineProperty(self, "rootController", {
                get: function () {
                    var rootController = self;
                    while (rootController.parentController) {
                        rootController = rootController.parentController;
                    }
                    return rootController;
                }

            });

            Object.defineProperty(self, "bubble", {
                enumerable: true,
                configurable: false,
                value: function (event) {
                    if (!(event instanceof BASE.util.PropagatingEvent)) {
                        throw new Error("Event wasn't an instance of PropagationEvent");
                    }

                    if (!event.isPropagationStopped) {

                        self.notify(event);
                        if (self.parentController) {
                            self.parentController.bubble(event);
                        }

                    }
                }
            });

            Object.defineProperty(self, "trickle", {
                enumerable: true,
                configurable: false,
                value: function (event) {
                    if (!(event instanceof BASE.util.PropagatingEvent)) {
                        throw new Error("Event wasn't an instance of PropagationEvent");
                    }

                    if (!event.isPropagationStopped) {
                        self.notify(event);
                        self.childControllers.forEach(function (controller) {
                            controller.trickle(event);
                        });
                    }
                }
            });

            return self;
        };

        BASE.extend(Controller, Super);
        Object.defineProperty(Controller, "createControllerFromUri", {
            enumerable: false,
            configurable: false,
            value: function (controllerUri) {
                return new BASE.async.Future(function (setValue, setError) {
                    $.loadFile(controllerUri, {
                        success: function (html) {
                            var $elem = $(html);
                            BASE.web.ui.mvc.applyTo($elem[0], function () {
                                var controller = $elem.data("controller");
                                setValue(controller);
                            });
                        },
                        error: function (e) {
                            throw new Error("Couldn't load controller at \"" + controllerUri + "\".");
                        }
                    });
                });
            }
        });

        return Controller;

    })(BASE.util.Observable);

});