BASE.require(["WEB.ui.View", "jQuery", "BASE.PropertyChangedEvent", "jQuery.fn.loadModule"], function () {

    BASE.namespace("WEB.ui");

    WEB.ui.GridView = (function (Super) {
        var GridView = function (elem) {
            if (!(this instanceof arguments.callee)) {
                return new GridView(elem);
            }
            var self = this;
            var $elem = $(elem);
            Super.call(self, elem);

            $elem.css({
                "clear": "both"
            });

            var _margin = $elem.data("margin") ? parseInt($elem.data("margin")) : 10;
            var _views = [];

            var prepareElementToAppend = function ($element) {
                _views.push($element.data("view"));
                $element.css({
                    opacity: 0,
                    position: "relative",
                    float: "left",
                    margin: _margin,
                    left: "100px"
                });
            };

            var animateElementIn = function ($element, callback) {
                $element.animate({
                    opacity: 1,
                    left: "0px"
                }, 1000, "easeOutExpo", callback);
            };

            self.add = function (view, callback) {
                var element = view.element;
                var $element = $(element);

                prepareElementToAppend($element);
                $element.appendTo($elem);
                animateElementIn(callback);
            };

            self.remove = function (view, callback) {
                callback = callback || function () { };
                var index = _views.indexOf(view);

                if (index >= 0) {
                    _views.splice(index, 1);
                    var $element = $(view.element);
                    $element.animate({
                        opacity: 0
                    }, 500, "easeOutExpo", function () {
                        $element.remove();

                        callback();
                    });
                } else {
                    callback();
                }
            };

            self.loadView = function (url, options) {
                options = options || {};
                var beforeAppend = options.beforeAppend || function () { };
                var afterAppend = options.afterAppend || function () { };

                $elem.loadModule(url, {
                    beforeAppend: function (loadedElement) {
                        var $loadedElement = $(loadedElement);
                        var view = $loadedElement.data("view");
                        if (!$loadedElement.data("view")) {
                            throw new Error("Expected a view on the loaded element: " + url);
                        }
                        beforeAppend(view);
                        prepareElementToAppend($(loadedElement));
                    },
                    afterAppend: function (loadedElement) {
                        var $loadedElement = $(loadedElement);
                        var view = $loadedElement.data("view");
                        animateElementIn($loadedElement, function () {
                            afterAppend(view);
                        });
                    }
                });
            };

            Object.defineProperties(self, {
                "margin": {
                    get: function () {
                        return _margin;
                    },
                    set: function (margin) {
                        _margin = margin;

                    }
                },
                "views": {
                    get: function () {
                        return _views;
                    }
                }
            });

            window.parent.grid = self;

            return self;
        };

        BASE.extend(GridView, Super);
        return GridView;
    })(WEB.ui.View);

});