BASE.require([], function () {

    BASE.namespace("BASE.collections");

    var ArrayChangedEvent = (function () {
        function ArrayChangedEvent(target, newItems, oldItems) {
            this.newItems = [];
            this.oldItems = [];
            this.newItems = newItems;
            this.oldItems = oldItems;
        }
        return ArrayChangedEvent;
    })();

    BASE.collections.ObservableArray = function () {
        var self = this;
        if (!(self instanceof BASE.collections.ObservableArray)) {
            self = new BASE.collections.ObservableArray();
        }

        for (var x = 0 ; x < arguments.length; x++) {
            self.push(arguments[x]);
        }

        return self;
    };

    BASE.collections.ObservableArray.prototype = new Array();
    BASE.collections.ObservableArray.prototype.push = function () {
        var result;
        var items = Array.prototype.slice.call(arguments);
        result = Array.prototype.push.apply(this, arguments);
        var event = new ArrayChangedEvent(this, items, []);
        this.notify(event);
        return result;
    };
    BASE.collections.ObservableArray.prototype.pop = function () {
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
    BASE.collections.ObservableArray.prototype.splice = function () {
        var result;
        var newItems = Array.prototype.slice.apply(arguments, [
            2
        ]);
        var oldItems;
        var event;
        result = Array.prototype.splice.apply(this, arguments);
        oldItems = result.slice();
        event = new ArrayChangedEvent(this, newItems, oldItems);
        this.notify(event);
        return result;
    };
    BASE.collections.ObservableArray.prototype.slice = function () {
        var array = Array.prototype.slice.apply(this, arguments);
        var result = new BASE.collections.ObservableArray();
        BASE.collections.ObservableArray.apply(result, array);
        return result;
    };
    BASE.collections.ObservableArray.prototype.shift = function () {
        var result;
        result = Array.prototype.shift.apply(this, arguments);
        var event = new ArrayChangedEvent(this, [], [
            result
        ]);
        this.notify(event);
        return result;
    };
    BASE.collections.ObservableArray.prototype.unshift = function () {
        var result;
        result = Array.prototype.unshift.apply(this, arguments);
        var event = new ArrayChangedEvent(this, Array.prototype.slice.apply(arguments), []);
        this.notify(event);
        return result;
    };
    BASE.collections.ObservableArray.prototype.concat = function () {
        var newArray = Array.prototype.concat.apply(this, arguments);
        var result = new BASE.collections.ObservableArray();
        return BASE.collections.ObservableArray.apply(result, newArray);
    };
    BASE.collections.ObservableArray.prototype.toArray = function (result) {
        result = result || [];
        for (var x = 0; x < self.length; x++) {
            result.push(self[x]);
        }
        return result;
    };
    BASE.collections.ObservableArray.prototype.notify = function (event) {
        if (!this._observers) {
            this._observers = [];
        }
        var observers = this._observers.slice();
        observers.forEach(function (observer) {
            observer(event);
        });
    };
    BASE.collections.ObservableArray.prototype.observe = function (callback) {
        if (!this._observers) {
            this._observers = [];
        }
        this._observers.push(callback);
    };
    BASE.collections.ObservableArray.prototype.unobserve = function (callback) {
        if (!this._observers) {
            this._observers = [];
        }
        var index = this._observers.indexOf(callback);
        if (index >= 0) {
            this._observers.splice(index, 1);
        }
    };
    BASE.collections.ObservableArray.prototype.add = BASE.collections.ObservableArray.prototype.push;
    BASE.collections.ObservableArray.prototype.remove = function (item) {
        var index = this.indexOf(item);
        if (index >= 0) {
            this.splice(index, 1);
        }
    };

    BASE.collections.ObservableArray.fromArray = function (array) {
        var observableArray = new BASE.collections.ObservableArray();
        array.forEach(function (item) {
            observableArray.push(item);
        });
        return observableArray;
    };

});