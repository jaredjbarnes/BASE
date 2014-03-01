/// <reference path="/scripts/BASE.js" />
/// <reference path="/scripts/jQuery/mouseManager.js" />
/// <reference path="/scripts/jQuery/fn/region.js" />
/// <reference path="/scripts/WEB/Region.js" />

BASE.require(["jQuery.mouseManager", "BASE.web.ui.Region", "jQuery.fn.region"], function () {
    var defaultDm = $.mouseManager;

    var indexOf = Array.prototype.indexOf || function (val) {
        for (var x = 0; x < this.length; x++) {
            if (val === this[x]) {
                return x;
            }
        }
        return -1;
    };

    $.fn.draggable = function (options) {

        options = options || {};
        var dm = options.mouseManager || defaultDm;

        var listeners = {
            start: options.start,
            stop: options.stop,
            dropped: options.dropped
        };

        var proxyNodes = options.proxyNodes || [];
        var grid = options.grid || null;
        var gridContainerNode = options.gridContainerNode || null;
        var containmentRegion = options.containmentRegion || null;
        var containmentNode = options.containmentNode || null;

        return this.each(function () {
            var $elem = $(this);

            if (!$elem.data("draggableInitialized")) {
                $elem.data("draggableInitialized", true);

                for (var x in listeners) {
                    $elem.bind("drag" + x, listeners[x]);
                }

                var asTargetOnly = options.asTargetOnly === undefined ? true : options.asTargetOnly;
                asTargetOnly = asTargetOnly === true && proxyNodes.length > 0 ? false : asTargetOnly;

                var startXY = null;
                var elemXY = null;
                $elem.data("draggable", true);

                var onDrag = function (e) {
                    if ($elem.data("draggable")) {
                        var distance = {};
                        distance.x = e.newValue.x - startXY.x;
                        distance.y = e.newValue.y - startXY.y;
                        var newX = distance.x + elemXY.x;
                        var newY = distance.y + elemXY.y;

                        if (grid) {
                            newX = Math.round(newX / grid[0]) * grid[0];
                            newY = Math.round(newY / grid[1]) * grid[1];
                            if (gridContainerNode) {
                                var gcRegion = $(gridContainerNode).region();

                                var amountX = gcRegion.x % grid[0];
                                var amountY = gcRegion.y % grid[1];

                                var dividedX = gcRegion.x / grid[0];
                                var dividedY = gcRegion.y / grid[1];
                                var roundedY = Math.round(dividedY);
                                var roundedX = Math.round(dividedX);
                                var offsetX = roundedX >= dividedX ? -((gcRegion.x - amountX + grid[0]) - gcRegion.x) : amountX;
                                var offsetY = roundedY >= dividedY ? -((gcRegion.y - amountY + grid[1]) - gcRegion.y) : amountY;

                                newX = newX + offsetX;
                                newY = newY + offsetY;
                            }
                        }

                        if (containmentRegion || containmentNode) {
                            var cregion = containmentNode ? $(containmentNode).region() : containmentRegion;
                            var eregion = $elem.region();
                            var nregion = new BASE.web.ui.Region(newY, newX + eregion.width, newY + eregion.height, newX);

                            if (nregion.top < cregion.top) {
                                newY = newY + (cregion.top - nregion.top);
                            }

                            if (nregion.right > cregion.right) {
                                newX = newX + (cregion.right - nregion.right);
                            }

                            if (nregion.bottom > cregion.bottom) {
                                newY = newY + (cregion.bottom - nregion.bottom);
                            }

                            if (nregion.left < cregion.left) {
                                newX = newX + (cregion.left - nregion.left);
                            }

                        }

                        $elem.offset({
                            left: newX,
                            top: newY
                        });
                    }
                };

                var onStart = function (e) {
                    dm.unobserve("xy", onDrag);
                    if (dm.mode === "move") {
                        startXY = dm.xy;
                        elemXY = $elem.region();

                        var event = $.Event("dragstart");
                        event.mouseManager = dm;
                        event.pageX = dm.xy.x;
                        event.pageY = dm.xy.y;
                        $elem.trigger(event);


                        if (!event.isDefaultPrevented()) {
                            dm.observe("xy", onDrag);
                        }
                    }
                };

                var onEnd = function (e) {
                    dm.unobserve("xy", onDrag);
                    if (dm.mode === "move") {
                        var event = $.Event("dragstop");
                        event.mouseManager = dm;
                        event.pageX = dm.xy.x;
                        event.pageY = dm.xy.y;

                        $elem.trigger(event);

                        var devent = $.Event("dragdropped");
                        devent.mouseManager = dm;
                        devent.pageX = dm.xy.x;
                        devent.pageY = dm.xy.y;
                        devent.isDropHandled = dm.event.isDropHandled;

                        $elem.trigger(devent);
                    }
                };

                var isDragging = function (e) {
                    var isProxy = indexOf.apply(proxyNodes, [dm.node]) >= 0 ? true : false;

                    if (e.newValue === true) {
                        if (($elem[0] === dm.node && asTargetOnly) || (!asTargetOnly && isProxy)) {
                            onStart.apply(this, [e]);
                        }
                    } else {
                        if (($elem[0] === dm.node && asTargetOnly) || (!asTargetOnly && isProxy)) {
                            onEnd.apply(this, [e]);
                        }
                    }
                };

                $elem.bind("mousedown", function () {
                    if (dm.isDragging) {
                        isDragging.apply(null, [{ newValue: true}]);
                    }

                    dm.observe("isDragging", isDragging);
                    $elem.data({ isDragging: isDragging });
                });


            }
        });

    };
});