BASE.require(["BASE.Observable", "BASE.PropertyChangedEvent"], function () {
    BASE.namespace("BASE.web.ui.behavior");

    BASE.web.ui.behavior.VerticalFlexBehavior = (function (Super) {
        var VerticalFlexBehavior = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new VerticalFlexBehavior();
            }

            Super.call(self);

            var _view = null;
            var $elem = null;
            var $container = null;
            var _autoHeightViews = [];

            var afterSubviewAdded = function (event) {
                var view = event.subview;
                self.update();
            };

            var childResize = function () {
                self.update();
            };

            var _layout = function () {
                var region = $container.region();
                var totalKnownHeight = 0;
                var autoHeightViews = [];
                _view.subviews.forEach(function (childView) {
                    childView.removeOnBoundsChange(childResize);
                    childView.onBoundsChange(childResize);

                    if (!childView.data("flexWeight")) {
                        var height = childView.height;
                        totalKnownHeight += height;
                    } else {
                        if (_autoHeightViews.indexOf(childView) < 0) {
                            _autoHeightViews.push(childView);
                        }
                    }

                    childView.style({
                        position: "relative",
                        top: "0px",
                        left: "0px",
                        display: "block",
                        width: "100%",
                        border: "0px",
                        margin: "0px",
                        padding: "0px"
                    });
                });

                var remainingHeight = region.height - totalKnownHeight;
                remainingHeight = remainingHeight > 0 ? remainingHeight : 0;

                var newHeight = Math.floor(remainingHeight / _autoHeightViews.length);
                var leftOverPixels = remainingHeight % _autoHeightViews.length;

                _autoHeightViews.forEach(function (childView, index) {
                    if (index < autoHeightViews.length - 1) {
                        childView.style("height", newHeight + "px");
                    } else {
                        childView.style("height", (newHeight + leftOverPixels) + "px");
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

        BASE.extend(VerticalFlexBehavior, Super);

        return VerticalFlexBehavior;
    }(BASE.Observable));
});

