BASE.require([
    "BASE.util.Observable"
], function () {
    BASE.namespace("BASE.web.ui");

    BASE.web.ui.Region = (function (_Super) {
        var Region = function(t, r, b, l) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Region(t, r, b, l);
            }

            _Super.call(self);

            self.contains = function(region) {
                return (region.left >= self.left &&
                    region.right <= self.right &&
                    region.top >= self.top &&
                    region.bottom <= self.bottom);
            };
            self.getArea = function() {
                return ((self.bottom - self.top) * (self.right - self.left));
            };
            self.intersect = function(region) {
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
            self.setTop = function(val) {
                if (typeof val === "number" && self.bottom >= val) {
                    var oldValue = self.top;
                    self.setRegion(val, self.right, self.bottom, self.left);
                    self.notify({ type: "top", oldValue: oldValue, newValue: val });
                    self.notify({ type: "y", oldValue: oldValue, newValue: val });
                }
            };
            self.setRight = function(val) {
                if (typeof val === "number" && val >= self.left) {
                    self.setRegion(self.top, val, self.bottom, self.left);
                    self.notify({type:"right", oldValue: oldValue, newValue: newValue});
                }
            };
            self.setBottom = function(val) {
                if (typeof val === "number" && val >= self.top) {
                    self.setRegion(self.top, self.right, val, self.left);
                    self.notify({type:"right", oldValue: oldValue, newValue: val});
                }
            };
            self.setLeft = function(val) {
                if (typeof val === "number" && self.right >= val) {
                    self.setRegion(self.top, self.right, self.bottom, val);
                    self.notify({ type: "left", oldValue: oldValue, newValue: val });
                    self.notify({ type: "x", oldValue: oldValue, newValue: val });
                }
            };
            self.setX = self.setLeft;
            self.setY = self.setTop;
            self.setWidth = function(val) {
                if (typeof val === "number" && val >= 0) {
                    self.setRegion(self.top, self.left + val, self.bottom, self.left);
                    self.notify({ type: "width", oldValue: oldValue, newValue: val });
                }
            };
            self.setHeight = function(val) {
                if (typeof val === "number" && val >= 0) {
                    self.setRegion(self.top, self.right, self.top + val, self.left);
                    self.notify({ type: "height", oldValue: oldValue, newValue: val });
                }
            };
            self.setRegionTo = function(region) {
                var oldTopValue = self.top;
                var oldLeftValue = self.left;
                var oldRightValue = self.right;
                var oldBottomValue = self.bottom;
                var oldWidthValue = self.width;
                var oldHeightValue = self.height;

                self.setRegion(region.top, region.right, region.bottom, region.left);
                if (region.top !== oldTopValue) self.notify(self.notify({type:"top", oldValue: oldTopValue, newValue: region.top}));
                if (region.left !== oldLeftValue) self.notify(self.notify({ type: "left", oldValue: oldLeftValue, newValue: region.left }));
                if (region.x !== oldLeftValue) self.notify(self.notify({ type: "x", oldValue: oldLeftValue, newValue: region.left}));
                if (region.top !== oldTopValue) self.notify(self.notify({ type: "y", oldValue: oldTopValue, newValue: region.top }));
                if (region.right !== oldRightValue) self.notify(self.notify({ type: "right", oldValue: oldRightValue, newValue: region.right }));
                if (region.bottom !== oldBottomValue) self.notify(self.notify({ type: "bottom", oldValue: oldBottomValue, newValue: region.bottom }));
                if (region.height !== oldHeightValue) self.notify(self.notify({ type: "height", oldValue: oldHeightValue, newValue: region.height }));
                if (region.width !== oldWidthValue) self.notify(self.notify({ type: "width", oldValue: oldWidthValue, newValue: region.width }));
            };
            self.setRegion = function(top, right, bottom, left) {
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
                self.notify({type:"change"});
            };
            self.moveToPoint = function(x, y) {
                self.setRegion(y, x + self.width, y + self.height, x);
            };
            self.union = function(region) {
                var t = Math.min(self.top, region.top),
                    r = Math.max(self.right, region.right),
                    b = Math.max(self.bottom, region.bottom),
                    l = Math.min(self.left, region.left);

                return new Region(t, r, b, l);
            };
            self.equals = function(region) {
                return (region.top === self.top && region.right === self.right && region.bottom === self.bottom && region.left === self.left) ? true : false;
            };
            self.toString = function() {
                return ("Region {" +
                    "top: " + self.top +
                    ", right: " + self.right +
                    ", bottom: " + self.bottom +
                    ", left: " + self.left +
                    ", height: " + self.height +
                    ", width: " + self.width +
                    "}");
            };
            self.copy = function() {
                return new BASE.web.ui.Region(self.top, self.right, self.bottom, self.left);
            };

            self.setRegion(t, r, b, l);

            return self;
        };

        BASE.extend(Region, _Super);

        return Region
    })(BASE.util.Observable);

});