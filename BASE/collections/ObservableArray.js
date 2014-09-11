BASE.require([], function () {
    
    BASE.namespace("BASE.collections");
    
    var emptyFn = function () { };
    
    var ArrayChangedEvent = function (target, newItems, oldItems, loadedItems, unloadedItems) {
        this.target = target;
        this.newItems = newItems || [];
        this.oldItems = oldItems || {};
        this.loadedItems = loadedItems || [];
        this.unloadedItems = unloadedItems || [];
    };
    
    var Observer = BASE.util.Observer;
    
    BASE.collections.ObservableArray = function (Type) {
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
        
        var remove = function () {
            var args = Array.prototype.slice.call(arguments, 0);
            args.forEach(function (item) {
                var index = self.indexOf(item);
                if (index >= 0) {
                    Array.prototype.splice.call(self, index, 1);
                }
            });
        };
        
        self.Type = Type || Object;
        
        self.load = function () {
            var result;
            var items = Array.prototype.slice.call(arguments);
            result = Array.prototype.push.apply(this, arguments);
            var event = new ArrayChangedEvent(this, [], [], items, []);
            this.notify(event);
            return result;
        };
        
        self.unload = function () {
            remove.apply(this, arguments);
            var items = Array.prototype.slice.call(arguments);
            var event = new ArrayChangedEvent(this, [], [], [], items);
            this.notify(event);
        };
        
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
            BASE.collections.ObservableArray.apply(array);
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
            BASE.collections.ObservableArray.apply(newArray);
            return newArray;
        };
        
        self.sync = function (newSet) {
            var notInNew = [];
            var notInThis = [];
            var thisArr = this;
            thisArr.forEach(function (item) {
                if (newSet.indexOf(item) === -1) {
                    notInNew.push(item);
                }
            });
            newSet.forEach(function (item) {
                if (thisArr.indexOf(item) === -1) {
                    notInThis.push(item);
                }
            });
            
            notInNew.forEach(function (item) {
                thisArr.remove(item);
            });
            
            notInThis.forEach(function (item) {
                thisArr.push(item);
            });
        };
        
        self.notify = function (event) {
            observer.notify(event);
        };
        self.observe = function (callback) {
            return observer.copy().onEach(callback);
        };
        
        self.add = self.push;
        
        self.remove = function () {
            remove.apply(this, arguments);
            var items = Array.prototype.slice.call(arguments);
            var event = new ArrayChangedEvent(this, [], items, [], []);
            this.notify(event);
        };

    };

});