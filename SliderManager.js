BASE.require(["jQuery"], function () {
    window.SliderManager = function (elem) {
        var self = this;
        if (!(this instanceof window.SliderManager)) {
            return new SliderManager(elem);
        }

        var $elem = $(elem);
        var $slider1 = $("#slider1");

        $slider1.bind("sliderChanged", function (e) {
            if (e.percent < 0.1) {
                e.target.controller.setPercent(0.1);
            } else if (e.percent > 0.9) {
                e.target.controller.setPercent(0.9);
            }
        });

        $slider1.bind("controlReady", function (e) {
            if (e.target.controller.getPercent() < 0.1) {
                e.target.controller.setPercent(0.1);
            } else if (e.target.controller.getPercent() > 0.9) {
                e.target.controller.setPercent(0.9);
            }
            return false;
        });

        return self;
    };
});