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

            var _controllers = new BASE.ObservableArray();

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


            self.pushController = function (controller, callback) {
                callback = callback || function () { };
                self.controllers.add(controller);
                controller.parent = self;
                $(controller.view.element).appendTo(view.element);
                setTimeout(function () {
                    callback();
                }, 0);
            };

            self.popController = function (callback) {
                callback = callback || function () { };
                var controller = self.controllers.pop();
                controller.parent = null;
                $(controller.view.element).remove();
                setTimeout(function () {
                    callback();
                }, 0);
            };

            self.loadView = function (viewUrl, options) {
                self.view.loadView(viewUrl, options);
            };

            self.loadController = function (controllerNamespace, viewUrl, options) {
                options = options || {};
                var beforeAppend = options.beforeAppend || function () { };
                var afterAppend = options.afterAppend || function () { };
                var synchronizer = new BASE.Synchronizer();
                var view = null;
                var Controller = null;

                synchronizer.add(function (callback) {
                    BASE.require([controllerNamespace], function () {
                        Controller = BASE.getObject(controllerNamespace);
                        callback();
                    });
                });

                synchronizer.add(function (callback) {
                    $.loadFile(viewUrl, {
                        success: function (html) {
                            var $elem = $(html);
                            WEB.MVC.applyTo($elem[0], function () {
                                view = $elem.data("view");
                                callback();
                            });
                        }
                    });
                }, function () {
                    beforeAppend(view);
                    $elem.appendTo(self.view.element);
                    afterAppend(view);
                    var controller = new Controller(view);
                    self.controllers.add(controller);
                    callback(controller);
                });
            };


            Object.defineProperties(self, {
                controllers: {
                    get: function () {
                        return _controllers;
                    }
                },
                view: {
                    get: function () {
                        return view;
                    }
                }
            });

            self.parent = null;

            return self;
        };
        BASE.extend(Controller, Super);

        return Controller;

    })(BASE.Observable);

});