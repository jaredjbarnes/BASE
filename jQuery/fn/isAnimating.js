BASE.require(['jQuery'], function () {

    //jquery plugins
    jQuery.fn.isAnimating = function () {
        return this.is('[animating]') || this.is(':animated');
    };
});