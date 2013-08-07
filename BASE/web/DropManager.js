BASE.require([
    "jQuery",
    "jQuery.fn.region",
    "BASE.util.Observable",
    "BASE.util.ObservableEvent",
    "BASE.collections.Hashmap"
], function () {
    BASE.namespace("BASE.web");

    BASE.web.DropManager = (function (_Super) {

        var DropManager = function (dragManager) {
            if (!(this instanceof arguments.callee)) {
                return new BASE.web.DropManager(dragManager);
            }

            var self = this;
            _Super.call(self);

            var _elements = new BASE.collections.Hashmap();
            var _regions = new BASE.collections.Hashmap();
            var _Notifiables = new BASE.collections.Hashmap();

            dragManager.observe(function () { }, "dragStart");
            dragManager.observe(function () { }, "drag");
            dragManager.observe(function () { }, "dragEnd");

            self.registerDropAreaWithRegion = function (region, notifiableObject) {

            };

            self.registerDropAreaWithElement = function (elem, notifiableObject) {

            };

            self.unregisterDropAreaWithRegion = function (region) {

            };

            self.unregisterDropAreaWithElement = function (elem) {

            };

            return self;
        };

        BASE.extend(DropManager, _Super);

        return DropManager;
    })(BASE.util.Observable);
});