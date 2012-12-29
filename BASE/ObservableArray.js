(function(){

    var ArrayChangedEvent = (function () {
        function ArrayChangedEvent(target, newItems, oldItems) {
            this.newItems = [];
            this.oldItems = [];
            this.newItems = newItems;
            this.oldItems = oldItems;
        }
        return ArrayChangedEvent;
    })();
    
    BASE.ObservableArray = function () {
        Array.apply(this, arguments);
    };
    
    BASE.ObservableArray.prototype = new Array();
    BASE.ObservableArray.prototype.push = function () {
        var result;
        var items = Array.prototype.slice.call(arguments);
        result = Array.prototype.push.apply(this, arguments);
        var event = new ArrayChangedEvent(this, items, []);
        this.notify(event);
        return result;
    };
    BASE.ObservableArray.prototype.pop = function () {
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
    BASE.ObservableArray.prototype.splice = function () {
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
    BASE.ObservableArray.prototype.shift = function () {
        var result;
        result = Array.prototype.shift.apply(this, arguments);
        var event = new ArrayChangedEvent(this, [], [
            result
        ]);
        this.notify(event);
        return result;
    };
    BASE.ObservableArray.prototype.unshift = function () {
        var result;
        result = Array.prototype.unshift.apply(this, arguments);
        var event = new ArrayChangedEvent(this, Array.prototype.slice.apply(arguments), []);
        this.notify(event);
        return result;
    };
    BASE.ObservableArray.prototype.concat = function () {
        var result = this.toArray();
        return new ObservableArray(Array.prototype.concat.apply(result, arguments));
    };
    BASE.ObservableArray.prototype.toArray = function (result) {
        result = result || [];
        for (var x = 0; x < self.length; x++) {
            result.push(self[x]);
        }
        return result;
    };
    BASE.ObservableArray.prototype.notify = function (event) {
        if (!this._observers) {
            this._observers = [];
        }
        var observers = this._observers.slice();
        observers.forEach(function (observer) {
            observer(event);
        });
    };
    BASE.ObservableArray.prototype.observe = function (callback) {
        if (!this._observers) {
            this._observers = [];
        }
        this._observers.push(callback);
    };
    BASE.ObservableArray.prototype.unobserve = function (callback) {
        if (!this._observers) {
            this._observers = [];
        }
        var index = this._observers.indexOf(callback);
        if (index >= 0) {
            this._observers.splice(index, 1);
        }
    };
    BASE.ObservableArray.prototype.add = BASE.ObservableArray.prototype.push;
    BASE.ObservableArray.prototype.remove = function (item) {
        var index = this.indexOf(item);
        if (index >= 0) {
            this.splice(index, 1);
        }
    };

})();