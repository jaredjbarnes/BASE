(function () {

    var Region = BASE.Region = function (t, r, b, l) {
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
    };

    BASE.Region.prototype = {
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
        }
    };

})();