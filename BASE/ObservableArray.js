/// <reference path="http://raw.github.com/jaredjbarnes/BASE/master/BASE.js" />
/// <reference path="http://raw.github.com/jaredjbarnes/BASE/master/BASE/EventEmitter.js" />

BASE.require(["BASE.EventEmitter"], function () {
    BASE.ObservableArray = function (array) {
        if (!(this instanceof BASE.ObservableArray)) {
            return new BASE.ObservableArray(array);
        }


        BASE.EventEmitter.call(this);
        Array.call(this);
        var T = null;

        var self = this;
        if (array) {
            for (var x = 0 ; x < array.length; x++) {
                Array.prototype.push.apply(self, [array[x]]);
            }
        }

        self.push = function (item) {
            if (T === null || item instanceof T) {
                var result;

                var items = Array.prototype.slice.call(arguments);
                result = Array.prototype.push.apply(self, arguments);
                var event = new BASE.Event("collectionChanged");
                event.newItems = items;
                event.oldItems = [];

                self.emit(event);

                return result;
            } else {
                throw new Error("Wrong Type.");
            }
        };

        self.pop = function () {
            var result;
            if (self.length > 0) {
                var item = self[self.length - 1];


                result = Array.prototype.pop.apply(self, arguments);
                var event = new BASE.Event("collectionChanged");
                event.newItems = [];
                event.oldItems = [item];

                self.emit(event);
            }
            return result;

        };

        self.splice = function () {
            var result;
            var newItems = Array.prototype.slice.apply(arguments, [2, arguments.length]);
            var oldItems;

            if (T !== null) {
                for (var x = 0; x < newItems.length ; x++) {
                    if (!(newItems[x] instanceof T)) {
                        throw new Error("Wrong Type.");
                    }
                }
            }
            result = Array.prototype.splice.apply(self, arguments);

            oldItems = result.slice();
            var event = new BASE.Event("collectionChanged");
            event.newItems = newItems;
            event.oldItems = oldItems;

            self.emit(event);
            return result;
        };

        self.shift = function () {
            var result;

            result = Array.prototype.shift.apply(self, arguments);
            var event = new BASE.Event("collectionChanged");
            event.newItems = [];
            event.oldItems = [result];

            self.emit(event);
            return result;
        };

        self.unshift = function () {
            var result;

            if (T !== null) {
                for (var x = 0; x < arguments.length ; x++) {
                    if (!(arguments[x] instanceof T)) {
                        throw new Error("Wrong Type.");
                    }
                }
            }

            result = Array.prototype.unshift.apply(self, arguments);
            var event = new BASE.Event("collectionChanged");
            event.newItems = Array.prototype.slice.apply(arguments);
            event.oldItems = [];

            self.emit(event);
            return result;
        };

        self.concat = function () {
            var result = self.toArray();
            return new BASE.ObservableArray(Array.prototype.concat.apply(result, arguments));
        };

        self.toArray = function () {
            var result = [];
            for (var x = 0 ; x < self.length; x++) {
                result.push(self[x]);
            }
            return result;
        };

        self.ofType = function (Type) {
            T = Type;
            return self;
        };

        self.getType = function () {
            return T;
        }
    };

    BASE.ObservableArray.prototype = new Array();

});

