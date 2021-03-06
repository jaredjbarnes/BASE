﻿(function () {
    var EventEmitter = function () {
        if (!this.hasOwnProperty("isEmitter")) {
            var listeners = {};
            var eventEmitter = this;

            var Event = function (type) {
                if (!(this instanceof Event)) {
                    return new Event(type);
                }

                var event = this;
                event.type = type;
                event.propagation = true;
                var isDefaultPrevented = false;

                event.stopPropagation = function () {
                    event.propagation = false;
                };
                event.preventDefault = function () {
                    isDefaultPrevented = true;
                };
                event.isDefaultPrevented = function () {
                    return isDefaultPrevented;
                };
                event.emit = function () {
                    eventEmitter.emit(event);
                };
            };

            eventEmitter.emit = function (event) {
                if (event instanceof Event) {
                    var listenerArray = listeners[event.type];
                    if (listenerArray) {
                        listenerArray = listenerArray.slice();
                        for (var x = 0; x < listenerArray.length; x++) {
                            if (event.propagation) {
                                if (listenerArray[x].apply(eventEmitter, [event]) === false) {
                                    event.preventDefault();
                                    event.stopPropagation();
                                }
                            } else {
                                break;
                            }
                        }
                    }
                }
            };

            eventEmitter.removeAllListeners = function () {
                this.setListeners({});
            };

            eventEmitter.spliceListener = function (index, type, callback) {
                if (!listeners[type]) {
                    listeners[type] = [];
                }

                listeners[type].splice(index, 0, callback);
            };

            eventEmitter.addListener = function (type, callback) {
                if (!listeners[type]) {
                    listeners[type] = [];
                }

                listeners[type].push(callback);
            };

            eventEmitter.on = this.addListener;
            eventEmitter.once = function (type, callback) {

                var once = function (e) {
                    callback(e);
                    eventEmitter.removeListener(type, once);
                };

                eventEmitter.addListener(type, once);
            };
            eventEmitter.removeListener = function (type, callback) {
                if (callback && listeners[type]) {
                    var listenerArray = listeners[type];
                    for (var x = 0; x < listenerArray.length; x++) {
                        if (listenerArray[x] === callback) {
                            listenerArray.splice(x, 1);
                            x--;
                        }
                    }
                } else {
                    listeners[type] = [];
                }
            };

            eventEmitter.getListeners = function () {
                var obj = {};
                for (var x in listeners) {
                    obj[x] = listeners[x].slice();
                }

                return obj;
            };

            eventEmitter.setListeners = function (o) {
                var cleared = true;
                outer: for (var x in o) {
                    if (Object.prototype.toString.call(o[x]) !== '[object Array]') {
                        cleared = false;
                        break;
                    } else {
                        for (var a = 0; a < o[x].length; a++) {
                            if (typeof o[x][a] !== "function") {
                                cleared = false;
                                break outer;
                            }
                        }
                    }
                }

                if (cleared) {
                    listeners = o;
                }
            };
            Object.defineProperty(eventEmitter, "isEmitter", {
                get: function () {
                    return true;
                }
            });
            eventEmitter.Event = Event;
        }
    };

    Object.defineProperty(Object.prototype, "enableEventEmitting", {
        writable: false,
        enumerable: false,
        value: EventEmitter
    });

})();