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

            var _margin = typeof $elem.data("margin") !== "undefined" ? parseInt($elem.data("margin")) : 10;
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

            self.addSubview = function (view, callback) {
                var element = view.element;
                var $element = $(element);

                prepareElementToAppend($element);
                $element.appendTo($elem);
                animateElementIn($element, callback);
            };

            self.removeSubview = function (view, callback) {
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


            return self;
        };

        BASE.extend(GridView, Super);
        return GridView;
    })(WEB.ui.View);

});