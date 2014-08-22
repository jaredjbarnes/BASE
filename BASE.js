(function () {
    
    var global = (function () { return this; }());
    
    var emptyFn = function () { };
    
    if (!Object.hasOwnProperty("keys")) {
        Object.keys = function (object) {
            var name;
            var result = [];
            for (name in object) {
                if (Object.prototype.hasOwnProperty.call(object, name)) {
                    result.push(name);
                }
            }
            
            return result;
        };
    }
    
    if (!Array.hasOwnProperty("isArray")) {
        Array.isArray = function (value) {
            return Object.prototype.toString.call(value) === "[object Array]";
        };
    }
    
    if (!Array.prototype.hasOwnProperty("every")) {
        Array.prototype.every = function (fn, thisp) {
            var i;
            var length = this.length;
            for (i = 0; i < length; i += 1) {
                if (this.hasOwnProperty(i) && !fn.call(thisp, this[i], i, this)) {
                    return false;
                }
            }
            return true;
        };
    }
    
    if (!Array.prototype.hasOwnProperty("some")) {
        Array.prototype.some = function (fn, thisp) {
            var i;
            var length = this.length;
            for (i = 0; i < length; i += 1) {
                if (this.hasOwnProperty(i) && fn.call(thisp, this[i], i, this)) {
                    return true;
                }
            }
            return false;
        };
    }
    
    if (!Array.prototype.hasOwnProperty("filter")) {
        Array.prototype.filter = function (fn, thisp) {
            var i;
            var length = this.length;
            var result = [];
            var value;
            
            for (i = 0; i < length; i += 1) {
                if (this.hasOwnProperty(i)) {
                    value = this[i];
                    if (fn.call(thisp, value, i, this)) {
                        result.push(value);
                    }
                }
            }
            return result;
        };
    }
    
    if (!Array.prototype.hasOwnProperty("indexOf")) {
        Array.prototype.indexOf = function (searchElement, fromIndex) {
            var i = fromIndex || 0;
            var length = this.length;
            
            while (i < length) {
                if (this.hasOwnProperty(i) && this[i] === searchElement) {
                    return i;
                }
                i += 1;
            }
            return -1;
        };
    }
    
    if (!Array.prototype.hasOwnProperty("lastIndexOf")) {
        Array.prototype.lastIndexOf = function (searchElement, fromIndex) {
            var i = fromIndex;
            if (typeof i !== "number") {
                i = length - 1;
            }
            
            while (i >= 0) {
                if (this.hasOwnProperty(i) && this[i] === searchElement) {
                    return i;
                }
                i -= 1;
            }
            return -1;
        };
    }
    
    if (!Array.prototype.hasOwnProperty("map")) {
        Array.prototype.map = function (fn, thisp) {
            var i;
            var length = this.length;
            var result = [];
            
            for (i = 0; i < length; i += 1) {
                if (this.hasOwnProperty(i)) {
                    result[i] = fn.call(thisp, this[i], i, this);
                }
            }
            
            return result;
        };
    }
    
    if (!Array.prototype.hasOwnProperty("reduceRight")) {
        Array.prototype.reduceRight = function (fn, initialValue) {
            var i = this.length - 1;
            
            while (i >= 0) {
                if (this.hasOwnProperty(i)) {
                    initialValue = fn.call(undefined, initialValue, this[i], i, this);
                }
                i -= 1
            }
            
            return initialValue;
        };
    }
    
    if (!Array.prototype.hasOwnProperty("reduce")) {
        Array.prototype.reduce = function (fn, initialValue) {
            var i;
            var length = this.length;
            
            for (i = 0; i < length; i += 1) {
                if (this.hasOwnProperty(i)) {
                    initialValue = fn.call(undefined, initialValue, this[i], i, this);
                }
            }
            
            return initialValue;
        };
    }
    
    if (!Array.prototype.hasOwnProperty("indexOf")) {
        Array.prototype.indexOf = function (searchElement, fromIndex) {
            var i = fromIndex || 0;
            var length = this.length;
            
            while (i < length) {
                if (this.hasOwnProperty(i) && this[i] === searchElement) {
                    return i;
                }
                i += 1;
            }
            return -1;
        };
    }
    
    if (!Array.prototype.except) {
        Array.prototype.except = function (array) {
            array = Array.isArray(array) ? array : [];
            return this.filter(function (n) {
                return array.indexOf(n) === -1;
            });
        };
    }
    
    if (!Array.prototype.hasOwnProperty("forEach")) {
        Array.prototype.forEach = function (fn, thisp) {
            var i;
            var length = this.length;
            
            for (i = 0; i < length; i += 1) {
                if (this.hasOwnProperty(i)) {
                    fn.call(thisp, this[i], i, this);
                }
            }
        };
    }
    
    
    var assertNotGlobal = function (instance) {
        if (global === instance) {
            throw new Error("Constructor executed in the scope of the global object.");
        }
    };
    
    var hasInterface = function (obj, methodNames) {
        return methodNames.every(function (name) {
            return typeof obj[name] === "function";
        });
    };
    
    var namespace = function (namespace) {
        var obj = namespace;
        var a = obj.split('.');
        var length = a.length;
        var tmpObj = global;
        var built = false;
        
        for (var x = 0; x < length; x++) {
            if (typeof tmpObj[a[x]] === 'undefined') {
                tmpObj = tmpObj[a[x]] = {};
                built = true;
            } else {
                tmpObj = tmpObj[a[x]];
            }
        }
        
        return built;
    };
    
    var isObject = function (namespace) {
        var obj = getObject(namespace);
        if (typeof obj === "undefined" || obj === null || (typeof obj === "number" && isNaN(obj))) {
            return false;
        } else {
            return true;
        }
    };
    
    var getObject = function (namespace, context) {
        context = typeof context === "undefined" ? global : context;
        
        if (namespace === "") {
            return context;
        }
        
        if (typeof namespace === "string") {
            var a = namespace.split('.');
            var length = a.length;
            var obj;
            
            obj = context[a[0]];
            
            if (typeof obj === "undefined") {
                return undefined;
            }
            
            for (var x = 1; x < length; x++) {
                if (typeof obj[a[x]] === 'undefined') {
                    return undefined;
                } else {
                    obj = obj[a[x]];
                }
            }
            
            return obj;
        } else {
            return undefined;
        }
    };
    
    var clone = function (object, deep) {
        var obj = {};
        var proto = object;
        for (var x in proto) {
            if (typeof proto[x] === 'object' && proto[x] !== null && deep) {
                obj[x] = clone(proto[x], deep);
            } else {
                obj[x] = proto[x];
            }
        }
        return obj;
    };
    
    var extend = function (SubClass, SuperClass) {
        
        if (typeof SubClass !== "function") {
            throw new TypeError("SubClass needs to be a function.");
        }
        
        if (typeof SuperClass !== "function") {
            throw new TypeError("SuperClass needs to be a function.");
        }
        
        function __() { this.constructor = SubClass; }
        __.prototype = SuperClass.prototype;
        
        SubClass.prototype = new __();
        SubClass.prototype.SuperConstructor = SuperClass;
        SubClass.prototype.Constructor = SubClass;
    };
    
    var concatPaths = function () {
        var args = Array.prototype.slice.call(arguments, 0);
        
        return args.reduce(function (value, nextUrl, index) {
            
            while (nextUrl.length > 0 && nextUrl.lastIndexOf("/") === nextUrl.length - 1) {
                nextUrl = nextUrl.substring(0, nextUrl.length - 1);
            }
            
            if (index > 0) {
                while (nextUrl.indexOf("/") === 0) {
                    nextUrl = nextUrl.substring(1, nextUrl.length);
                }
            }
            
            if (index > 0) {
                return value + "/" + nextUrl
            } else {
                return nextUrl;
            }

        }, "");
    };
    
    var Observer = function (unbind, filter, map) {
        var self = this;
        var state;
        
        var onEach = emptyFn;
        var onError = emptyFn;
        var observers = [];
        
        unbind = unbind || emptyFn;
        
        filter = filter || function () {
            return true;
        };
        
        map = map || function (item) {
            return item;
        };
        
        if (typeof filter !== "function") {
            throw new TypeError("Expected a function.");
        }
        
        if (typeof map !== "function") {
            throw new TypeError("Expected a function.");
        }
        
        var dispose = function () {
            unbind();
            state = disposedState;
        };
        
        var defaultState = {
            stop: function () {
                state = stoppedState;
            },
            start: emptyFn,
            notify: function (e) {
                
                if (filter(e)) {
                    
                    var value = map(e);
                    
                    try {
                        onEach(value);
                    } catch (error) {
                        if (onError === emptyFn) {
                            throw (error);
                        } else {
                            onError(error);
                        }
                    }
                    
                    observers.slice(0).forEach(function (observer) {
                        observer.notify(value);
                    });
                }

            },
            dispose: dispose
        };
        
        var disposedState = {
            stop: emptyFn,
            start: emptyFn,
            notify: emptyFn,
            dispose: emptyFn
        };
        
        var stoppedState = {
            stop: emptyFn,
            start: function () {
                state = defaultState;
            },
            notify: emptyFn,
            dispose: emptyFn
        };
        
        state = defaultState;
        
        self.notify = function (e) {
            state.notify(e);
        };
        
        self.copy = function () {
            return self.filter();
        };
        
        self.stop = function () {
            state.stop();
        };
        
        self.start = function () {
            state.start();
        };
        
        self.dispose = function () {
            state.dispose();
        };
        
        self.filter = function (filter) {
            var observer = new Observer(function () {
                var index = observers.indexOf(observer);
                if (index >= 0) {
                    observers.splice(index, 1);
                }

            }, filter);
            observers.push(observer);
            return observer;
        };
        
        self.map = function (map) {
            var observer = new Observer(function () {
                var index = observers.indexOf(observer);
                if (index >= 0) {
                    observers.splice(index, 1);
                }

            }, undefined, map);
            observers.push(observer);
            return observer;
        };
        
        self.onEach = function (callback) {
            if (typeof callback !== "function") {
                throw new Error("Expected a function.");
            }
            onEach = callback;
            return self;
        };
        
        self.onError = function (callback) {
            onError = callback;
            return self;
        };

    };
    
    var Observable = function () {
        var self = this;
        
        BASE.assertNotGlobal(self);
        
        // If it already implements this get out.
        if (BASE.hasInterface(self, ["observe", "observeType", "notify"])) {
            return;
        }
        
        var observers = [];
        
        self.getObservers = function () {
            return observers;
        };
        
        self.observe = function () {
            var observer = new Observer(function () {
                var index = observers.indexOf(observer);
                if (index >= 0) {
                    observers.splice(index, 1);
                }
            });
            observers.push(observer);
            return observer;
        };
        
        self.observeType = function (type, callback) {
            
            var observer = new Observer(function () {
                var index = observers.indexOf(observer);
                if (index >= 0) {
                    observers.splice(index, 1);
                }
            });
            
            var modifiedObserver = observer.filter(function (event) {
                if (typeof event.type !== "undefined" && event.type === type) {
                    return true;
                }
                return false;
            }).onEach(callback);
            
            observers.push(observer);
            return modifiedObserver;
        };
        
        self.notify = function (e) {
            observers.slice(0).forEach(function (observer) {
                observer.notify(e);
            });
        };
    };
    
    var Future = (function (Super) {
        
        var emptyState = {
            get: emptyFn,
            then: emptyFn,
            onComplete: emptyFn,
            ifError: emptyFn,
            ifCanceled: emptyFn,
            ifTimedOut: emptyFn,
            setTimeout: emptyFn,
            cancel: emptyFn
        };
        
        var Future = function (getValue) {
            var self = this;
            
            BASE.assertNotGlobal(self);
            
            var observers = new BASE.util.Observable();
            
            self.value = null;
            self.error = null;
            self.isCanceled = false;
            self.isComplete = false;
            
            var timeout = null;
            
            var defaultState = {
                get: function () {
                    _state = retrievingState;
                    getValue(function (value) {
                        if (_state === retrievingState) {
                            self.isComplete = true;
                            self.value = value;
                            _state = completeState;
                            observers.notify({ type: "then", value: value });
                            observers.notify({ type: "onComplete" });
                        }
                    }, function (error) {
                        if (_state === retrievingState) {
                            self.isComplete = true;
                            self.error = error;
                            _state = errorState;
                            observers.notify({ type: "ifError", error: error });
                            observers.notify({ type: "onComplete" });
                        }
                    });
                },
                then: function (callback) {
                    var listener = function (e) {
                        callback(e.value);
                    };
                    observers.observeType("then", listener);
                },
                onComplete: function (callback) {
                    var listener = function (e) {
                        callback();
                    };
                    observers.observeType("onComplete", listener);

                },
                ifError: function (callback) {
                    var listener = function (e) {
                        callback(e.error);
                    };
                    observers.observeType("ifError", listener);
                },
                ifCanceled: function (callback) {
                    var listener = function (e) {
                        callback();
                    };
                    observers.observeType("ifCanceled", listener);
                },
                ifTimedOut: function (callback) {
                    var listener = function (e) {
                        callback();
                    };
                    observers.observeType("ifTimedOut", listener);
                },
                setTimeout: function (milliseconds) {
                    if (typeof milliseconds !== "number") {
                        throw new Error("Expected milliseconds.");
                    }
                    
                    clearTimeout(timeout);
                    timeout = setTimeout(function () {
                        if (!self.isComplete) {
                            self.isComplete = true;
                            _state = timedOutState;
                            observers.notify({ type: "ifTimedOut" });
                            observers.notify({ type: "ifCanceled" });
                            observers.notify({ type: "onComplete" });
                        }
                    }, milliseconds);
                },
                cancel: function () {
                    self.isComplete = true;
                    self.isCanceled = true;
                    _state = canceledState;
                    observers.notify({ type: "ifCanceled" });
                    observers.notify({ type: "onComplete" });
                }
            };
            
            
            var RetrievingState = function () {
                this.get = function () { };
            };
            RetrievingState.prototype = defaultState;
            var retrievingState = new RetrievingState();
            
            
            var CanceledState = function () {
                this.onComplete = function (callback) {
                    callback();
                };
                this.ifCanceled = function (callback) {
                    callback();
                };
            };
            CanceledState.prototype = emptyState;
            var canceledState = new CanceledState();
            
            
            var ErrorState = function () {
                this.onComplete = function (callback) {
                    callback();
                };
                this.ifError = function (callback) {
                    callback(self.error);
                };
            };
            ErrorState.prototype = emptyState;
            var errorState = new ErrorState();
            
            var TimedOutState = function () {
                this.onComplete = function (callback) {
                    callback();
                };
                
                this.ifCanceled = function (callback) {
                    callback();
                };
                
                this.ifTimeOut = function (callback) {
                    callback();
                };
            };
            TimedOutState.prototype = emptyState;
            var timedOutState = new TimedOutState();
            
            var CompleteState = function () {
                this.then = function (callback) {
                    callback(self.value);
                };
                this.onComplete = function (callback) {
                    callback();
                };
            };
            CompleteState.prototype = emptyState;
            
            var completeState = new CompleteState();
            
            var _state = defaultState;
            
            self.then = function (callback) {
                callback = callback || emptyFn;
                _state.get();
                _state.then(callback);
                return self;
            };
            self.onComplete = function (callback) {
                callback = callback || emptyFn;
                _state.get();
                _state.onComplete(callback);
                return self;
            };
            self.ifError = function (callback) {
                callback = callback || emptyFn;
                _state.get();
                _state.ifError(callback);
                return self;
            };
            self.ifCanceled = function (callback) {
                callback = callback || emptyFn;
                _state.get();
                _state.ifCanceled(callback);
                return self;
            };
            self.ifTimedOut = function (callback) {
                callback = callback || emptyFn;
                _state.get();
                _state.ifTimedOut(callback);
                return self;
            };
            self.setTimeout = function (milliseconds) {
                _state.setTimeout(milliseconds);
                return self;
            };
            self.cancel = function () {
                _state.cancel();
                return self;
            };

        };
        
        Future.fromResult = function (value) {
            return new Future(function (setValue) {
                setValue(value);
            });
        };
        
        Future.fromError = function (error) {
            return new Future(function (setValue, setError) {
                setError(error);
            });
        };
        
        return Future;
    }());
    
    var Task = (function () {
        
        var Task = function () {
            var self = this;
            
            BASE.assertNotGlobal(self);
            
            var observers = new Observable();
            
            var futures = Array.prototype.slice.call(arguments, 0);
            var completedFutures = [];
            var _started = false;
            
            futures.forEach(function (future, index) {
                if (typeof future === "function") {
                    futures[index] = new Future(future);
                }
            });
            
            self.value = undefined;
            
            var _defaultState = {
                whenAll: function (callback) {
                    var listener = function () {
                        callback(futures);
                    };
                    observers.observeType("whenAll", listener);
                },
                whenAny: function (callback) {
                    var listener = function (event) {
                        callback(event.future);
                    };
                    
                    observers.observeType("whenAny", listener);
                    
                    completedFutures.forEach(function (future) {
                        callback(future);
                    });
                },
                onComplete: function (callback) {
                    var listener = function () {
                        callback();
                    };
                    
                    observers.observeType("onComplete", listener);
                },
                ifCanceled: function (callback) {
                    var listener = function (event) {
                        callback();
                    };
                    observers.observeType("canceled", listener);
                }
            };
            
            var _startedState = {
                whenAll: _defaultState.whenAll,
                whenAny: _defaultState.whenAny,
                onComplete: _defaultState.onComplete,
                ifCanceled: _defaultState.ifCanceled
            };
            
            var _canceledState = {
                whenAll: emptyFn,
                whenAny: emptyFn,
                onComplete: function (callback) {
                    callback();
                },
                ifCanceled: function (callback) {
                    callback();
                }
            };
            
            var _finishedState = {
                whenAll: function (callback) {
                    callback(completedFutures);
                },
                whenAny: function (callback) {
                    completedFutures.forEach(function (future) {
                        callback(future);
                    });
                },
                onComplete: function (callback) {
                    callback();
                },
                ifCanceled: emptyFn
            };
            
            var _state = _defaultState;
            
            self.whenAll = function (callback) {
                _state.whenAll(callback);
                return self;
            };
            
            self.whenAny = function (callback) {
                _state.whenAny(callback);
                return self;
            };
            
            self.onComplete = function (callback) {
                _state.onComplete(callback);
                return self;
            };
            
            self.ifCanceled = function (callback) {
                _state.ifCanceled(callback);
                return self;
            };
            
            self.cancel = function () {
                futures.forEach(function (future) {
                    future.cancel();
                });
                return self;
            };
            
            self.add = function () {
                if (completedFutures.length === 0) {
                    futures.push.apply(futures, arguments);
                } else {
                    throw new Error("Cannot add to a task when it has already finished.");
                }
                return self;
            };
            
            self.start = function () {
                if (_started === false) {
                    _started = true;
                    _state = _startedState
                    if (futures.length > 0) {
                        futures.forEach(function (future) {
                            
                            future.onComplete(function () {
                                _notify(future);
                            });
                            
                            future.ifCanceled(_cancel);
                        });
                    } else {
                        fireComplete();
                    }
                }
                return self;
            };
            
            var fireComplete = function () {
                _state = _finishedState;
                
                var whenAll = {
                    type: "whenAll",
                    futures: completedFutures
                }
                observers.notify(whenAll);
                
                var onComplete = {
                    type: "onComplete"
                };
                observers.notify(onComplete);

            };
            
            var _notify = function (future) {
                completedFutures.push(future);
                var whenAny = {
                    type: "whenAny",
                    future: future
                };
                observers.notify(whenAny);
                
                if (_state !== _canceledState && completedFutures.length === futures.length) {
                    fireComplete();
                }
            };
            
            var _cancel = function () {
                if (_state !== _finishedState && _state !== _canceledState) {
                    _state = _canceledState;
                    observers.notify({ type: "canceled" });
                    
                    var onComplete = {
                        type: "onComplete"
                    };
                    observers.notify(onComplete);
                }
            };
            
            
            
            return self;
        };
        
        return Task;
    }());
    
    
    
    
    var Loader = (function () {
        
        var Loader = function () {
            var self = this;
            
            assertNotGlobal(self);
            
            var files = {};
            var paths = {};
            var root = "";
            var loading = {};
            
            self.loadObject = function (namespace) {
                var obj = getObject(namespace);
                
                if (obj) {
                    loading[namespace] = new Future(function (setValue, setError) {
                        setValue(undefined);
                    });
                }
                
                if (!loading[namespace]) {
                    var path = self.getPath(namespace);
                    loading[namespace] = self.loadScript(path);
                }
                
                var onIncomplete = function () {
                    delete loading[namespace];
                };
                
                return loading[namespace].then().ifError(onIncomplete).ifCanceled(onIncomplete);
            };
            
            self.loadScript = function (path) {
                throw new Error("This is an abstract class.");
            };
            
            self.setNamespace = function (namespace, path) {
                while (path.lastIndexOf("/") === path.length - 1) {
                    path = path.substring(0, path.length - 1);
                }
                
                paths[namespace] = path;
            };
            
            self.setObject = function (namespace, path) {
                files[namespace] = path;
            };
            
            self.getRootPath = function () {
                return root ? root + "/" : "";
            };
            
            self.getPath = function (namespace) {
                var path;
                var namespaces = namespace.split(".");
                var currentNamespace;
                var deepestNamespace;
                var deepestPath;
                var remainingNamespace;
                
                // Check if there has been a file set to this object.
                if (files.hasOwnProperty(namespace)) {
                    
                    path = files[namespace];

                } else if (paths.hasOwnProperty(namespace)) {
                    
                    path = paths[namespace] + ".js";

                } else {
                    currentNamespace = "";
                    for (var x = 0; x < namespaces.length ; x++) {
                        currentNamespace = (currentNamespace ? currentNamespace + "." : "") + namespaces[x];
                        if (paths.hasOwnProperty(currentNamespace)) {
                            deepestNamespace = currentNamespace;
                            deepestPath = paths[currentNamespace];
                        }
                    }
                    
                    if (deepestNamespace === namespace) {
                        path = deepestPath + ".js";
                    } else {
                        if (typeof deepestPath === "undefined") {
                            path = concatPaths(self.getRootPath(), namespace.replace(/\./g, "/") + ".js");
                        } else {
                            remainingNamespace = namespace.replace(deepestNamespace, "");
                            path = concatPaths(deepestPath, remainingNamespace.replace(/\./g, "/") + ".js");
                        }
                    }

                }
                
                return path;

            };
            
            self.setRoot = function (value) {
                root = concatPaths(value);
            };
            self.getRoot = function () {
                return root;
            };

        };
        
        return Loader;

    }());
    
    var NodeLoader = (function (Super) {
        
        var NodeLoader = function () {
            var self = this;
            
            assertNotGlobal(self);
            
            Super.call(self);
            
            self.loadScript = function (path) {
                return new Future(function (setValue, setError) {
                    try {
                        require(path);
                        setValue(undefined);
                    } catch (e) {
                        setError(e);
                    }
                });
            };
        };
        
        extend(NodeLoader, Super);
        
        return NodeLoader;

    }(Loader));
    
    var HtmlLoader = (function (Super) {
        
        var HtmlLoader = function () {
            var self = this;
            
            assertNotGlobal(self);
            
            Super.call(self);
            
            self.loadScript = function (path) {
                
                //Take this out as soon as possible.
                //Its just solving users caching problems.
                var now = new Date();
                path += "?v=" + now.getFullYear() + "/" + (now.getMonth() + 1) + "/" + now.getDate();
                
                return new Future(function (setValue, setError) {
                    
                    // All of this is pretty weird because of browser caching etc.
                    var script = document.createElement("script");
                    
                    script.async = true;
                    
                    script.src = path;
                    
                    // Attach handlers for all browsers
                    script.onload = script.onreadystatechange = function () {
                        
                        if (!script.readyState || /loaded|complete/.test(script.readyState)) {
                            
                            // Handle memory leak in IE
                            script.onload = script.onreadystatechange = null;
                            script.onerror = null;
                            
                            // Remove the script
                            if (script.parentNode) {
                                script.parentNode.removeChild(script);
                            }
                            
                            // Dereference the script
                            script = null;
                            
                            // Callback if not abort
                            setValue();
                        }
                    };
                    
                    script.onerror = function () {
                        setError(Error("Failed to load: \"" + path + "\"."));
                    };
                    
                    var head = document.getElementsByTagName('head')[0];
                    
                    if (head.children.length > 0) {
                        head.insertBefore(script, head.firstChild);
                    } else {
                        head.appendChild(script);
                    }

                });
            };
        };
        
        extend(HtmlLoader, Super);
        
        return HtmlLoader;

    }(Loader));
    
    namespace("BASE");
    
    // This is for knowing the order in which scripts were executed.
    var dependenciesLoadedHash = {};
    var dependenciesLoaded = [];
    
    var Sweeper = function () {
        var self = this;
        
        var dependenciesForCallbacks = [];
        self.sweep = function () {
            var dependencies;
            var readyDependency = null;
            var readyDependencyIndex = -1;
            // This is trickery, so be careful. Modifying an array while iterating.
            for (var x = 0; x < dependenciesForCallbacks.length; x++) {
                var dependencies = dependenciesForCallbacks[x];
                
                if (dependencies.isReady()) {
                    // Found a ready dependency, stop the loop and save the index.
                    readyDependencyIndex = x;
                    break;
                }
            }
            
            if (readyDependencyIndex >= 0) {
                readyDependency = dependenciesForCallbacks[readyDependencyIndex];
                dependenciesForCallbacks.splice(readyDependencyIndex, 1);
                readyDependency.execute();
                self.sweep();
            }
        };
        self.addDependencies = function (dependencies) {
            dependenciesForCallbacks.push(dependencies);
        };
        self.getStatus = function () {
            var results = [];
            
            dependenciesForCallbacks.forEach(function (dependency) {
                results.push(dependency.getStatus());
            });
            
            return results;
        };
    };
    
    var Dependencies = function (namespaces, callback) {
        var self = this;
        
        self.isReady = function () {
            return namespaces.every(function (namespace) {
                var result = isObject(namespace);
                // This is for knowing the order in which scripts were executed.
                if (result && !dependenciesLoadedHash[namespace]) {
                    dependenciesLoadedHash[namespace] = true;
                    dependenciesLoaded.push(namespace);
                }
                return result;
            });
        };
        
        self.getStatus = function () {
            
            var result = {
                loaded: [],
                pending: []
            };
            
            namespaces.forEach(function (namespace) {
                if (isObject(namespace)) {
                    result.loaded.push(namespace);
                } else {
                    result.pending.push(namespace);
                }
            });
            
            return result;
        };
        
        self.execute = function () {
            callback();
        };
    };
    
    var sweeper = new Sweeper();
    
    BASE.require = function (namespaces, callback) {
        callback = callback || function () { };
        var loader = BASE.require.loader;
        
        if (Array.isArray(namespaces)) {
            var dependencies = new Dependencies(namespaces, callback);
            sweeper.addDependencies(dependencies);
            
            return new Future(function (setValue, setError) {
                var task = new Task();
                namespaces.forEach(function (namespace) {
                    task.add(loader.loadObject(namespace));
                });
                task.start().whenAll(function (futures) {
                    var hasError = futures.some(function (future) {
                        return future.error !== null;
                    });
                    
                    if (hasError) {
                        setError("Failed to load all dependencies.");
                    } else {
                        sweeper.sweep();
                        setValue(undefined);
                    }
                });
            }).then();

        } else {
            throw new Error("Expected namespaces to be an array.");
        }
    };
    
    BASE.require.sweeper = sweeper;
    
    BASE.require.dependencyList = dependenciesLoaded;
    
    if (global["window"]) {
        BASE.require.loader = new HtmlLoader();
    } else {
        BASE.require.loader = new NodeLoader();
    }
    
    namespace("BASE.async");
    namespace("BASE.util");
    namespace("BASE.behaviors");
    
    BASE.async.Future = Future;
    BASE.async.Task = Task;
    BASE.util.Observable = Observable;
    BASE.util.Observer = Observer;
    
    BASE.extend = extend;
    BASE.hasInterface = hasInterface;
    BASE.Loader = Loader;
    BASE.namespace = namespace;
    BASE.isObject = isObject;
    BASE.getObject = getObject;
    BASE.clone = clone;
    BASE.assertNotGlobal = assertNotGlobal;
    BASE.concatPaths = concatPaths;

}());