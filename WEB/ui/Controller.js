BASE.require(["BASE.Observable", "BASE.Hashmap", "BASE.ObservableArray", "BASE.Synchronizer", "jQuery.loadFile", "WEB.ui.View"], function () {

    BASE.namespace("WEB.ui");

    WEB.ui.Controller = (function (Super) {

        var Controller = function (view) {
            ///<param type="WEB.ui.View" name="view"></param>

            if (!(this instanceof arguments.callee)) {
                return new Controller(view);
            }

            var self = this;
            view = view || new WEB.ui.View();
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

            self.addChildController = function (controller, callback) {
                callback = callback || function () { };
                self.view.addSubview(controller.view, function () {
                    controller.parent = self;
                    self.controllers.add(controller);
                    callback();
                });
            };

            self.removeChildController = function (controller, callback) {
                callback = callback || function () { };
                self.view.removeSubview(controller.view, function () {
                    self.controllers.remove(controller);
                    controller.parent = null;
                    callback();
                });
            };

            self.loadChildController = function (controllerUrl, options) {
                options = options || {};
                var beforeAppend = options.beforeAppend || function () { };
                var afterAppend = options.afterAppend || function () { };

                jQuery.loadFile(controllerUrl, {
                    success: function (html) {
                        var $module = $(html);
                        WEB.MVC.applyTo($module[0], function () {
                            var controller = $module.data("controller");
                            var view = $module.data("view");

                            beforeAppend(controller);
                            self.addChildController(controller, function () {
                                afterAppend(controller);
                            });
                        });
                    },
                    error: function () {
                        throw new Error("Couldn't find controller at \"" + controllerUrl + "\".");
                    }
                });
            };


            Object.defineProperties(self, {
                childControllers: {
                    get: function () {
                        var controllers = [];
                        var $children = $element.find("[data-controller]").each(function () {
                            var $this = $(this);
                            if ($this.parents("[data-controller]")[0] !== $element[0]) {
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

            return self;
        };
        BASE.extend(Controller, Super);

        return Controller;

    })(BASE.Observable);

});