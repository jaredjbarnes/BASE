/// <reference path="/scripts/BASE.js" />
/// <reference path="/scripts/BASE/Region.js" />
/// <reference path="/scripts/jQuery/fn/region.js" />

BASE.require(["jQuery.fn.region", "BASE.Region"], function () {

    BASE.MouseManager = function () {
        if (!(this instanceof BASE.MouseManager)) {
            return new BASE.MouseManager();
        }

        var dm = this;
        dm.xy = null;
        dm.isDragging = false;
        dm.node = null;
        dm.event = null;

        var dropNodes = [];
        var dropRegions = [];
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

            for (z = 0; z < dropNodes.length; z++) {
                $droppable = $(dropNodes[z].node);
                //Droppable Region
                region = $droppable.region();
                //Mouse Region
                cregion = new BASE.Region(y, x + 1, y + 1, x);
                //Dragged Node Region
                nregion = $node.region();

                nintersection = region.intersect(nregion);
                cintersection = region.intersect(cregion);

                if (nintersection && !dropNodes[z].nodeHasEntered) {
                    dropNodes[z].nodeHasEntered = true;
                    e.intersection = nintersection;
                    e.draggedNode = $node[0];
                    dropNodes[z].nodeenter.apply($droppable, [e]);
                } else if (!nintersection) {
                    if (dropNodes[z].nodeHasEntered) {
                        e.draggedNode = $node[0];
                        dropNodes[z].nodeleave.apply($droppable, [e]);
                    }
                    dropNodes[z].nodeHasEntered = false;
                }

                if (cintersection && !dropNodes[z].mouseHasEntered) {
                    dropNodes[z].mouseHasEntered = true;
                    e.intersection = cintersection;
                    e.draggedNode = $node[0];
                    dropNodes[z].mouseenter.apply($droppable, [e]);
                } else if (!cintersection) {
                    if (dropNodes[z].mouseHasEntered) {
                        e.draggedNode = $node[0];
                        dropNodes[z].mouseleave.apply($droppable, [e]);
                    }
                    dropNodes[z].mouseHasEntered = false;
                }
            }

            for (z = 0; z < dropRegions.length; z++) {
                //Droppable Region
                region = dropRegions[z].region;
                //Mouse Region
                cregion = new BASE.Region(y, x + 1, y + 1, x);
                //Dragged Node Region
                nregion = $node.region();

                nintersection = region.intersect(nregion);
                cintersection = region.intersect(cregion);
                
                if (nintersection && !dropRegions[z].nodeHasEntered) {
                    dropRegions[z].nodeHasEntered = true;
                    e.intersection = nintersection;
                    e.draggedNode = $node[0];
                    dropRegions[z].nodeenter.apply(region, [e]);
                } else if (!nintersection) {
                    if (dropRegions[z].nodeHasEntered) {
                        e.draggedNode = $node[0];
                        dropRegions[z].nodeleave.apply(region, [e]);
                    }
                    dropRegions[z].nodeHasEntered = false;
                }

                if (cintersection && !dropRegions[z].mouseHasEntered) {
                    dropRegions[z].mouseHasEntered = true;
                    e.intersection = cintersection;
                    e.draggedNode = $node[0];
                    dropRegions[z].mouseenter.apply(region, [e]);
                } else if (!cintersection) {
                    if (dropRegions[z].mouseHasEntered) {
                        e.draggedNode = $node[0];
                        dropRegions[z].mouseleave.apply(region, [e]);
                    }
                    dropRegions[z].mouseHasEntered = false;
                }
            }

            dm.event = null;
        };

        var mouseup = function (e) {
            dm.event = e;
            if (typeof dm.setIsDragging === "function") {
                dm.setIsDragging(false);
            } else {
                dm.isDragging = false;
            }
            var z;

            for (z = 0; z < dropNodes.length; z++) {
                if (dropNodes[z].mouseHasEntered && dropNodes[z].dropType === "mouse") {
                    dropNodes[z].drop.apply(dropNodes[z].node, [e]);
                } else if (dropNodes[z].nodeHasEntered && dropNodes[z].dropType === "node") {
                    dropNodes[z].drop.call(dropNodes[z].node);
                }
            }

            for (z = 0; z < dropRegions.length; z++) {
                if (dropRegions[z].mouseHasEntered && dropRegions[z].dropType === "mouse") {
                    dropRegions[z].drop.apply(dropRegions[z].region, [e]);
                } else if (dropRegions[z].nodeHasEntered && dropRegions[z].dropType === "node") {
                    dropRegions[z].drop.apply(dropRegions[z].region, [e]);
                }
            }

            dm.node = node = null;
            dm.event = null;

            $(document).unbind("mousemove", mousemove);
        };

        $(document).bind("mousedown", mousedown);
        $(document).bind("mouseup", mouseup);

        dm.addRegionByNode = function (DOMNode, options) {
            if (DOMNode) {
                options = options || {};
                dropNodes.push({
                    node: DOMNode,
                    dropType: options.dropType || "mouse",
                    mouseenter: options.mouseenter || function () { },
                    mouseleave: options.mouseleave || function () { },
                    nodeenter: options.nodeenter || function () { },
                    nodeleave: options.nodeleave || function () { },
                    drop: options.drop || function () { },
                    mouseHasEntered: false,
                    nodeHasEntered: false
                });
            }
        };

        dm.Region = BASE.Region;
        dm.addRegion = function (region, options) {
            options = options || {};
            if (region instanceof BASE.Region) {
                dropRegions.push({
                    region: region,
                    dropType: options.dropType || "mouse",
                    mouseenter: options.mouseenter || function () { },
                    mouseleave: options.mouseleave || function () { },
                    nodeenter: options.nodeenter || function () { },
                    nodeleave: options.nodeleave || function () { },
                    drop: options.drop || function () { },
                    mouseHasEntered: false,
                    nodeHasEntered: false
                });
            }
        };

    };

});