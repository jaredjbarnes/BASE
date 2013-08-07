BASE.require(["BASE.util.Observable", "BASE.util.PropertyChangedEvent"], function () {
    BASE.namespace("BASE.web.ui.behavior");

    BASE.web.ui.behavior.HorizontalFlexBehavior = (function (Super) {
        var HorizontalFlexBehavior = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new HorizontalFlexBehavior();
            }

            Super.call(self);

            var _view = null;
            var $elem = null;
            var $container = null;
            var _autoWidthViews = [];
            var afterSubviewAdded = function (event) {
                var view = event.subview;
                self.update();
            };

            var childResize = function () {
                self.update();
            };

            var _layout = function () {
                var region = $container.region();
                var totalKnownWidth = 0;

                $(_view.element).find("[data-id='clearHorizontal']");

                _view.subviews.forEach(function (childView) {
                    childView.removeOnBoundsChange(childResize);
                    childView.onBoundsChange(childResize);

                    if (!childView.data("flexWeight")) {
                        var width = childView.width;
                        totalKnownWidth += width;
                    } else {
                        if (_autoWidthViews.indexOf(childView) < 0) {
                            _autoWidthViews.push(childView);
                        }
                    }

                    childView.style({
                        position: "relative",
                        top: "0px",
                        left: "0px",
                        display: "inline-block",
                        height: "100%",
                        border: "0px",
                        margin: "0px",
                        padding: "0px",
                        float: "left"
                    });
                });

                var remainingWidth = region.width - totalKnownWidth;
                remainingWidth = remainingWidth > 0 ? remainingWidth : 0;

                var newWidth = Math.floor(remainingWidth / _autoWidthViews.length);
                var leftOverPixels = remainingWidth % _autoWidthViews.length;

                _autoWidthViews.forEach(function (childView, index) {
                    if (index < _autoWidthViews.length - 1) {
                        childView.style("width", newWidth + "px").css("clear", "");
                    } else {
                        childView.style("width", (newWidth + leftOverPixels) + "px");
                        $(childView.element).css("clear", "right");
                    }
                });

            };

            self.start = function (view) {
                _view = view;
                $elem = $(view.element);
                $container = $(view.containerElement);

                view.observe(afterSubviewAdded, "afterSubviewAdded");

                var checkIfPartOfDom = function () {
                    if ($elem.parents("body").length > 0) {
                        _layout();
                    } else {
                        setTimeout(checkIfPartOfDom, 100);
                    }
                };

                view.onBoundsChange(_layout);
                checkIfPartOfDom();
            };

            self.end = function () {
                _view.unobserve(afterSubviewAdded, "afterSubviewAdded");
                view.subviews.forEach(function (childView) {
                    childView.removeOnBoundsChange(childResize);
                });
            };

            self.update = function () {
                _layout();
            };

            return self;
        };

        BASE.extend(HorizontalFlexBehavior, Super);

        return HorizontalFlexBehavior;
    }(BASE.util.Observable));
});

