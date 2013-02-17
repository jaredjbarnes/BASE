BASE.require(["jQuery", "BASE.Synchronizer", "jQuery.loadFile"], function () {

    BASE.namespace("WEB");

    var asyncWalkTheDom = function (elem, callback) {
        callback = callback || function () { };
        var synchronizer = new BASE.Synchronizer();

        var walkTheDom = function ($elem) {
            var $children = $elem.children();
            $children.each(function () {
                walkTheDom($(this));
            });

            var viewNamespace = $elem.data("view") || "WEB.ui.View";
            var controllerNamespace = $elem.data("controller");
            var controllerUrl = $elem.data("loadcontroller");
            var viewUrl = $elem.data("loadview");

            if (viewNamespace || controllerNamespace || controllerUrl || viewUrl) {
                var View;
                var Controller;
                var $loadedView;
                var $loadedController;

                synchronizer.add(function (callback) {
                    var innerSynchronizer = new BASE.Synchronizer();

                    innerSynchronizer.add(function (callback) {
                        if (viewNamespace || controllerNamespace) {
                            BASE.require([viewNamespace, controllerNamespace], function () {
                                View = BASE.getObject(viewNamespace);
                                Controller = BASE.getObject(controllerNamespace);
                                callback();
                            });
                        } else {
                            callback();
                        }
                    });

                    innerSynchronizer.add(function (callback) {
                        if (controllerUrl) {
                            jQuery.loadFile(controllerUrl, {
                                success: function (html) {
                                    $loadedController = $(html);
                                    WEB.MVC.applyTo($loadedController[0], function () {
                                        callback();
                                    });
                                },
                                error: function () {
                                    throw new Error("Couldn't find controller at \"" + controllerUrl + "\".");
                                }
                            });
                        } else {
                            callback();
                        }
                    });

                    innerSynchronizer.add(function (callback) {
                        if (viewUrl && !controllerUrl) {
                            jQuery.loadFile(viewUrl, {
                                success: function (html) {
                                    $loadedView = $(html);
                                    WEB.MVC.applyTo($loadedView[0], function () {
                                        callback();
                                    });
                                },
                                error: function () {
                                    throw new Error("Couldn't find view at \"" + viewUrl + "\".");
                                }
                            });
                        } else {
                            callback();
                        }
                    });

                    innerSynchronizer.start(function () {
                        callback();
                    });
                }, function () {
                    var view;
                    var controller;

                    if (View) {
                        view = new View($elem[0]);
                        $elem.data("view", view);
                        $elem.attr("data-view", viewNamespace);
                    }

                    if (Controller) {
                        controller = new Controller(view);
                        $elem.data("controller", controller);
                    }

                    if ($loadedController) {
                        var attributes = $elem.prop("attributes");

                        for (var x = 0 ; x < attributes.length; x++) {
                            if (attributes[x].name !== "data-view" && attributes[x].name !== "data-controller") {
                                $loadedController.attr(attributes[x].name, attributes[x].value);
                            }
                        }

                        $elem.replaceWith($loadedController);
                    }

                    if ($loadedView) {
                        var attributes = $elem.prop("attributes");

                        for (var x = 0 ; x < attributes.length; x++) {
                            if (attributes[x].name !== "data-view" && attributes[x].name !== "data-controller") {
                                $loadedView.attr(attributes[x].name, attributes[x].value);
                            }
                        }

                        $elem.replaceWith($loadedView);
                    }
                });
            }
        };

        walkTheDom($(elem));

        synchronizer.start(callback);
    };

    WEB.MVC = {
        applyTo: asyncWalkTheDom
    };

    $(function () { WEB.MVC.applyTo($("html")[0]); });
});