﻿(function () {
    BASE.Observer = (function () {
        function Observer() {
            this._globalObservers = [];
            this._typeObservers = {
            };
        }
        Observer.prototype.observe = function (callback, type) {
            var callback;
            if (arguments.length === 2) {
                var type = arguments[1];
                callback = arguments[0];
                if (!this._typeObservers[type]) {
                    this._typeObservers[type] = [];
                }
                var observers = this._typeObservers[type];
                observers.push(callback);
            } else {
                callback = arguments[0];
                this._globalObservers.push(callback);
            }
        };
        Observer.prototype.unobserve = function (callback, type) {
            var callback;
            if (arguments.length === 2) {
                var type = arguments[1];
                callback = arguments[0];
                if (!this._typeObservers[type]) {
                    this._typeObservers[type] = [];
                }
                var observers = this._typeObservers[type];
                var index = observers.indexOf(callback);
                if (index >= 0) {
                    observers.splice(index, 1);
                }
            } else {
                callback = arguments[0];
                var index = this._globalObservers.indexOf(callback);
                if (index >= 0) {
                    this._globalObservers.splice(index, 1);
                }
            }
        };
        Observer.prototype.notify = function (event) {
            var globalObservers = this._globalObservers.slice(0);
            var typeObservers = [];
            if (this._typeObservers[event.type]) {
                typeObservers = this._typeObservers[event.type].slice(0);
            }
            globalObservers.forEach(function (observer) {
                observer(event);
            });
            typeObservers.forEach(function (observer) {
                observer(event);
            });
        };
        return Observer;
    })();

})();