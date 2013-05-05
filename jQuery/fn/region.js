/// <reference path="/scripts/BASE.js" />
/// <reference path="/scripts/jQuery.js" />
/// <reference path="/scripts/WEB/Region.js" />

BASE.require(['jQuery', 'BASE.web.ui.Region'], function () {

    var Region = BASE.web.ui.Region;

    //jquery plugins
    jQuery.fn.region = function () {
        var t, r, b, l, o;
        if (this.length > 0) {
            if (window === this[0]) {
                var scrollTop = $(window).scrollTop();
                var scrollLeft = $(window).scrollLeft();
                t = scrollTop;
                r = scrollLeft + $(window).width();
                b = scrollTop + $(window).height();
                l = scrollLeft;
            } else if (this[0] !== undefined) {
                o = $(this[0]).offset();
                t = o.top;
                r = o.left + this[0].offsetWidth;
                b = o.top + this[0].offsetHeight;
                l = o.left;
            } else {
                return null
            }

            return new Region(t, r, b, l);
        } else {
            return null;
        }
    };

});