BASE.require(["BASE.Observable", "BASE.ObservableEvent", "BASE.Future"], function () {
    BASE.Task = (function (Super) {

        // A Task takes any Observable that fires events 
        // of "complete" (Once) with "success" or "error" (Once)
        var Future = BASE.Future;

        var Task = function () {
            var self = this;
            if (!(self instanceof Task)) {
                return new Task();
            }

            Super.call(self);

            var futures = Array.prototype.slice.call(arguments, 0);
            var completedFutures = [];

            futures.forEach(function (future, index) {
                if (typeof future === "function") {
                    futures[index] = new Future(future);
                }
            });

            self.whenAll = function (callback) {
                self.observe(callback, "whenAll");
            };

            self.whenAny = function (callback) {
                self.observe(callback, "whenAny");
            };

            self.start = function () {
                if (futures.length > 0) {
                    futures.forEach(function (future) {
                        var value = future.value;
                        var error = future.error;
                        if (typeof future.value !== "undefined" || typeof future.error !== "undefined") {
                            setTimeout(function () {
                                completedFutures.push(future);
                                if (completedFutures.length === futures.length) {
                                    var event = new BASE.ObservableEvent("whenAll");
                                    event.futures = futures;
                                    self.notify(event);
                                }
                            }, 0);
                        } else {
                            future.observe(function (value) {
                                completedFutures.push(future);

                                var event = new BASE.ObservableEvent("whenAny");
                                event.future = future;
                                self.notify(event);

                                if (completedFutures.length === futures.length) {
                                    var event = new BASE.ObservableEvent("whenAll");
                                    event.futures = futures;
                                    self.notify(event);
                                }
                            }, "complete");
                        }

                    });
                } else {
                    var event = new BASE.ObservableEvent("whenAll");
                    event.futures = futures;
                    self.notify(event);
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