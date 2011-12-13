/// <reference path="/js/scripts/Object/keys.js" />
/// <reference path="/js/scripts/Array/prototype/indexOf.js" />
/// <reference path="/js/scripts/Array/prototype/forEach.js" />

BASE.require(["Array.prototype.indexOf", "Object.keys", "Array.prototype.forEach"], function () {

    var camelCase = (function () {
        var re = /^./i
        return function (x) {
            return x.replace(re, function (x) {
                return x.toUpperCase();
            });
        };
    } ());

    var Event = function (type) {
        ///<summary>
        ///An Event Class. 
        ///     1. Event("remove"). --> creates an event that can be fired
        ///</summary>
        ///<param type="Object" name="obj">
        ///Any Object is acceptable.
        ///</param>
        ///<returns type="undefined" />
        if (!(this instanceof Event)) {
            return new Event(type);
        }

        var event = this;
        event.type = type;

    };

    BASE.enableObserving = function (obj) {
        ///<summary>
        ///A method to enable property observing on an object. By creating getters a setters for every property. (All Browsers)
        ///e.g. obj.prop1 --> obj.setProp1 and obj.getProp1;
        ///</summary>
        ///<param type="Object" name="obj">
        ///Any Object is acceptable.
        ///</param>
        ///<returns type="undefined" />

        //Listener object.
        var instance = obj;
        var propertyListeners = {};
        var changeListeners = [];

        //Emits a property change event, and invokes callbacks.
        var notifyObservers = function (event) {
            if (event instanceof Event && notifyObservers.enabled) {

                for (var y = 0; y < changeListeners.length; y++) {
                    changeListeners[y].apply(instance, arguments);
                }

                var listenerArray = propertyListeners[event.type];
                if (listenerArray) {
                    for (var x = 0; x < listenerArray.length; x++) {
                        listenerArray[x].apply(instance, arguments);
                    }
                }

            }
        };

        notifyObservers.enabled = true;

        //Adds listeners
        instance.observe = function (name, callback) {
            ///<summary>
            ///Listen for one or all property change(s) on an object.
            ///    1. observe([String type], Function callback) The type is optional, so if the type isn't passed it listens to all property changes on the object.
            ///e.g. obj.prop1 --> obj.setProp1 and obj.getProp1;
            ///</summary>
            ///<param type="String" name="type">
            ///The name of the property to listen to for changes.
            ///</param>
            ///<param type="Function" name="callback">
            ///The callback to be invoked on a property change.
            ///</param>
            ///<returns type="undefined" />
            var type = name;
            if (arguments.length === 2) {
                if (!propertyListeners[type]) {
                    propertyListeners[type] = [];
                }

                propertyListeners[type].push(callback);
            } else if (typeof type === "function") {
                changeListeners.push(type);
            }
        };

        //Emits the property callback once and then removes it for you.
        instance.observeOnce = function (type, callback) {
            callback = callback || type;

            if (arguments.length === 2) {
                var once = function (e) {
                    callback.apply(this, arguments);
                    instance.unobserve(type, once);
                }; x

                instance.observe(type, once);
            } else if (arguments.length === 1) {
                var once = function (e) {
                    callback.apply(this, arguments);
                    instance.unobserve(once);
                };
                instance.observe(once);
            }

        };

        //You can remove all listeners of a specified type or refer to a specific listener to remove.
        instance.unobserve = function (type, callback) {
            if (callback && typeof type === "string" && propertyListeners[type]) {
                var listenerArray = propertyListeners[type];

                var index = listenerArray.indexOf(callback);
                if (index > -1) {
                    listenerArray.splice(index, 1);
                }

            } else if (typeof type === "function") {

                Object.keys(propertyListeners).forEach(function (a) {
                    var index = propertyListeners[a].indexOf(type);
                    if (index > -1) {
                        propertyListeners[a].splice(index, 1);
                    }
                });

                var index = changeListeners.indexOf(type);
                if (index > -1) {
                    changeListeners.splice(index, 1);
                }
            }
        };

        //This is the object where we store the variable values.
        var variables = {};

        //Get the property names using Object.keys, then forEach the values.
        Object.keys(instance).forEach(function (x) {
            if (typeof instance[x] !== 'function') {
                variables[x] = instance[x];

                var getterName = "get" + camelCase(x);
                var setterName = "set" + camelCase(x);

                var hasGetter = instance[getterName];
                var hasSetter = instance[setterName];

                //If it has a getter already, then let the getter handle the response.
                if (hasGetter) {

                    instance[getterName] = function () {
                        return instance[getterName]();
                    };

                } else {
                    instance[getterName] = function () {
                        return instance[x];
                    };
                }

                if (hasSetter) {

                    instance[setterName] = function (val) {
                        var fireEvents = notifyObservers.enabled;
                        var oldValue = instance[x];

                        if (fireEvents) {
                            notifyObservers.enabled = false;
                        };

                        hasSetter.apply(instance, arguments);

                        if (fireEvents) {
                            notifyObservers.enabled = true;
                        }

                        //Trigger event
                        if (oldValue !== val && instance[x] === val) {
                            var event = new Event(x);
                            event.newValue = val;
                            event.oldValue = oldValue;
                            event.property = x;
                            event.target = instance;

                            notifyObservers(event);
                        }
                    };

                } else if (!hasGetter && !hasSetter) {
                    instance[setterName] = function (val) {
                        instance[x] = val;
                        //Trigger event
                        if (oldValue !== val) {
                            var event = new Event(x);
                            var oldValue = variables[x];
                            var event = new Event(x);
                            event.newValue = val;
                            event.oldValue = oldValue;
                            event.property = x;
                            event.target = instance;

                            notifyObservers(event);
                        }

                    };
                }
            }
        });
    };


});