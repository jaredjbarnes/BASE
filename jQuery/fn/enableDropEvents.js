/// <reference path="/scripts/BASE.js" />
/// <reference path="/scripts/jQuery/mouseManager.js" />

BASE.require(["jQuery.mouseManager", "BASE.enableEventEmitting", "Object.keys", "Array.prototype.forEach"], function () {

    var defaultDm = $.mouseManager;
    $.fn.enableDropEvents = function (options) {
        ///<summary>
        ///Makes a DomElement droppable.
        ///</summary>
        ///<param name="options" type="Object">
        ///1. (Optional) condition - Callback function to ask if conditions are met. function(DOMElement){/*...*/ return true;}. Default always returns true.
        ///2. (Optional) mouseenter - Callback invoked when the mouse enters the region of the droppable.
        ///3. (Optional) mouseleave - Callback invoked when the mouse leaves the region of the droppable.
        ///4. (Optional) mouseenter - Callback invoked when the node enters the region of the droppable.
        ///5. (Optional) nodeleave - Callback invoked when the node leaves the region of the droppable.
        ///6. (Optional) drop - Callback invoked when the dragged node is dropped in the region. 
        ///There is a special property to the drop event named "isDropHandled". If this is set to true, it notifies the dragged element that the drop has been handled through the dragdropped event.
        ///</param>
        ///</returns>

        options = options || {};
        var condition = options.condition || function () { return true; };
        var dm = options.mouseManager || defaultDm;

        var listeners = {
            mouseenter: options.mouseenter,
            mouseleave: options.mouseleave,
            nodeenter: options.nodeenter,
            nodeleave: options.nodeleave,
            nodedrop: options.nodedrop,
            mousedrop: options.mousedrop
        };

        return this.each(function () {
            var $this = $(this);
            if (!$this.data("dropEventsInitialized")) {
                $this.data("dropEventsInitialized", true);

                var region = $this.region();
                BASE.enableEventEmitting(region);

                Object.keys(listeners).forEach(function (value) {
                    $this.bind("drop" + value, listeners[value]);
                });

                var mouseenter = function (ev) {
                    var event = new $.Event("dropmouseenter");
                    event.draggedNode = dm.node;
                    event.mouseManager = dm;
                    event.mouseEvent = ev;

                    $this.trigger(event);
                };
                var mouseleave = function (ev) {
                    var event = new $.Event("dropmouseleave");
                    event.draggedNode = dm.node;
                    event.mouseManager = dm;
                    event.mouseEvent = ev;

                    $this.trigger(event);
                };

                var nodeenter = function (ev) {
                    var event = new $.Event("dropnodeenter");
                    event.draggedNode = dm.node;
                    event.mouseManager = dm;
                    event.mouseEvent = ev;

                    $this.trigger(event);
                };

                var nodeleave = function (ev) {
                    var event = new $.Event("dropnodeleave");
                    event.draggedNode = dm.node;
                    event.mouseManager = dm;
                    event.mouseEvent = ev;

                    $this.trigger(event);
                }

                var mousedrop = function (ev) {
                    var event = new $.Event("dropbymouse");
                    event.draggedNode = dm.node;
                    event.mouseManager = dm;
                    event.mouseEvent = ev;
                    event.isDropHandled = false;
                    $this.trigger(event);

                    if (event.isDropHandled) {
                        return true;
                    }
                };

                var nodedrop = function (ev) {
                    var event = new $.Event("dropbynode");
                    event.draggedNode = dm.node;
                    event.mouseManager = dm;
                    event.mouseEvent = ev;
                    event.isDropHandled = false;
                    $this.trigger(event);

                    if (event.isDropHandled) {
                        return true;
                    }
                };

                region.on("mouseenter", mouseenter);
                region.on("mouseleave", mouseleave);
                region.on("nodeenter", nodeenter);
                region.on("nodeleave", nodeleave);
                region.on("mousedrop", mousedrop);
                region.on("nodedrop", nodedrop);

                dm.observe("isDragging", function (e) {
                    if (e.newValue) {
                        if (condition.apply($this[0], [dm.node])) {
                            dm.addRegion(region, { pin: { node: $this[0], to: ["top", "left"]}, mode: options.mode||"move" });
                        }
                    }
                });
            }
        });
    };
});