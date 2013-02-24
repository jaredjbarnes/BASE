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


            var controllerNamespace = $elem.data("controller");
            var viewNamespace = controllerNamespace && !$elem.data("view") ? "WEB.ui.View" : $elem.data("view");
            var controllerUrl = $elem.data("load-controller");
            var viewUrl = $elem.data("load-view");

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
                                    var attributes = $elem.prop("attributes");

                                    for (var x = 0 ; x < attributes.length; x++) {
                                        if (attributes[x].name !== "data-view" &&
                                         attributes[x].name !== "data-controller" &&
                                         attributes[x].name !== "data-load-view" &&
                                         attributes[x].name !== "data-load-controller") {
                                            $loadedController.attr(attributes[x].name, attributes[x].value);
                                        }
                                    }

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
                                    var attributes = $elem.prop("attributes");

                                    for (var x = 0 ; x < attributes.length; x++) {
                                        if (attributes[x].name !== "data-view" &&
                                         attributes[x].name !== "data-controller" &&
                                         attributes[x].name !== "data-load-view" &&
                                         attributes[x].name !== "data-load-controller") {
                                            $loadedView.attr(attributes[x].name, attributes[x].value);
                                        }
                                    }

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

                        // data-set support
                        var attributes = $elem.prop("attributes");
                        var attributeName;
                        var attributeValue;
                        for (var x = 0 ; x < attributes.length; x++) {
                            attributeName = attributes[x].name;
                            attributeValue = attributes[x].value;
                            var index = attributeName.indexOf("data-set-");
                            if (index >= 0) {
                                var property = attributeName.replace("data-set-", "");
                                if (typeof view[property] !== "function") {
                                    view[property] = attributeValue;
                                }
                            }
                        }

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