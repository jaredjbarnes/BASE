BASE.require([
    "jQuery",
    "BASE.Future",
    "BASE.Task",
    "jQuery.loadFile"
], function () {

    BASE.namespace("BASE.web.ui");

    var asyncWalkTheDom = function (elem, callback) {
        callback = callback || function () { };
        var task = new BASE.Task();

        var walkTheDom = function ($elem) {
            var $children = $elem.children();
            $children.each(function () {
                walkTheDom($(this));
            });

            var controllerNamespace = $elem.data("controller");
            var viewNamespace = controllerNamespace && !$elem.data("view") ? "BASE.web.ui.View" : $elem.data("view");
            var controllerUrl = $elem.data("load-controller");
            var behaviorAttribute = $elem.data("behaviors");
            var behaviorNamespaces = behaviorAttribute ? behaviorAttribute.split("|") : [];
            var viewUrl = $elem.data("load-view");
            var innerTask = new BASE.Task();

            if (viewNamespace || controllerNamespace || controllerUrl || viewUrl) {
                var viewFuture = new BASE.Future(function (setValue, setError) {
                    BASE.require([viewNamespace], function () {
                        var View = BASE.getObject(viewNamespace);
                        setValue(View);
                    });
                });

                var controllerFuture = new BASE.Future(function (setValue, setError) {
                    BASE.require([controllerNamespace], function () {
                        var Controller = BASE.getObject(controllerNamespace);
                        setValue(Controller);
                    });
                });

                var behaviorsFuture = new BASE.Future(function (setValue, setError) {
                    var Behaviors = [];

                    BASE.require(behaviorNamespaces, function () {
                        behaviorNamespaces.forEach(function (namespace) {
                            Behaviors.push(BASE.getObject(namespace));
                        });
                        setValue(Behaviors);
                    });
                });

                var controllerMarkupFuture = new BASE.Future(function (setValue, setError) {
                    if (controllerUrl) {
                        jQuery.loadFile(controllerUrl, {
                            success: function (html) {
                                var $loadedController = $(html);
                                var attributes = $elem.prop("attributes");

                                for (var x = 0 ; x < attributes.length; x++) {
                                    if (attributes[x].name !== "data-view" &&
                                     attributes[x].name !== "data-controller" &&
                                     attributes[x].name !== "data-load-view" &&
                                     attributes[x].name !== "data-load-controller") {
                                        $loadedController.attr(attributes[x].name, attributes[x].value);
                                    }
                                }

                                BASE.web.ui.mvc.applyTo($loadedController[0], function () {
                                    setValue($loadedController);
                                });
                            },
                            error: function () {
                                throw new Error("Couldn't find controller at \"" + controllerUrl + "\".");
                            }
                        });
                    } else {
                        setValue(undefined);
                    }
                });

                var viewMarkupFuture = new BASE.Future(function (setValue, setError) {
                    if (viewUrl && !controllerUrl) {
                        jQuery.loadFile(viewUrl, {
                            success: function (html) {
                                var $loadedView = $(html);
                                var attributes = $elem.prop("attributes");

                                for (var x = 0 ; x < attributes.length; x++) {
                                    if (attributes[x].name !== "data-view" &&
                                     attributes[x].name !== "data-controller" &&
                                     attributes[x].name !== "data-load-view" &&
                                     attributes[x].name !== "data-load-controller") {
                                        $loadedView.attr(attributes[x].name, attributes[x].value);
                                    }
                                }

                                BASE.web.ui.mvc.applyTo($loadedView[0], function () {
                                    setValue($loadedView);
                                });
                            },
                            error: function () {
                                throw new Error("Couldn't find view at \"" + viewUrl + "\".");
                            }
                        });
                    } else {
                        setValue(undefined);
                    }
                });

                var allFuture = new BASE.Future(function (setValue, setError) {

                    innerTask.add(viewFuture,
                    controllerFuture,
                    behaviorsFuture,
                    controllerMarkupFuture,
                    viewMarkupFuture).start().whenAll(function () {
                        setValue({
                            viewNamespace: viewNamespace,
                            View: viewFuture.value,
                            Controller: controllerFuture.value,
                            Behaviors: behaviorsFuture.value,
                            $controller: controllerMarkupFuture.value,
                            $view: viewMarkupFuture.value,
                            $elem: $elem
                        });
                    });
                });

                task.add(allFuture);
            };

        };

        walkTheDom($(elem));

        task.start().whenAll(function (futures) {
            futures.forEach(function (future) {
                var value = future.value;
                var View = value.View;
                var Controller = value.Controller;
                var Behaviors = value.Behaviors;
                var $loadedController = value.$controller;
                var $loadedView = value.$view;
                var $elem = value.$elem;
                var viewNamespace = value.viewNamespace;

                var view;
                var controller;

                if (View) {
                    view = new View($elem[0]);
                    $elem.data("view", view);
                    $elem.attr("data-view", viewNamespace);

                    // Add behaviors
                    Behaviors.forEach(function (Behavior) {
                        view.behaviors.add(Behavior);
                    });
                }

                if (Controller) {
                    controller = new Controller(view);
                    $elem.data("controller", controller);
                }

                if ($loadedController) {
                    $elem.replaceWith($loadedController);
                }

                if ($loadedView) {
                    $elem.replaceWith($loadedView);
                }

                callback();
            });
        });

    };

    BASE.web.ui.mvc = {
        applyTo: asyncWalkTheDom
    };

    $(function () { BASE.web.ui.mvc.applyTo($("html")[0]); });
});