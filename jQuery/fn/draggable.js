/// <reference path="/scripts/BASE.js" />
/// <reference path="/scripts/jQuery/mouseManager.js" />

BASE.require(["jQuery.mouseManager"], function () {
    var defaultDm = $.mouseManager;

    $.fn.draggable = function (options) {

        options = options || {};
        var dm = options.mouseManager || defaultDm;

        var listeners = {
            start: options.start,
            stop: options.stop
        };

        return this.each(function () {
            var $elem = $(this);

            if (!$elem.data("draggableInitialized")) {
                $elem.data("draggableInitialized", true);

                for (var x in listeners) {
                    $elem.bind("drag" + x, listeners[x]);
                }

                var asTargetOnly = options.asTargetOnly === undefined ? true : options.asTargetOnly;
                var startXY = null;
                var elemXY = null;
                $elem.data("draggable", true);

                var onDrag = function (e) {
                    if ($elem.data("draggable")) {
                        var distance = {};
                        distance.x = e.newValue.x - startXY.x;
                        distance.y = e.newValue.y - startXY.y;

                        $elem.offset({
                            left: distance.x + elemXY.x,
                            top: distance.y + elemXY.y
                        });
                    }
                };

                var onStart = function (e) {
                    startXY = dm.xy;
                    elemXY = $elem.region();

                    dm.unobserve("xy", onDrag);
                    dm.observe("xy", onDrag);
                    $elem.data("draggable", true);

                    var event = $.Event("dragstart");
                    event.mouseManager = dm;
                    $elem.trigger(event);

                };

                var onEnd = function () {
                    dm.unobserve("xy", onDrag);
                    var event = $.Event("dragstop");
                    event.mouseManager = dm;
                    $elem.trigger(event);
                };

                var isDragging = function (e) {
                    if (e.newValue) {
                        if (($elem[0] === dm.node && asTargetOnly) || !asTargetOnly) {
                            onStart.apply(this, [e]);
                        }
                    } else {
                        if (($elem[0] === dm.node && asTargetOnly) || !asTargetOnly) {
                            onEnd.apply(this, [e]);
                        }
                    }
                };

                if (dm.isDragging) {
                    isDragging.apply(null, [{ newValue: true}]);
                }

                dm.observe("isDragging", isDragging);
                $elem.data({ isDragging: isDragging });

            }
        });

    };
});