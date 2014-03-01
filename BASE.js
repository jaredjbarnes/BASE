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
        Array.isArray = function(value) {
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
            throw new Error("Constructor executed in the scope of a constructor.");
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
        return obj ? true : false;
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

    var Observer = function (callback, unbind) {
        var self = this;
        var state;

        var defaultState = {
            stop: function () {
                state = stoppedState;
            },
            start: emptyFn,
            notify: function (e) {
                callback(e);
            },
            dispose: function () {
                unbind();
                state = disposedState;
            }
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

        self.notify = function(e) {
            state.notify(e);
        };

        self.stop = function () {
            state.stop();
        };

        self.start = function () {
            state.start();
        };

        self.dispose = function() {
            state.dispose();
        };
    };

    var Observable = function () {
        var self = this;

        var observers = {};
        var globalObservers = [];

        var getObservers = function (type) {
            var typeObservers = observers[type];
            if (!typeObservers) {
                typeObservers = observers[type] = [];
            }

            return typeObservers;
        };

        var makeObserver = function (observers, callback) {
            var observer = new Observer(callback, function () {
                var index = observers.indexOf(observer);
                observers.splice(index, 1);
            });
            observers.push(observer);
            return observer;
        };

        self.observe = function (type, callback) {
            var observers = getObservers(type);
            return makeObserver(observers, callback);
        };

        self.observeAll = function (callback) {
            var observers = globalObservers;
            return makeObserver(observers, callback);
        };

        self.notify = function (e) {
            var typeObservers = getObservers(e.type);
            typeObservers.forEach(function (observer) {
                observer.notify(e);
            });
            globalObservers.forEach(function (observer) {
                observer.notify(e);
            });
        };

        self.getGlobalObservers = function() {
            return globalObservers;
        };

        self.getObservers = getObservers;
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
                    observers.observe("then", listener);
                },
                onComplete: function (callback) {
                    var listener = function (e) {
                        callback();
                    };
                    observers.observe("onComplete", listener);
                },
                ifError: function (callback) {
                    var listener = function (e) {
                        callback(e.error);
                    };
                    observers.observe("ifError", listener);
                },
                ifCanceled: function (callback) {
                    var listener = function (e) {
                        callback();
                    };
                    observers.observe("ifCanceled", listener);
                },
                ifTimedOut: function (callback) {
                    var listener = function (e) {
                        callback();
                    };
                    observers.observe("ifTimedOut", listener);
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
                    observers.observe("whenAll", listener);
                },
                whenAny: function (callback) {
                    observers.observe("whenAny", function (event) {
                        callback(event.future);
                    });
                    completedFutures.forEach(function (future) {
                        callback(future);
                    });
                },
                onComplete: function (callback) {
                    var listener = function () {
                        callback();
                    };
                    observers.observe("onComplete", listener);
                },
                ifCanceled: function (callback) {
                    var listener = function (event) {
                        callback();
                    };
                    observers.observe("canceled", listener);
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

            self.add = function () {
                if (completedFutures.length === 0) {
                    futures.push.apply(futures, arguments);
                } else {
                    throw new Error("Cannot add to a task when it has already finished.");
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
                            path = self.getRootPath() + namespace.replace(/\./g, "/") + ".js";
                        } else {
                            remainingNamespace = namespace.replace(deepestNamespace, "");
                            path = deepestPath + remainingNamespace.replace(/\./g, "/") + ".js";
                        }
                    }

                }

                return path;

            };

            self.setRoot = function (value) {
                root = value;
                while (root.lastIndexOf("/") === root.length - 1) {
                    root = root.substring(0, root.length - 1);
                }
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

            assertInstance(self);

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
                return new Future(function (setValue, setError) {
                    // All of this is pretty weird because of browser caching etc.
                    var script = document.createElement("script");
                    var src = path;

                    script.onload = function () {
                        if (!script.onloadCalled) {
                            script.onloadCalled = true;
                            setValue(undefined);
                        }
                    };

                    script.onerror = function () {
                        setError(Error("Failed to load: \"" + path + "\"."));
                    };

                    script.onreadystatechange = function() {
                        if (("loaded" === script.readyState || "complete" === script.readyState) && !script.onloadCalled) {
                            script.onloadCalled = true;
                            setValue(undefined);
                        }
                    };

                    script.src = src;
                    document.getElementsByTagName('head')[0].appendChild(script);
                });
            };
        };

        extend(HtmlLoader, Super);

        return HtmlLoader;

    }(Loader));

    namespace("BASE");

    var Sweeper = function () {
        var self = this;

        var dependenciesForCallbacks = [];
        self.sweep = function () {
            var dependencies;
            var readyDependency = null;
            var readyDependencyIndex = -1;
            // This is trickery, so be careful. Modifying an array while iterating.
            for (var x = 0 ; x < dependenciesForCallbacks.length; x++) {
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
                return isObject(namespace);
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

    if (global["window"]) {
        BASE.require.loader = new HtmlLoader();
    } else {
        BASE.require.loader = new NodeLoader();
    }

    namespace("BASE.async");
    namespace("BASE.util");

    BASE.async.Future = Future;
    BASE.async.Task = Task;
    BASE.util.Observable = Observable;

    BASE.extend = extend;
    BASE.hasInterface = hasInterface;
    BASE.Loader = Loader;
    BASE.namespace = namespace;
    BASE.isObject = isObject;
    BASE.getObject = getObject;
    BASE.clone = clone;
    BASE.assertNotGlobal = assertNotGlobal;

}());