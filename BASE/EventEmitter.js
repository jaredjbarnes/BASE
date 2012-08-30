/// <reference path="http://raw.github.com/jaredjbarnes/BASE/master/BASE.js" />
/// <reference path="http://raw.github.com/jaredjbarnes/BASE/master/BASE/Event.js" />

BASE.require(["BASE.Event"], function () {
    BASE.EventEmitter = function () {
        ///<summary>
        ///A Class that provides all nesseccary methods to create events and emit them to objects that are listening.
        ///</summary>
        ///<returns type="BASE.EventEmitter" >
        ///Returns "BASE.EventEmitter" object.
        ///</returns>
        var eventEmitter = this;
        var listeners = {};

        var Event = BASE.Event;

        eventEmitter.emit = function (event) {
            if (event instanceof Event) {
                var listenerArray = listeners[event.type];
                var type = event.type;
                if (listenerArray) {
                    listenerArray = listenerArray.slice();
                    for (var x = 0; x < listenerArray.length; x++) {
                        event.type = type;
                        if (event.propagation) {
                            if (listenerArray[x].apply(eventEmitter, [event]) === false) {
                                event.propagation = false;
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
            eventEmitter.setListeners({});
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

        eventEmitter.on = eventEmitter.addListener;

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

        return eventEmitter;
    };

});