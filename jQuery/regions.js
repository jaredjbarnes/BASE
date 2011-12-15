/// <reference path="/scripts/BASE.js" />
/// <reference path="/scripts/jQuery/mouseManager.js" />
/// <reference path="/scripts/WEB/Region.js" />

BASE.require(["jQuery.mouseManager"], function () {
    var droppableRegions = {};

    jQuery.regions = {
        addDroppable: function (region, options) {
            if (region instanceof WEB.Region) {
                options = options || {};
                options.condition = options.condition || function () { return true; };
                droppableRegions[region] = {
                    options: options,
                    region: region
                };
            }
        },
        removeDroppable: function (region) {
            if (droppableRegions[region]) {
                delete droppableRegions[region];
            }
        },
        getDroppable: function () {
            return BASE.clone(droppableRegions, true);
        }
    };

    $.mouseManager.observe("isDragging", function (e) {
        if (e.newValue) {
            for (var x in droppableRegions) {
                if (droppableRegions[x].options.condition.apply(droppableRegions[x].region, [$.mouseManager.node])) {
                    $.mouseManager.addRegion(droppableRegions[x].region, droppableRegions[x].options);
                }
            }
        }

    });

});