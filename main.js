/// <reference path="/js/scripts/BASE.js" />
/// <reference path="/js/scripts/jQuery/fn/draggable.js" />
/// <reference path="/js/scripts/jQuery/fn/droppable.js" />
/// <reference path="/js/scripts/jQuery/regions.js" />
/// <reference path="/js/scripts/Array/prototype/every.js" />

BASE.require.root = "/scripts";
BASE.require(["jQuery.fn.draggable", "jQuery.fn.droppable", "jQuery.regions"], function () {
    
    $("#project").draggable().data("project", {});
    $("#task").draggable().data("task", {}).draggable();

    $("#project").bind("dragstart", function () {
        console.log("dragstart");
    });

    $("#project").bind("dragstop", function () {
        console.log("dragstop");
    });

    $.regions.addDroppable(new WEB.Region(400, 600, 600, 400), {
        drop: function () {
            console.log("Dropped in Invisible");
            $.regions.removeDroppable(new WEB.Region(400, 600, 600, 400));
        },
        nodeenter: function () {
            console.log("node entered");
        },
        nodeleave: function () {
            console.log("lonely");
        }
    });

    $("#trash").droppable({
        condition: function (draggedNode) {
            var $node = $(draggedNode);

            if ($node.data("project") || $node.data("task")) {
                return true;
            } else {
                return false;
            }
        }, drop: function (e) {
            console.log("Dropped");


        }, mouseenter: function (e) {
            console.log("Mouse Entered");
            var $node = $(e.draggedNode);
            var $trash = $("#trash");
            if ($node.data("project")) {
                $trash.css("background-color", "#ff9c00");
            } else {
                $trash.css("background-color", "#54ff00");
            }
        }, mouseleave: function (e) {
            console.log("Mouse Leave");
            var $node = $(e.draggedNode);
            var $trash = $("#trash");

            $trash.css("background-color", "#ff0000");

        }, nodeenter: function () {
            console.log("Node Entered");
        }, nodeleave: function () {
            console.log("Node Leave");
        }
    });

});

