BASE.require(["BASE.ObservableEvent"], function () {
    BASE.namespace("BASE");

    BASE.PropagatingEvent = (function (Super) {
        var PropagatingEvent = function (type) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new PropagatingEvent();
            }

            Super.call(self, type);

            var _type = type;
            Object.defineProperty(self, "type", {
                get: function () {
                    return _type;
                }
            });

            var _stopPropagation = false;
            Object.defineProperty(self, "stopPropagation", {
                configurable: false,
                enumerable: true,
                value: function () {
                    _stopPropagation = true;
                }
            });

            Object.defineProperty(self, "isPropagationStopped", {
                get: function () {
                    return _stopPropagation;
                }
            });

            return self;
        };

        BASE.extend(PropagatingEvent, Super);

        return PropagatingEvent;
    }(BASE.ObservableEvent));
});
