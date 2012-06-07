BASE.require(["jQuery"], function () {
    BASE.namespace("WEB.ui");

    WEB.ui.SlideShow = function (elem) {
        if (!(this instanceof WEB.ui.SlideShow)) {
            return new WEB.ui.SlideShow(elem);
        }
        var self = this;
        var $elem = $(elem);

        var interval;
        var duration = 5000;
        var transitionDuration = 300;
        var index = 0;
        var isAnimating = false;

        var animate = function ($hide, $show, callback) {
            if (!isAnimating) {
                $hide.stop();
                $show.stop();

                isAnimating = true;

                callback = callback || function () { };
                var count = 0;
                var runCallback = function () {
                    if (count === 2) {
                        callback();
                    }
                    isAnimating = false;
                };
                $hide.animate({ opacity: 0 }, transitionDuration, "linear", function () {
                    $hide.css("display", "none");
                    count++;
                    runCallback();
                });

                $show.css("display", "block");
                $show.animate({ opacity: 1 }, transitionDuration, "linear", function () {
                    count++;
                    runCallback();
                });
            }
        };

        var getNext = function () {
            var newIndex = index + 1;

            if (newIndex > $elem.children().length - 1) {
                newIndex = 0;
            }
            return $elem.children().slice(newIndex, newIndex + 1);
        };

        var getCurrent = function () {
            return $elem.children().slice(index, index + 1);
        };

        var getPrev = function () {
            var newIndex = index - 1;

            if (newIndex < 0) {
                newIndex = $elem.children().length - 1;
            }
            return $elem.children().slice(newIndex, newIndex + 1);
        };

        var intervalHandle = function () {
            var $hide = getCurrent();
            var $show = getNext();
            index = index + 1;
            index = index > $elem.children().length - 1 ? 0 : index;
            animate($hide, $show);
        };

        $elem.children().each(function (i) {
            var $this = $(this);
            if (i >= $elem.children().length - 1) {
                index = i;
            } else {
                $this.css("display", "none");
            }
        });

        self.stop = function () {
            clearInterval(interval);
        };
        self.start = function () {
            clearTimeout(interval);
            interval = setInterval(intervalHandle, duration + transitionDuration);
        };
        self.next = function () {
            if (!isAnimating) {
                self.stop();
                var $show = getNext();
                var $hide = getCurrent();
                index = index + 1;
                index = index > $elem.children().length - 1 ? 0 : index;
                animate($hide, $show, function () {
                    self.start();
                });
            }
        };
        self.prev = function () {
            if (!isAnimating) {
                self.stop();
                var $show = getPrev();
                var $hide = getCurrent();
                index = index - 1;
                index = index < 0 ? $elem.children().length - 1 : index;
                animate($hide, $show, function () {
                    self.start();
                });
            }
        };
        self.setDuration = function (d) {
            duration = d;
        };
        self.setTransitionDuration = function (d) {
            transitionDuration = d;
        };

        self.start();
    };
});