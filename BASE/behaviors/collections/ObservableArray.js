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

    var Observer = BASE.util.Observer;

    BASE.behaviors.collections.ObservableArray = function (Type) {
        var self = this;

        if (!Array.isArray(self)) {
            throw new Error("This behavior can only be applied to an array.");
        }

        // Check to see if its already observable.
        if (self.isObservable) {
            return;
        }

        self.isObservable = true;

        var observer = new Observer();

        self.Type = Type || Object;

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
            observer.notify(event);
        };
        self.observe = function (callback) {
            return observer.copy().onEach(callback);
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