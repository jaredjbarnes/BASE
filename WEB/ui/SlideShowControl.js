BASE.require(["jQuery"], function () {
    BASE.namespace("WEB.ui");

    WEB.ui.SlideShowControl = function (elem) {
        if (!(this instanceof WEB.ui.SlideShowControl)) {
            return new WEB.ui.SlideShowControl(elem);
        }

        var self = this;
        var $elem = $(elem);
        var $stop = $elem.find("#stop");
        var $start = $elem.find("#start");
        var $next = $elem.find("#next");
        var $prev = $elem.find("#previous");
        var $slideShow = $elem.find("[data-script='WEB.ui.SlideShow']");
        var slideShow = $slideShow.length > 0 ? $slideShow[0].controller : null;

        if (!slideShow) {
            $slideShow.one("controlReady", function () {
                slideShow = $slideShow.length > 0 ? $slideShow[0].controller : null;
            });
        }

        $stop.bind("click", function (e) {
            if (slideShow) slideShow.stop();
        });

        $start.bind("click", function (e) {
            if (slideShow) slideShow.start();
        });

        $next.bind("click", function (e) {
            if (slideShow) slideShow.next();
        });

        $prev.bind("click", function (e) {
            if (slideShow) slideShow.prev();
        });
    };
});