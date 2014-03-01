BASE.require([
"BASE.web.ui.Region",
"Element.prototype.getOffset"
], function () {
    var Region = BASE.web.ui.Region;

    Element.prototype.region = function() {
        var t, r, b, l, o;

        if (window === this) {
            var scrollTop = window.pageXOffset;
            var scrollLeft = window.pageYOffset;
            t = scrollTop;
            r = scrollLeft + window.innerWidth;
            b = scrollTop + window.innerHeight;
            l = scrollLeft;
        } else if (this !== undefined) {
            o = this.getOffset();
            t = o.top;
            r = o.left + this.offsetWidth;
            b = o.top + this.offsetHeight;
            l = o.left;
        } else {
            return null;
        }

        return new Region(t, r, b, l);
    };

});