BASE.require(["jQuery"], function () {

    BASE.namespace("WEB");

    var asyncWalkTheDom = function (elem, callback) {
        var $elem = $(elem);

        // This ensures that a view is attached to a controller.
        $elem.find("[data-controller]").add($elem).each(function () {
            var $this = $(this);
            if (!$this.data("view")) {
                $this.data("view", "WEB.ui.View");
            }
        });

        callback = callback || function () { };
        setTimeout(function () {

            var $children = $elem.children();

            var length = $children.length;
            var lamda = function () {
                length--;
                if (length <= 0) {
                    var viewNamespace = $elem.data("view");
                    if (typeof viewNamespace === "string") {
                        BASE.require([viewNamespace], function () {
                            var View = BASE.getObject(viewNamespace);
                            var view = new View(elem);
                            $(elem).data("view", view);
                            var controllerNamespace = $elem.data("controller");
                            if (typeof controllerNamespace === "string") {
                                BASE.require([controllerNamespace], function () {
                                    var Controller = BASE.getObject(controllerNamespace);
                                    var controller = new Controller(view);
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