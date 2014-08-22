BASE.require([
    "jQuery"
], function () {

    BASE.namespace("BASE.web.smoothScrollingHelper");

    $(document).on("touchstart", function (e) {
        var $scrollElement = $(e.target).closest(".smooth-scrolling");
        var scrollElement = $scrollElement[0];
        var scrollTop = $scrollElement.scrollTop();

        if ($scrollElement.length > 0) {
            if (scrollTop === 0) {
                scrollElement.scrollTop = 1;
            }
            if (scrollTop + scrollElement.offsetHeight >= scrollElement.scrollHeight) {
                scrollElement.scrollTop = scrollElement.scrollHeight - scrollElement.offsetHeight - 1;
            }
        }
    });

    $(document).on("touchmove", function (e) {

        if ($(e.target).closest(".smooth-scrolling").length === 0) {
            e.preventDefault();
        }

    });

});