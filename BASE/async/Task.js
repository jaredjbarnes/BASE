BASE.require(["BASE.util.Notifiable", "BASE.util.ObservableEvent", "BASE.async.Future"], function () {

    BASE.namespace("BASE.async");

    BASE.async.Task = (function (Super) {

        // A Task takes any Observable that fires events 
        // of "complete" (Once).
        var Future = BASE.async.Future;

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

            var _defaultState = {
                whenAll: function (callback) {
                    var wrapper = function () {
                        self.unobserve(wrapper, "whenAll");
                        callback(futures);
                    };
                    self.observe(wrapper, "whenAll");
                },
                whenAny: function (callback) {
                    var wrapper = function (event) {
                        self.unobserve(wrapper, "whenAny");
                        callback(event.future);
                    };
                    self.observe(wrapper, "whenAny");
                    completedFutures.forEach(function (future) {
                        setTimeout(function () {
                            callback(future);
                        }, 0);
                    });
                },
                ifCanceled: function (callback) {
                    var wrapper = function (event) {
                        self.unobserve(wrapper, "canceled");
                        callback();
                    };
                    self.observe(wrapper, "canceled");
                }
            };

            var _startedState = {
                whenAll: _defaultState.whenAll,
                whenAny: _defaultState.whenAny,
                ifCanceled: _defaultState.ifCanceled
            };

            var _canceledState = {
                whenAll: function (callback) { },
                whenAny: function (callback) { },
                ifCanceled: function (callback) {
                    setTimeout(function () {
                        callback();
                    }, 0);
                }
            };

            var _finishedState = {
                whenAll: function (callback) {
                    setTimeout(function () {
                        callback(completedFutures);
                    }, 0);
                },
                whenAny: function (callback) {
                    completedFutures.forEach(function (future) {
                        setTimeout(function () {
                            callback(future);
                        }, 0);
                    });
                },
                ifCanceled: function (callback) { }
            };

            var _state = _defaultState;

            self.whenAll = function (callback) {
                _state.whenAll(callback);
                return self;
            };

            self.whenAny = function (callback) {
                _state.whenAny(callback);
                return self;
            };

            self.ifCanceled = function (callback) {
                _state.ifCanceled(callback);
                return self;
            };

            self.add = function () {
                if (completedFutures.length === 0) {
                    futures.push.apply(futures, arguments);
                } else {
                    throw new Error("Cannot add to a task when it has already finished.");
                }
                return self;
            };

            var _notify = function (future) {
                completedFutures.push(future);
                var event = new BASE.util.ObservableEvent("whenAny");
                event.future = future;
                self.notify(event);

                if (completedFutures.length === futures.length) {
                    var event = new BASE.util.ObservableEvent("whenAll");
                    event.futures = futures;
                    self.notify(event);

                    var completeEvent = new BASE.util.ObservableEvent("complete");
                    completeEvent.futures = futures;
                    self.notify(completeEvent);

                    futures = [];
                    completedFutures = [];
                }
            };

            var _cancel = function () {
                if (_state !== _finishedState && _state !== _canceledState) {
                    _state = _canceledState;
                    self.notify(new BASE.util.ObservableEvent("canceled"));
                }
            };

            self.start = function () {
                _state = _startedState
                if (futures.length > 0) {
                    futures.forEach(function (future) {
                        var value = future.value;
                        var error = future.error;
                        if (future.isComplete) {
                            setTimeout(function () {
                                _notify(future);
                            }, 0);
                        } else {
                            future.observe(function observer(value) {
                                future.unobserve(observer, "complete");
                                _notify(future);
                            }, "complete");
                        }

                        future.ifCanceled(_cancel);
                    });
                } else {
                    _state = _finishedState;
                    setTimeout(function () {
                        var event = new BASE.util.ObservableEvent("whenAll");
                        event.futures = futures;
                        self.notify(event);

                        var completeEvent = new BASE.util.ObservableEvent("complete");
                        completeEvent.futures = futures;
                        self.notify(completeEvent);
                    }, 0);
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
    }(BASE.util.Notifiable));

});