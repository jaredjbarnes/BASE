/// <reference path="/scripts/BASE.js" />
/// <reference path="/scripts/jQuery/mouseManager.js" />

BASE.require(["jQuery.mouseManager"], function () {

    var defaultDm = $.mouseManager;
    $.fn.droppable = function (options) {
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
        var dropRegion = options.dropRegion || "mouse"; // "mouse" || "node"
        var condition = options.condition || function () { return true; };
        var dm = options.mouseManager || defaultDm;

        var listeners = {
            mouseenter: options.mouseenter,
            mouseleave: options.mouseleave,
            nodeenter: options.nodeenter,
            nodeleave: options.nodeleave,
            "": options.drop
        };

        return this.each(function () {
            var $this = $(this);

            if (!$this.data("droppableInitialized")) {
                $this.data("droppableInitialized", true);

                for (var x in listeners) {
                    $this.bind("drop" + x, listeners[x]);
                }

                dm.observe("isDragging", function (e) {
                    if (e.newValue) {
                        if (condition.apply($this[0], [dm.node])) {
                            dm.addRegionByNode($this[0], {
                                mouseenter: function (ev) {
                                    var event = new $.Event("dropmouseenter");
                                    event.draggedNode = dm.node;
                                    event.mouseManager = dm;
                                    event.mouseEvent = ev;

                                    $this.trigger(event);
                                },
                                mouseleave: function (ev) {
                                    var event = new $.Event("dropmouseleave");
                                    event.draggedNode = dm.node;
                                    event.mouseManager = dm;
                                    event.mouseEvent = ev;

                                    $this.trigger(event);
                                },
                                nodeenter: function (ev) {
                                    var event = new $.Event("dropnodeenter");
                                    event.draggedNode = dm.node;
                                    event.mouseManager = dm;
                                    event.mouseEvent = ev;

                                    $this.trigger(event);
                                },
                                nodeleave: function (ev) {
                                    var event = new $.Event("dropnodeleave");
                                    event.draggedNode = dm.node;
                                    event.mouseManager = dm;
                                    event.mouseEvent = ev;

                                    $this.trigger(event);
                                },
                                drop: function (ev) {
                                    var event = new $.Event("drop");
                                    event.draggedNode = dm.node;
                                    event.mouseManager = dm;
                                    event.mouseEvent = ev;
                                    event.isDropHandled = false;
                                    $this.trigger(event);

                                    if (event.isDropHandled) {
                                        return true;
                                    }
                                }
                            });
                        }
                    }
                });
            }
        });
    };
});