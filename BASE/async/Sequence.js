BASE.require([
    "BASE.async.Continuation"
], function () {

    BASE.namespace("BASE.async");



    var Continuation = BASE.async.Continuation;
    var Future = BASE.async.Future;
    var emptyFn = function () { };

    BASE.async.Sequence = function () {
        var self = this;
        BASE.assertNotGlobal(self);

        var futures = [];
        var completedFutures = [];
        var observable = new BASE.util.Observable();



        var defaultState = {
            whenAll: function (callback) {
                observable.observeType("whenAll", callback);
            },
            whenAny: function (callback) {
                observable.observeType("whenAny", function (e) { callback(e.value); });
            },
            onComplete: function (callback) {
                observable.observeType("onComplete", function () { callback(futures); });
            },
            ifError: function (callback) {
                observable.observeType("ifError", function () { callback(); });
            },
            ifCanceled: function (callback) {
                observable.observeType("ifCanceled", function () { callback(); });
            },
            add: function () {
                add.apply(null, arguments);
            },
            start: function () {
                futures.reduce(function (continuation, currentValue, index) {
                    return continuation.then(function (value) {
                        return currentValue.then(function (value) {
                            observable.notify({ type: "whenAny", value: value });
                        });
                    });
                }, new Continuation(Future.fromResult(null))).then(function (value) {
                    fireComplete();
                }).ifCanceled(function (e) {
                    fireCanceled(e);
                }).ifError(function (e) {
                    fireError(e);
                });
                return self;
            }
        };

        var startedState = {
            whenAll: defaultState.whenAll,
            whenAny: defaultState.whenAny,
            onComplete: defaultState.onComplete,
            ifError: defaultState.ifError,
            ifCanceled: defaultState.ifCanceled,
            add: function () {
                throw new Error("Cannot add when the sequence is already in progress.");
            },
            start: emptyFn
        };

        var finishedSate = {
            whenAll: function (callback) {
                callback(futures);
            },
            whenAny: function (callback) {
                completedFutures.forEach(function (future) {
                    callback(future);
                });
            },
            onComplete: function (callback) {
                callback();
            },
            ifError: emptyFn,
            ifCanceled: emptyFn,
            add: function () {
                throw new Error("Cannot add when the sequence is already complete.");
            },
            start: emptyFn
        };

        var canceledState = {
            whenAll: emptyFn,
            whenAny: emptyFn,
            onComplete: emptyFn,
            ifError: emptyFn,
            ifCanceled: emptyFn,
            add: function () {
                throw new Error("Cannot add when the sequence is already in progress.");
            },
            start: emptyFn
        };

        var state = defaultState;

        var add = function () {
            Array.prototype.push.apply(futures, arguments);
        };

        var fireComplete = function () {
            state = finishedSate;
            observable.notify({ type: "onComplete" });
            observable.notify({ type: "whenAll" });
        };

        var fireCanceled = function () {
            state = canceledState;
            observable.notify({ type: "ifCanceled" });
        };

        var fireError = function () {
            state = canceledState;
            observable.notify({ type: "ifError" });
        };

        self.add = function () {
            state.add.apply(null, arguments);
        };
        self.whenAll = function (callback) {
            if (typeof callback === "function") {
                state.whenAll(callback);
            }
            return self;
        };
        self.whenAny = function (callback) {
            if (typeof callback === "function") {
                state.whenAny(callback);
            }
            return self;
        };
        self.ifCanceled = function (callback) {
            if (typeof callback === "function") {
                state.ifCanceled(callback);
            }
            return self;
        };
        self.onComplete = function (callback) {
            if (typeof callback === "function") {
                state.onComplete(callback);
            }
            return self;
        };

        self.start = function () {
            state.start();
            return self;
        };

        add.apply(null, arguments);

    };

});