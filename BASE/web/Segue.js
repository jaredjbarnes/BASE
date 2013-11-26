BASE.require([
    "BASE.util.Observable",
    "Element.prototype.region",
    "BASE.async.Future",
    "BASE.util.ObservableEvent"
], function () {

    BASE.namespace("BASE.web");

    var Future = BASE.async.Future;
    var ObservableEvent = BASE.util.ObservableEvent;

    BASE.web.Segue = (function (Super) {
        var Segue = function (fromElement, toElement) {
            var self = this;

            if (!(self instanceof Segue)) {
                throw new Error("The BASE.web.Segue constructor was run in the scope of the window.");
            }

            Super.call(self);

            self.enter = function (container, beforeElement) {
                return Future.fromResult(undefined).then(function () {
                    self.notify(new ObservableEvent("entered"));
                });
            };

            self.exit = function () {
                return Future.fromResult(undefined).then(function () {
                    self.notify(new ObservableEvent("exited"));
                });
            };
        };

        BASE.extend(Segue, Super);

        return Segue;

    }(BASE.util.Observable));


});