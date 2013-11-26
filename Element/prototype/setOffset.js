BASE.require([
    "Element.prototype.position",
    "Element.prototype.getOffset",
    "Element.prototype.css"
], function () {
    Object.defineProperty(Element.prototype, "setOffset", {
        enumerable: false,
        configurable: true,
        value: function (options) {
            var self = this;
            var position = self.css("position");

            // set position first, in-case top/left are set even on static elem
            if (position === "static") {
                self.style.position = "relative";
            }

            var curOffset = self.getOffset(),
                curCSSTop = self.css("top"),
                curCSSLeft = self.css("left"),
                calculatePosition = (position === "absolute" || position === "fixed") && [curCSSTop, curCSSLeft].indexOf("auto") > -1,
                props = {}, curPosition = {}, curTop, curLeft;

            // need to be able to calculate position if either top or left is auto and position is either absolute or fixed
            if (calculatePosition) {
                curPosition = curElem.position();
                curTop = curPosition.top;
                curLeft = curPosition.left;
            } else {
                curTop = parseFloat(curCSSTop) || 0;
                curLeft = parseFloat(curCSSLeft) || 0;
            }

            if (options.top != null) {
                props.top = (options.top - curOffset.top) + curTop;
            }
            if (options.left != null) {
                props.left = (options.left - curOffset.left) + curLeft;
            }

            Object.keys(props).forEach(function (name) {
                self.style[name] = props[name] + "px";
            });
        }
    });
});


