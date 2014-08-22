BASE.require([
    "BASE.collections.MultiKeyMap",
    "BASE.collections.Hashmap",
    "BASE.util.Observable"
    ], function () {
    
    var emptyFn = function () { };
    var MultiKeyMap = BASE.collections.MultiKeyMap;
    var Hashmap = BASE.collections.Hashmap;
    var Observable = BASE.util.Observable;
    var Observer = BASE.util.Observer;
    
    var PropertyBehavior = function (behavior) {
        var self = this;
        
        var activeState;
        
        var state = activeState = {
            dispose: function () {
                state = disposeState;
                self.onDispose();
            },
            start: emptyFn,
            stop: function () {
                state = stoppedState;
            },
            run: function () {
                return behavior.apply(null, arguments);
            }
        };
        
        var stoppedState = {
            dispose: activeState.dispose,
            start: function () {
                state = activeState;
            },
            stop: emptyFn,
            run: emptyFn
        };
        
        var disposeState = {
            dispose: emptyFn,
            start: emptyFn,
            stop: emptyFn,
            run: emptyFn
        };
        
        self.onDispose = emptyFn;
        
        self.run = function () {
            return state.run.apply(null, arguments);
        };
        
        self.start = function () {
            return state.start.apply(null, arguments);
        };
        
        self.stop = function () {
            return state.stop.apply(null, arguments);
        };
        
        self.dispose = function () {
            return state.dispose.apply(null, arguments);
        };
        
    };
    
    BASE.namespace("BASE.util");
    
    BASE.util.PropertyBehavior = function () {
        var self = this;
        
        BASE.assertNotGlobal(self);
        
        if (typeof self.createPropertyBehavior === "function") {
            return;
        }
        
        Observable.call(self);
        
        var behaviors = new MultiKeyMap();
        
        self.createPropertyBehavior = function (property, behavior) {
            var propertyBehavior = new PropertyBehavior(behavior);
            behaviors.add(property, behavior, propertyBehavior);
            propertyBehavior.onDispose = function () {
                behaviors.remove(property, behavior);
            };
            return propertyBehavior;
        };
        
        var observers = [];
        var propertyObserver = self.observe().filter(function (e) {
            return e.type === "propertyChange";
        }).onEach(function (e) {
            observers.forEach(function (observer) {
                observer.notify(e);
            });
        });
        
        self.observeProperty = function (property, callback) {
            var observer = new Observer(function () {
                var index = observers.indexOf(observer);
                if (index >= 0) {
                    observers.splice(index, 1);
                }
            }, function (e) {
                return e.property === property;
            }).onEach(callback);
            
            observers.push(observer);
            return observer;
        };
        
        Object.keys(self).forEach(function (key) {
            
            if (typeof self[key] !== "function") {
                
                var definedProperty = Object.getOwnPropertyDescriptor(self, key);
                var oldSetter = definedProperty.set || function () { };
                var oldGetter = definedProperty.get || function () { return currentValue; };
                var getter;
                var setter;
                var currentValue = self[key];
                
                if (!definedProperty || definedProperty.configurable) {
                    
                    if (definedProperty.get && !definedProperty.set) {
                        throw new Error("Property Behavior cannot not be used when just the getter is defined. We can't reach into your scope.");
                    }
                    
                    getter = function () {
                        return oldGetter();
                    };
                    
                    setter = function (value) {
                        oldSetter(value);
                        var oldValue = currentValue;
                        if (value !== currentValue) {
                            currentValue = value;
                            
                            var propertyBehaviors = behaviors.get(key) || new Hashmap();
                            propertyBehaviors.getValues().forEach(function (propertyBehavior) {
                                propertyBehavior.run(value);
                            });
                            
                            self.notify({
                                type: "propertyChange",
                                property: key,
                                oldValue: oldValue,
                                newValue: value
                            });
                        }
                    };
                    
                    Object.defineProperty(self, key, {
                        configurable: true,
                        get: getter,
                        set: setter
                    });
                
                }
            }
        });

    };

});
