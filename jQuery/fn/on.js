BASE.require(["jQuery"], function () {
    if (typeof jQuery.fn.on === "undefined") {
        jQuery.fn.on = jQuery.fn.bind;
        jQuery.fn.off = jQuery.fn.unbind;
    }
});