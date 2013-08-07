BASE.require([
    "jQuery",
    "jQuery.fn.region",
    "BASE.util.Observable",
    "BASE.util.ObservableEvent"
], function () {
    BASE.namespace("BASE.web");

    BASE.web.MouseEvent = (function (_Super) {
        var MouseEvent = function (type, target, jQueryEvent) {
            if (!(this instanceof arguments.callee)) {
                return new MouseEvent(type, target, jQueryEvent);
            }

            var self = this;
            _Super.call(self, type);

            self.x = jQueryEvent.pageX;
            self.y = jQueryEvent.pageY;
            self.target = target;
            self.jQueryEvent = jQueryEvent;
            self.startX = null;
            self.startY = null;

            return self;
        };

        BASE.extend(MouseEvent, _Super);
        return MouseEvent;
    })(BASE.util.ObservableEvent);


    BASE.web.MouseDragManager = (function (_Super) {

        var MouseDragManager = function () {
            if (!(this instanceof arguments.callee)) {
                return new BASE.web.MouseDragManager();
            }

            var self = this;
            _Super.call(self);

            var target = null;
            var startX = null;
            var startY = null;
            var lastX = null;
            var lastY = null;

            var update = function (type, e) {
                var event = new BASE.web.MouseEvent(type, target, e);
                event.startX = startX;
                event.startY = startY;
                event.deltaX = e.pageX - lastX;
                event.deltaY = e.pageY - lastY;
                self.notify(event);
                jQueryEvent = null;
            };

            var mousedown = function (e) {
                if (!target) {
                    target = e.target;
                    startX = e.pageX;
                    startY = e.pageY;
                    lastX = startX;
                    lastY = startY;
                    update("dragStart", e);
                    $(document).bind("mousemove", mousemove);
                }
            };

            var mousemove = function (e) {
                update("drag", e);
                lastX = e.pageX;
                lastY = e.pageY;
            };

            var mouseup = function (e) {
                if (target) {
                    update("dragEnd", e);
                    startX = null;
                    startY = null;
                    lastX = null;
                    lastY = null;
                    target = null;
                    $(document).unbind("mousemove", mousemove);
                }
            };

            $(document).bind("mousedown", mousedown);
            $(document).bind("mouseup", mouseup);

            return self;
        };

        BASE.extend(MouseDragManager, _Super);

        return MouseDragManager;
    })(BASE.util.Observable);
});