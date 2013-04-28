BASE.require([
    "BASE.Observable",
    "BASE.PropertyChangedEvent",
    "BASE.web.MouseDragManager"
], function () {
    BASE.namespace("BASE.web.ui.behavior");

    var mouseManager = new BASE.web.MouseDragManager();

    BASE.web.ui.behavior.DragBehavior = (function (Super) {
        var DragBehavior = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new DragBehavior();
            }

            Super.call(self);


            self.start = function (view) {
                var $elem = $(view.element);
                $(view.element).bind("mousedown", function () {
                    var drag = function (e) {
                        var position = $elem.offset();
                        position.top += e.deltaY;
                        position.left += e.deltaX;
                        $elem.offset(position);
                    };
                    var dragEnd = function (e) {
                        var position = $elem.offset();
                        position.top += e.deltaY;
                        position.left += e.deltaX;
                        $elem.offset(position);

                        mouseManager.unobserve(drag, "drag");
                        mouseManager.unobserve(dragEnd, "dragEnd");
                    };
                    mouseManager.observe(drag, "drag");
                    mouseManager.observe(dragEnd, "dragEnd");
                });
            };

            self.end = function () {
                // Nothing for now.
            };

            return self;
        };

        BASE.extend(DragBehavior, Super);

        return DragBehavior;
    }(BASE.Observable));
});