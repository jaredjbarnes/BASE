BASE.require(["jQuery"], function () {

    BASE.namespace("WEB");

    var asyncWalkTheDom = function (elem, callback) {
        callback = callback || function () { };
        setTimeout(function () {
            var $elem = $(elem);
            var $children = $elem.children();

            var length = $children.length;
            var lamda = function () {
                length--;
                if (length <= 0) {
                    var viewNamespace = $elem.attr("data-view");
                    if (viewNamespace) {
                        BASE.require([viewNamespace], function () {
                            var View = BASE.getObject(viewNamespace);
                            var view = new View(elem);
                            //elem.view = view;
                            $(elem).data("view", view);
                            var controllerNamespace = $elem.attr("data-controller");
                            if (controllerNamespace) {
                                BASE.require([controllerNamespace], function () {
                                    var Controller = BASE.getObject(controllerNamespace);
                                    var controller = new Controller(view);
                                    //elem.controller = controller;
                                    $(elem).data("controller", controller);
                                    callback();
                                });
                            } else {
                                callback();
                            }
                        });
                    } else {
                        callback();
                    }
                }
            };
            if (length > 0) {
                $children.each(function () {
                    asyncWalkTheDom(this, lamda);
                });
            } else {
                lamda();
            }
        }, 0);
    };


    WEB.MVC = {
        applyTo: asyncWalkTheDom
    };

    $(function () { WEB.MVC.applyTo($("html")[0]); });
});