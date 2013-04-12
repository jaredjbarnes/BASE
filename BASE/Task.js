BASE.require(["BASE.Observable", "BASE.ObservableEvent", "BASE.Future"], function () {
    BASE.Task = (function (Super) {

        // A Task takes any Observable that fires events 
        // of "complete" (Once).
        var Future = BASE.Future;

        var Task = function () {
            var self = this;
            if (!(self instanceof Task)) {
                return new Task();
            }

            Super.call(self);

            var futures = Array.prototype.slice.call(arguments, 0);
            var completedFutures = [];
            var _started = false;

            futures.forEach(function (future, index) {
                if (typeof future === "function") {
                    futures[index] = new Future(future);
                }
            });

            Object.defineProperties(self, {
                "value": {
                    get: function () {
                        if (!_started) {
                            self.start();
                            return undefined;
                        } else {
                            return futures;
                        }

                    }
                }
            });

            self.whenAll = function (callback) {
                self.observe(callback, "whenAll");
                return self;
            };

            self.whenAny = function (callback) {
                self.observe(callback, "whenAny");
                return self;
            };

            self.add = function () {
                if (completedFutures.length === 0) {
                    futures.push.apply(futures, arguments);
                } else {
                    throw new Error("Cannot add to a task when it has already finished.");
                }
            };

            var _notify = function (future) {
                completedFutures.push(future);
                var event = new BASE.ObservableEvent("whenAny");
                event.future = future;
                self.notify(event);

                if (completedFutures.length === futures.length) {
                    var event = new BASE.ObservableEvent("whenAll");
                    event.futures = futures;
                    self.notify(event);

                    var completeEvent = new BASE.ObservableEvent("complete");
                    completeEvent.futures = futures;
                    self.notify(completeEvent);

                    futures = [];
                    completedFutures = [];
                }
            };

            self.start = function () {
                if (_started === false) {
                    if (futures.length > 0) {
                        _started = true;
                        futures.forEach(function (future) {
                            var value = future.value;
                            var error = future.errorObject;
                            if (typeof value !== "undefined" || typeof error !== "undefined") {
                                setTimeout(function () {
                                    _notify(future);
                                }, 0);
                            } else {
                                future.observe(function observer(value) {
                                    future.unobserve(observer, "complete");
                                    _notify(future);
                                }, "complete");
                            }

                        });
                    } else {
                        setTimeout(function () {
                            var event = new BASE.ObservableEvent("whenAll");
                            event.futures = futures;
                            self.notify(event);

                            var completeEvent = new BASE.ObservableEvent("complete");
                            completeEvent.futures = futures;
                            self.notify(completeEvent);
                        }, 0);
                    }
                }
                return self;
            };

            return self;
        };
        BASE.extend(Task, Super);

        Task.create = function (getValue) {
            return new Future(getValue);
        };

        return Task;
    }(BASE.Observable));

});