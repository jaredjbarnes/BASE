BASE.require([], function () {

    BASE.namespace("BASE.behaviors.collections");

    var emptyFn = function () { };

    var ArrayChangedEvent = (function () {
        function ArrayChangedEvent(target, newItems, oldItems) {
            this.newItems = [];
            this.oldItems = [];
            this.newItems = newItems;
            this.oldItems = oldItems;
        }
        return ArrayChangedEvent;
    })();

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

    BASE.behaviors.collections.ObservableArray = function () {
        var self = this;

        if (!Array.isArray(self)) {
            throw new Error("This behavior can only be applied to an array.");
        }

        // Check to see if its already observable.
        if (self.isObservable) {
            return;
        }

        self.isObservable = true;

        var observers = [];

        self.push = function () {
            var result;
            var items = Array.prototype.slice.call(arguments);
            result = Array.prototype.push.apply(this, arguments);
            var event = new ArrayChangedEvent(this, items, []);
            this.notify(event);
            return result;
        };

        self.pop = function () {
            var result;
            if (this.length > 0) {
                var item = this[this.length - 1];
                result = Array.prototype.pop.apply(this, arguments);
                var event = new ArrayChangedEvent(this, [], [
                    item
                ]);
                this.notify(event);
            }
            return result;
        };

        self.splice = function () {
            var result;
            var oldItems;
            var event;
            var newItems = Array.prototype.slice.call(arguments, 2);

            result = Array.prototype.splice.apply(this, arguments);
            oldItems = result.slice();
            event = new ArrayChangedEvent(this, newItems, oldItems);
            this.notify(event);
            return result;
        };

        self.slice = function () {
            var array = Array.prototype.slice.apply(this, arguments);
            BASE.behaviors.collections.ObservableArray.apply(array);
            return array;
        };

        self.shift = function () {
            var result;
            result = Array.prototype.shift.apply(this, arguments);
            var event = new ArrayChangedEvent(this, [], [result]);
            this.notify(event);
            return result;
        };

        self.unshift = function () {
            var result;
            result = Array.prototype.unshift.apply(this, arguments);
            var event = new ArrayChangedEvent(this, Array.prototype.slice.apply(arguments), []);
            this.notify(event);
            return result;
        };

        self.concat = function () {
            var newArray = Array.prototype.concat.apply(this, arguments);
             BASE.behaviors.collections.ObservableArray.apply(newArray);
            return newArray;
        };
        self.notify = function (event) {
            var observersCopy = observers.slice();
            observersCopy.forEach(function (observer) {
                observer.notify(event);
            });
        };
        self.observe = function (callback) {
            var observer = new Observer(callback, function () {
                var index = observers.indexOf(observer);
                if (index > -1) {
                    observers.splice(index, 1);
                }
            });
            observers.push(observer);

            return observer;
        };

        self.add = self.push;

        self.remove = function (item) {
            var index = this.indexOf(item);
            if (index >= 0) {
                this.splice(index, 1);
            }
        };

    };

});