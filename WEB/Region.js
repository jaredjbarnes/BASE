BASE.require(["BASE.Observable", "BASE.ObservableEvent", "BASE.PropertyChangedEvent"], function () {
    BASE.namespace("WEB");

    WEB.Region = (function (_Super) {
        var Region = function (t, r, b, l) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Region(t, r, b, l);
            }

            _Super.call(self);

            self.contains = function (region) {
                return (region.left >= self.left &&
               region.right <= self.right &&
               region.top >= self.top &&
               region.bottom <= self.bottom);
            };
            self.getArea = function () {
                return ((self.bottom - self.top) * (self.right - self.left));
            };
            self.intersect = function (region) {
                var t = Math.max(self.top, region.top),
                r = Math.min(self.right, region.right),
                b = Math.min(self.bottom, region.bottom),
                l = Math.max(self.left, region.left);

                if (b >= t && r >= l) {
                    return new Region(t, r, b, l);
                } else {
                    return null;
                }
            };
            self.setTop = function (val) {
                if (typeof val === "number" && self.bottom >= val) {
                    var oldValue = self.top;
                    self.setRegion(val, self.right, self.bottom, self.left);
                    self.notify(new BASE.PropertyChangedEvent("top", oldValue, val));
                    self.notify(new BASE.PropertyChangedEvent("y", oldValue, val));
                }
            };
            self.setRight = function (val) {
                if (typeof val === "number" && val >= self.left) {
                    self.setRegion(self.top, val, self.bottom, self.left);
                    self.notify(new BASE.PropertyChangedEvent("right", oldValue, val));
                }
            };
            self.setBottom = function (val) {
                if (typeof val === "number" && val >= self.top) {
                    self.setRegion(self.top, self.right, val, self.left);
                    self.notify(new BASE.PropertyChangedEvent("bottom", oldValue, val));
                }
            };
            self.setLeft = function (val) {
                if (typeof val === "number" && self.right >= val) {
                    self.setRegion(self.top, self.right, self.bottom, val);
                    self.notify(new BASE.PropertyChangedEvent("left", oldValue, val));
                    self.notify(new BASE.PropertyChangedEvent("x", oldValue, val));
                }
            };
            self.setX = self.setLeft;
            self.setY = self.setTop;
            self.setWidth = function (val) {
                if (typeof val === "number" && val >= 0) {
                    self.setRegion(self.top, self.left + val, self.bottom, self.left);
                    self.notify(new BASE.PropertyChangedEvent("width", oldValue, val));
                }
            };
            self.setHeight = function (val) {
                if (typeof val === "number" && val >= 0) {
                    self.setRegion(self.top, self.right, self.top + val, self.left);
                    self.notify(new BASE.PropertyChangedEvent("height", oldValue, val));
                }
            };
            self.setRegionTo = function (region) {
                var oldTopValue = self.top;
                var oldLeftValue = self.left;
                var oldRightValue = self.right;
                var oldBottomValue = self.bottom;
                var oldWidthValue = self.width;
                var oldHeightValue = self.height;

                self.setRegion(region.top, region.right, region.bottom, region.left);
                if (region.top !== oldTopValue) self.notify(new BASE.PropertyChangedEvent("top", oldTopValue, region.top));
                if (region.left !== oldLeftValue) self.notify(new BASE.PropertyChangedEvent("left", oldLeftValue, region.left));
                if (region.x !== oldLeftValue) self.notify(new BASE.PropertyChangedEvent("x", oldLeftValue, region.left));
                if (region.top !== oldTopValue) self.notify(new BASE.PropertyChangedEvent("y", oldTopValue, region.top));
                if (region.right !== oldRightValue) self.notify(new BASE.PropertyChangedEvent("right", oldRightValue, region.right));
                if (region.bottom !== oldBottomValue) self.notify(new BASE.PropertyChangedEvent("bottom", oldBottomValue, region.bottom));
                if (region.height !== oldHeightValue) self.notify(new BASE.PropertyChangedEvent("height", oldHeightValue, region.height));
                if (region.width !== oldWidthValue) self.notify(new BASE.PropertyChangedEvent("width", oldWidthValue, region.width));
            };
            self.setRegion = function (top, right, bottom, left) {
                if (bottom >= top && right >= left) {
                    this.top = top;
                    this.y = top;
                    this[1] = top;
                    this.right = right;
                    this.bottom = bottom;
                    this.left = left;
                    this.x = left;
                    this[0] = left;
                    this.width = this.right - this.left;
                    this.height = this.bottom - this.top;
                } else {
                    throw new Error("Invalid Region Instantiation: top=" + top + ", right=" + right + ", bottom=" + bottom + ", left=" + left + ".");
                }
                self.notify(new BASE.ObservableEvent("change"));
            };
            self.moveToPoint = function (x, y) {
                self.setRegion(y, x + self.width, y + self.height, x);
            };
            self.union = function (region) {
                var t = Math.min(self.top, region.top),
                r = Math.max(self.right, region.right),
                b = Math.max(self.bottom, region.bottom),
                l = Math.min(self.left, region.left);

                return new Region(t, r, b, l);
            };
            self.equals = function (region) {
                return (region.top === self.top && region.right === self.right && region.bottom === self.bottom && region.left === self.left) ? true : false;
            };
            self.toString = function () {
                return ("Region {" +
               "top: " + self.top +
               ", right: " + self.right +
               ", bottom: " + self.bottom +
               ", left: " + self.left +
               ", height: " + self.height +
               ", width: " + self.width +
               "}");
            };
            self.copy = function () {
                return new WEB.Region(self.top, self.right, self.bottom, self.left);
            };

            self.setRegion(t, r, b, l);

            return self
        }

        BASE.extend(Region, _Super);

        return Region
    })(BASE.Observable);

});