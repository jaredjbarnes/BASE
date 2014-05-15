BASE.require(['jQuery'], function () {

    //jquery plugins
    jQuery.fn.redraw = function () {
        return this.each(function () {
            this.offsetHeight;
        });
    };
});