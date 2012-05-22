BASE.require(["jQuery"], function () {
    window.SliderManager = function (elem) {
        var self = this;
        if (!(this instanceof window.SliderManager)) {
            return new SliderManager(elem);
        }

        var $elem = $(elem);
        var $slider1 = $("#slider1");
        var $slider2 = $("#slider2");
        var $slider3 = $("#slider3");

        var restrict1 = function (e) {
            if (e.target.controller.getPercent() < 0.1) {
                e.target.controller.setPercent(0.1);
            } else if (e.target.controller.getPercent() > 0.9) {
                e.target.controller.setPercent(0.9);
            }
            return false;
        };

        var restrict2 = function (e) {
            if (e.target.controller.getPercent() != 0.5) {
                e.target.controller.setPercent(0.5);
            }
            return false;
        };

        var num = 0;
        var interval;
        var speed = 100;
        var currentSpeed = speed;
        var rate = 1;
        var incr = function () {
            num += rate;
            $slider2.find("#number").html(num);
        };

        $slider1.bind("sliderChanged", restrict1);
        $slider1.bind("controlReady", restrict1);

        $slider2.bind("sliderChanged", restrict2);
        $slider2.bind("controlReady", restrict2);
        $slider2.bind("sliderChanged", function (e) {
            clearInterval(interval);
            interval = null;
        });

        //$slider3.bind("sliderChanged", restrict2);
        //$slider3.bind("controlReady", restrict2);
        $slider2.bind("sliderChanging", function (e) {
            if (!interval || speed != currentSpeed) {
                clearInterval(interval);
                currentSpeed = speed;
                interval = setInterval(function () {
                    incr();
                }, speed);
            }
            var p = e.percent;
            if (p < 0.5 && p > 0.4) {
                rate = -1;
                speed = 300;
            } else if (p < 0.5 && p > 0.3) {
                rate = -2;
                speed = 200;
            } else if (p < 0.5 && p > 0.2) {
                rate = -5;
                speed = 100;
            } else if (p < 0.5 && p > 0.1) {
                rate = -10;
                speed = 50;
            } else if (p > 0.5 && p < 0.6) {
                rate = 1;
                speed = 300;
            } else if (p > 0.5 && p < 0.7) {
                rate = 2;
                speed = 200;
            } else if (p > 0.5 && p < 0.8) {
                rate = 5;
                speed = 100;
            } else if (p > 0.5 && p < 0.9) {
                rate = 10;
                speed = 50;
            }
        });

        $slider3.bind("sliderChanging", function (e) {
            $slider3.find("#percent").html(e.percent);
        });

        return self;
    };
});