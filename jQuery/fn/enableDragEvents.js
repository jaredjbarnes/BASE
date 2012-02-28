/// <reference path="/scripts/BASE.js" />
/// <reference path="/scripts/jQuery/mouseManager.js" />

BASE.require(["jQuery", "jQuery.mouseManager"], function () {
    jQuery.fn.enableDragEvents = function () {
        return this.each(function () {
            var elem = this;
            var $elem = $(this);

            if (!$elem.data("dragEventsInitialized")) {
                $elem.data("dragEventsInitialized", true)

                var mm = jQuery.mouseManager;
                var offsetX = null;
                var offsetY = null;
                var startX = null;
                var startY = null;
                var mouseIsDown = null;

                var mousemove = function (e) {
                    var event = new $.Event("drag");
                    event.pageX = e.pageX;
                    event.pageY = e.pageY;
                    event.offsetX = offsetX;
                    event.offsetY = offsetY;
                    event.startX = startX;
                    event.startY = startY;

                    event.originalEvent = e;
                    if (e.which > 0) {
                        $elem.trigger(event);
                    } else {
                        $(document).unbind("mousemove", mousemove);

                        var event = new $.Event("dragstop");
                        event.pageX = mm.event.pageX;
                        event.pageY = mm.event.pageY;
                        event.offsetX = offsetX;
                        event.offsetY = offsetY;
                        event.startX = startX;
                        event.startY = startY;
                        event.originalEvent = mm.event;

                        $elem.trigger(event);

                        offsetX = null;
                        offsetY = null;
                        jQuery.mouseManager.unobserve("isDragging", isDragging);
                    }

                };

                $elem.bind("mousedown", function () {
                    var isDragging = function (e) {
                        if (e.newValue && mm.node === elem) {
                            var region = $elem.region();
                            offsetX = mm.event.pageX - region.x;
                            offsetY = mm.event.pageY - region.y;
                            startX = mm.event.pageX;
                            startY = mm.event.pageY;

                            var event = new $.Event("dragstart");
                            event.pageX = mm.event.pageX;
                            event.pageY = mm.event.pageY;
                            event.offsetX = offsetX;
                            event.offsetY = offsetY;
                            event.startX = startX;
                            event.startY = startY;
                            event.originalEvent = mm.event;

                            $elem.trigger(event);
                            $(document).bind("mousemove", mousemove);
                            jQuery.mouseManager.event.preventDefault();
                        } else if (!e.newValue && mm.node === elem) {
                            $(document).unbind("mousemove", mousemove);

                            var event = new $.Event("dragstop");
                            event.pageX = mm.event.pageX;
                            event.pageY = mm.event.pageY;
                            event.offsetX = offsetX;
                            event.offsetY = offsetY;
                            event.startX = startX;
                            event.startY = startY;
                            event.originalEvent = mm.event;

                            $elem.trigger(event);

                            offsetX = null;
                            offsetY = null;
                            jQuery.mouseManager.unobserve("isDragging", isDragging);
                        }
                    };
                    jQuery.mouseManager.observe("isDragging", isDragging);
                });
            }
        });
    };
});