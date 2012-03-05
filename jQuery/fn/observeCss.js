/// <reference path="/scripts/BASE.js" />
/// <reference path="/scripts/jQuery.js" />
/// <reference path="/scripts/WEB/Region.js" />

BASE.require(['jQuery'], function () {

    var oldCss = jQuery.fn.css;
    var newCss = function () {
        var args = arguments;
        var aCopy = Array.prototype.slice.apply(args, []);
        var ret = oldCss.apply(this, args);

        if (aCopy.length === 1 && typeof aCopy[0] === "string") {
            return ret;
        }

        this.each(function () {
            var $this = $(this);
            var event;
            if (aCopy.length === 1) {
                for (var x in aCopy[0]) {
                    if (aCopy[0].hasOwnProperty(x)) {
                        event = $.Event(aCopy[0][x]);
                        event.newValue = oldCss.apply($this, [aCopy[0][x]]);
                        $this.trigger(event);
                    }
                }
            } else {
                event = $.Event(aCopy[0]);
                event.newValue = oldCss.apply($this, [aCopy[0]]);
                $this.trigger(event);
            }
        });

        return ret;
    };
    jQuery.fn.css = newCss;
    jQuery.fn.observeCss = jQuery.fn.bind;

});