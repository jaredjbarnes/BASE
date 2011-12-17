(function () {
    BASE.namespace("WEB");
    var Region = WEB.Region = function (t, r, b, l) {
        this.setRegion(t, r, b, l);
    };

    WEB.Region.prototype = {
        contains: function (region) {
            return (region.left >= this.left &&
               region.right <= this.right &&
               region.top >= this.top &&
               region.bottom <= this.bottom);
        },
        getArea: function () {
            return ((this.bottom - this.top) * (this.right - this.left));
        },
        intersect: function (region) {
            var t = Math.max(this.top, region.top),
          r = Math.min(this.right, region.right),
          b = Math.min(this.bottom, region.bottom),
          l = Math.max(this.left, region.left);

            if (b >= t && r >= l) {
                return new Region(t, r, b, l);
            } else {
                return null;
            }
        },
        setTop: function (val) {
            if (typeof val === "number" && this.bottom >= val) {
                this.setRegion(val, this.right, this.bottom, this.left);
            }
        },
        setBottom: function (val) {
            if (typeof val === "number" && val >= this.top) {
                this.setRegion(this.top, this.right, val, this.left);
            }
        },
        setRight: function (val) {
            if (typeof val === "number" && val >= this.left) {
                this.setRegion(this.top, val, this.bottom, this.left);
            }
        },
        setLeft: function (val) {
            if (typeof val === "number" && this.right >= val) {
                this.setRegion(this.top, this.right, this.bottom, val);
            }
        },
        setTopByRegion: function (refRegion) {
            var difference = (refRegion.top - this.top);
            this.setRegion(this.top + (difference), this.right, this.bottom + (difference), this.left);
        },
        setRightByRegion: function (refRegion) {
            var difference = (refRegion.right - this.right);
            this.setRegion(this.top, this.right + (difference), this.bottom, this.left + (difference));
        },
        setBottomByRegion: function (refRegion) {
            var difference = (refRegion.bottom - this.bottom);
            this.setRegion(this.top + (difference), this.right, this.bottom + (difference), this.left);
        },
        setLeftByRegion: function (refRegion) {
            var difference = (refRegion.left - this.left);
            this.setRegion(this.top, this.right + (difference), this.bottom, this.left + (difference));
        },
        setXYOriginByRegion: function (x, y, refRegion) {
            var offsetY = y + refRegion.y;
            var offsetX = x + refRegion.x;

            var newRegion = new WEB.Region(offsetY, (offsetX) + this.width, offsetY + this.height, offsetX);
            this.setRegionByRegion(newRegion);
        },
        setRegionByRegion: function (newRegion) {
            this.setRegion(newRegion.top, newRegion.right, newRegion.bottom, newRegion.left);
        },
        setRegion: function (t, r, b, l) {
            if (b >= t && r >= l) {
                this.top = t;
                this.y = t;
                this[1] = t;
                this.right = r;
                this.bottom = b;
                this.left = l;
                this.x = l;
                this[0] = l;
                this.width = this.right - this.left;
                this.height = this.bottom - this.top;
            } else {
                throw new Error("Invalid Region Instantiation: top=" + t + ", right=" + r + ", bottom=" + b + ", left=" + l + ".");
            }
        },
        moveToPoint: function (x, y) {
            this.setRegion(y, x + this.width, y + this.height, y);
        },
        union: function (region) {
            var t = Math.min(this.top, region.top),
          r = Math.max(this.right, region.right),
          b = Math.max(this.bottom, region.bottom),
          l = Math.min(this.left, region.left);

            return new Region(t, r, b, l);
        },
        equals: function (region) {
            return (region.top === this.top && region.right === this.right && region.bottom === this.bottom && region.left === this.left) ? true : false;
        },
        toString: function () {
            return ("Region {" +
               "top: " + this.top +
               ", right: " + this.right +
               ", bottom: " + this.bottom +
               ", left: " + this.left +
               ", height: " + this.height +
               ", width: " + this.width +
               "}");
        },
        copy: function () {
            return new WEB.Region(this.top, this.right, this.bottom, this.left);
        }
    };

})();