/// <reference path="/scripts/BASE.js" />
/// <reference path="/scripts/jQuery/mouseManager.js" />

BASE.require(["jQuery.mouseManager"], function () {
    jQuery.fn.enableDragEvents = function () {
        return this.each(function () {
            var elem = this;
            var $elem = $(this);
            var mm = jQuery.mouseManager;
            var offsetX = null;
            var offsetY = null;

            var mousemove = function (e) {
                var event = new $.Event("drag");
                event.pageX = e.pageX;
                event.pageY = e.pageY;
                event.offsetX = offsetX;
                event.offsetY = offsetY;
                event.originalEvent = e;

                $elem.trigger(event);
            };

            $elem.bind("mousedown", function () {
                var isDragging = function (e) {
                    if (e.newValue && mm.node === elem) {
                        var region = $elem.region();
                        offsetX = mm.event.pageX - region.x;
                        offsetY = mm.event.pageY - region.y;

                        var event = new $.Event("dragstart");
                        event.pageX = mm.event.pageX;
                        event.pageY = mm.event.pageY;
                        event.offsetX = offsetX;
                        event.offsetY = offsetY;
                        event.originalEvent = mm.event;

                        $elem.trigger(event);
                        $(document).bind("mousemove", mousemove);
                    } else if (!e.newValue && mm.node === elem) {
                        $(document).unbind("mousemove", mousemove);

                        var event = new $.Event("dragstop");
                        event.pageX = mm.event.pageX;
                        event.pageY = mm.event.pageY;
                        event.offsetX = offsetX;
                        event.offsetY = offsetY;
                        event.originalEvent = mm.event;

                        $elem.trigger(event);

                        offsetX = null;
                        offsetY = null;
                        jQuery.mouseManager.unobserve("isDragging", isDragging);
                    }
                };
                jQuery.mouseManager.observe("isDragging", isDragging);
            });
        });
    };
});