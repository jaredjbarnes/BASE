BASE.require([

], function () {
    BASE.namespace("BASE.util");

    var emptyFn = function () { };

    var Observer = function (callback, unbind) {
        var self = this;
        var state;

        var defaultState = {
            stop: function () {
                state = stoppedState;
            },
            start: emptyFn,
            notify: function (e) {
                callback(e);
            },
            dispose: function () {
                unbind();
                state = disposedState;
            }
        };

        var disposedState = {
            stop: emptyFn,
            start: emptyFn,
            notify: emptyFn,
            dispose: emptyFn
        };

        var stoppedState = {
            stop: emptyFn,
            start: function () {
                state = defaultState;
            },
            notify: emptyFn,
            dispose: emptyFn
        };

        state = defaultState;

        self.notify = function (e) {
            state.notify(e);
        }

        self.stop = function () {
            state.stop();
        };

        self.start = function () {
            state.start();
        };

        self.dispose = function () {
            state.dispose();
        }
    };

    BASE.util.Observable = function () {
        var self = this;

        var observers = {};
        var globalObservers = [];

        var getObservers = function (type) {
            var typeObservers = observers[type]
            if (!typeObservers) {
                typeObservers = observers[type] = [];
            }

            return typeObservers;
        };

        var makeObserver = function (observers, callback) {
            var observer = new Observer(callback, function () {
                var index = observers.indexOf(observer);
                observers.splice(index, 1);
            });
            observers.push(observer);
            return observer;
        };

        self.observe = function (type, callback) {
            var observers = getObservers(type);
            return makeObserver(observers, callback);
        };

        self.observeAll = function (callback) {
            var observers = globalObservers;
            return makeObserver(observers, callback);
        };

        self.notify = function (e) {
            var typeObservers = getObservers(e.type);
            typeObservers.forEach(function (observer) {
                observer.notify(e);
            });
            globalObservers.forEach(function (observer) {
                observer.notify(e);
            });
        };
    };

});