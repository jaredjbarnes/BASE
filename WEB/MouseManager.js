/// <reference path="/js/scripts/BASE.js" />
/// <reference path="/js/scripts/WEB/Region.js" />
/// <reference path="/js/scripts/jQuery/fn/region.js" />

BASE.require(["jQuery.fn.region", "WEB.Region", "BASE.enableEventEmitting", "Array.prototype.forEach"], function () {
    BASE.namespace("WEB");
    WEB.MouseManager = function () {
        if (!(this instanceof WEB.MouseManager)) {
            return new WEB.MouseManager();
        }

        var dm = this;
        dm.xy = null;
        dm.isDragging = false;
        dm.node = null;
        dm.event = null;
        dm.mode = "default";

        var modeTypeRegions = {};

        var node;

        var mousedown = function (e) {
            var xy = {
                x: e.pageX,
                y: e.pageY
            };

            dm.event = e;
            dropNodes = [];
            dropRegions = [];
            dm.node = node = e.target;

            if (dm.setXy) {
                dm.setXy(xy);
            } else {
                dm.xy = xy;
            }

            if (typeof dm.setIsDragging === "function") {
                dm.setIsDragging(true);
            } else {
                dm.isDragging = true;
            }

            dm.event = null;
            $(document).bind("mousemove", mousemove);
        };

        var mousemove = function (e) {
            var xy = {
                x: e.pageX,
                y: e.pageY
            };

            dm.event = e;

            if (dm.setXy) {
                dm.setXy(xy);
            } else {
                dm.xy = xy;
            }

            var region;
            var cregion;
            var nregion;
            var nintersection;
            var cintersection;
            var $node = $(dm.node);
            var $droppable;
            var x = xy.x;
            var y = xy.y;
            var z; // For loops
            var pinArray;
            var pinNodeRegion;
            var dropRegion;
            var dropRegions = modeTypeRegions[dm.mode] || [];
            var mouseEnter;
            var mouseLeave;
            var nodeEnter;
            var nodeLeave;

            for (z = 0; z < dropRegions.length; z++) {
                //Droppable Region
                region = dropRegions[z];
                //Mouse Region
                cregion = new WEB.Region(y, x + 1, y + 1, x);
                //Dragged Node Region
                nregion = $node.region();

                dropRegion = dropRegions[z];
                //Adjust region to pinned area if its pinned.
                if (dropRegion.pinToNode && dropRegion.pinTo) {
                    pinArray = dropRegion.pinTo;
                    pinNodeRegion = dropRegion.pinToNode.region();

                    if (isNaN(pinArray[0]) || isNaN(pinArray[0])) {
                        for (var p = 0; p < pinArray.length; p++) {
                            switch (pinArray[p]) {
                                case "top":
                                    dropRegion.setTopByRegion(pinNodeRegion);
                                    break;
                                case "right":
                                    dropRegion.setRightByRegion(pinNodeRegion);
                                    break;
                                case "bottom":
                                    dropRegion.setBottomByRegion(pinNodeRegion);
                                    break;
                                case "left":
                                    dropRegion.setLeftByRegion(pinNodeRegion);
                                    break;
                            }
                        }
                    } else {
                        dropRegion.setXYOriginByRegion(pinArray[0], pinArray[1], pinNodeRegion);
                    }
                }

                nintersection = region.intersect(nregion);
                cintersection = region.intersect(cregion);

                if (nintersection && !dropRegion.nodeHasEntered) {
                    dropRegion.nodeHasEntered = true;
                    nodeEnter = new dropRegion.Event("nodeenter");
                    nodeEnter.intersection = nintersection;
                    nodeEnter.draggedNode = $node[0];
                    nodeEnter.jQueryEvent = e;
                    nodeEnter.emit();
                } else if (!nintersection) {
                    if (dropRegion.nodeHasEntered) {
                        nodeLeave = new dropRegion.Event("nodeleave");
                        nodeLeave.draggedNode = $node[0];
                        nodeLeave.jQueryEvent = e;
                        nodeLeave.emit();
                    }
                    dropRegion.nodeHasEntered = false;
                }

                if (cintersection && !dropRegions[z].mouseHasEntered) {
                    dropRegion.mouseHasEntered = true;
                    mouseEnter = new dropRegion.Event("mouseenter");
                    mouseEnter.intersection = cintersection;
                    mouseEnter.draggedNode = $node[0];
                    mouseEnter.jQueryEvent = e;
                    mouseEnter.emit();
                } else if (!cintersection) {
                    if (dropRegion.mouseHasEntered) {
                        mouseLeave = new dropRegion.Event("mouseleave");
                        mouseLeave.draggedNode = $node[0];
                        mouseLeave.jQueryEvent = e;
                        mouseLeave.emit();
                    }
                    dropRegion.mouseHasEntered = false;
                }
            }

            dm.event = null;
        };

        var mouseup = function (e) {
            dm.event = e;
            e.isDropHandled = false;
            var z;
            var pinArray;
            var pinNodeRegion;
            var dropRegion;
            var mouseDrop;
            var nodeDrop;
            var dropRegions = modeTypeRegions[dm.mode] || [];

            for (z = 0; z < dropRegions.length; z++) {
                dropRegion = dropRegions[z];

                //Adjust region to pinned area if its pinned.
                if (dropRegion.pinToNode && dropRegion.pinTo && dropRegion.pinTo.length == 2) {
                    pinArray = dropRegion.pinTo;
                    pinNodeRegion = dropRegion.pinToNode.region();

                    if (isNaN(pinArray[0])) {
                        for (var p = 0; p < pinArray.length; p++) {
                            switch (pinArray[p]) {
                                case "top":
                                    dropRegion.setTopByRegion(pinNodeRegion);
                                    break;
                                case "right":
                                    dropRegion.setRightByRegion(pinNodeRegion);
                                    break;
                                case "bottom":
                                    dropRegion.setBottomByRegion(pinNodeRegion);
                                    break;
                                case "left":
                                    dropRegion.setLeftByRegion(pinNodeRegion);
                                    break;
                            }
                        }
                    } else {
                        dropRegion.setXYOriginByRegion(pinArray[0], pinArray[1], pinNodeRegion);
                    }
                }
                //TODO: make this mousedrop and nodedrop
                if (dropRegion.mouseHasEntered) {
                    mouseDrop = new dropRegion.Event("mousedrop");
                    mouseDrop.jQueryEvent = e;
                    mouseDrop.emit();

                    if (mouseDrop.isDropHandled) {
                        e.isDropHandled = true;
                    }
                }

                if (dropRegion.nodeHasEntered) {
                    nodeDrop = new dropRegion.Event("nodedrop");
                    nodeDrop.jQueryEvent = e;
                    nodeDrop.emit();
                    if (nodeDrop.isDropHandled) {
                        e.isDropHandled = true;
                    }
                }
            }

            if (typeof dm.setIsDragging === "function") {
                dm.setIsDragging(false);
            } else {
                dm.isDragging = false;
            }

            dm.node = node = null;
            dm.event = null;
            $(document).unbind("mousemove", mousemove);
            modeTypeRegions = {};
        };

        $(document).bind("mousedown", mousedown);
        $(document).bind("mouseup", mouseup);

        var listenerNames = ["mouseenter", "mouseleave", "nodeenter", "nodeleave", "nodeenter", "nodeleave", "drop"];

        dm.addRegionByNode = function (DOMNode, options) {
            if (DOMNode) {
                options = options || {};
                options.pin = {
                    node: DOMNode,
                    to: ["top", "left"]
                };

                var region = $(DOMNode).region();
                BASE.enableEventEmitting(region);
                var dropRegions = modeTypeRegions[options.mode || "default"];

                if (!dropRegions) {
                    dropRegions = modeTypeRegions[options.mode || "default"] = [];
                }
                region.pinToNode = options.pin.node ? $(options.pin.node) : undefined;
                region.pinTo = options.pin.to || undefined;
                region.mouseHasEntered = false;
                region.nodeHasEntered = false;

                listenerNames.forEach(function (value) {
                    if (options[value]) {
                        region.on(value, options[value]);
                    }
                });

                dropRegions.push(region);
            }
        };

        dm.Region = WEB.Region;
        dm.addRegion = function (region, options) {
            options = options || {};
            options.pin = options.pin || {};

            if (region instanceof WEB.Region) {
                BASE.enableEventEmitting(region);
                var dropRegions = modeTypeRegions[options.mode || "default"];

                if (!dropRegions) {
                    dropRegions = modeTypeRegions[options.mode || "default"] = [];
                }
                region.pinToNode = options.pin.node ? $(options.pin.node) : undefined;
                region.pinTo = options.pin.to || undefined;
                region.mouseHasEntered = false;
                region.nodeHasEntered = false;

                listenerNames.forEach(function (value) {
                    if (options[value]) {
                        region.on(value, options[value]);
                    }
                });

                dropRegions.push(region);
            }
        };

    };

});