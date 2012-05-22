BASE.require(["jQuery", "jQuery.fn.enableDragEvents", "jQuery.fn.region"], function () {
    BASE.namespace("WEB.ui");

    WEB.ui.HorizontalSlider = function (elem) {
        var self = this;
        if (!(this instanceof WEB.ui.HorizontalSlider)) {
            return new WEB.ui.HorizontalSlider(elem);
        }

        var $elem = $(elem);
        var $handle = $elem.find("#handle");
        var $container = $elem.find("#handleContainer");

        //If there weren't any containers found use the elem as the boundary.
        if ($container.length === 0) {
            $container = $elem;
        }

        //Bounds used to make sure the handle doesn't leave.
        var bounds = $container.region();
        var currentPercent = 0;

        //Enabling drag events.
        $handle.enableDragEvents();
        $handle.bind("drag", function (e) {
            var currentRegion = $handle.region();
            var containerRegion = $container.region();
            var top = e.pageY - e.offsetY;
            var left = e.pageX - e.offsetX;
            var newPos = new WEB.Region(top, left + currentRegion.width, top + currentRegion.height, left);

            if (newPos.top < containerRegion.top) {
                top = containerRegion.top;
            }
            if (newPos.bottom > containerRegion.bottom) {
                top = containerRegion.bottom - newPos.height;
            }
            if (newPos.left < containerRegion.left) {
                left = containerRegion.left;
            }
            if (newPos.right > containerRegion.right) {
                left = containerRegion.right - newPos.width;
            }

            $handle.offset({ left: left, top: top });

            var range = containerRegion.width - newPos.width;
            var placement = (containerRegion.right - newPos.width - left);
            var percent = 1 - (placement / range);
            percent = percent >= 0 ? percent : 0;
            percent = percent <= 1 ? percent : 1;
            var event = new $.Event("sliderChanging");
            currentPercent = event.percent = parseFloat(percent.toFixed(4), 10);

            $elem.trigger(event);
        });

        $handle.bind("dragstop", function (e) {
            var event = new $.Event("sliderChanged");
            event.percent = parseFloat(currentPercent.toFixed(4), 10);

            $elem.trigger(event);
        });
    };
});