(function () {

    var global = (function () { return this; }());

    var emptyFn = function () { };

    var hasInterface = function (methodNames, obj) {
        return methodNames.every(function (name) {
            return obj.hasOwnProperty(name) && typeof obj[name] === "function";
        });
    };

    var namespace = function (namespace, setTo) {
        var obj = namespace;
        var a = obj.split('.');
        var length = a.length;
        var tmpObj;
        var built = false;

        setTo || {}

        for (var x = 0; x < length; x++) {
            if (x === 0) {
                if (typeof global[a[0]] === 'undefined') {
                    tmpObj = global[a[0]] = {};
                    built = true;
                } else {
                    tmpObj = global[a[0]];
                }
            } else {
                if (typeof tmpObj[a[x]] === 'undefined') {
                    tmpObj = tmpObj[a[x]] = {};
                    built = true;
                } else {
                    tmpObj = tmpObj[a[x]];
                }
            }
        }

        tmpObj = setTo;

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
        function __() { this.constructor = SubClass; }
        __.prototype = SuperClass.prototype;
        SubClass.prototype = new __();
    };

    var assertInstance = function (instance) {
        if (instance === global) {
            throw new Error("Constructor run in the context of the global object.");
        }
    };

    var Observable = (function () {
        function Observable() {
            var self = this;

            assertInstance(self);

            Object.defineProperties(self, {
                _globalObservers: {
                    enumerable: false,
                    value: []
                },
                _typeObservers: {
                    enumerable: false,
                    value: {}
                }
            });
            return this;
        }

        Observable.prototype.observe = function (type, callback) {
            if (typeof type === "undefined" || typeof callback !== "function") {
                throw new Error("Invalid arguments.");
            }

            if (!this._typeObservers[type]) {
                this._typeObservers[type] = [];
            }
            this._typeObservers[type].push(callback);
            return this;
        };

        Observable.prototype.observeAll = function (callback) {
            if (typeof callback !== "function") {
                throw new Error("Invalid arguments.");
            }

            this._globalObservers.push(callback);
        };

        Observable.prototype.unobserve = function (type, callback) {
            if (!this._typeObservers[type]) {
                this._typeObservers[type] = [];
            }
            var observers = this._typeObservers[type];
            var index = observers.indexOf(callback);
            if (index >= 0) {
                observers.splice(index, 1);
            }

            return this;
        };

        Observable.prototype.unobserveAll = function (callback) {
            var index = this._globalObservers.indexOf(callback);
            if (index >= 0) {
                this._globalObservers.splice(index, 1);
            }
            return this;
        };

        Observable.prototype.notify = function (event) {
            var self = this;

            if (typeof event === "string") {
                event = { type: event };
            }

            var globalObservers = this._globalObservers.slice(0);
            var typeObservers = [];

            if (this._typeObservers[event.type]) {
                typeObservers = this._typeObservers[event.type].slice(0);
            }

            globalObservers.forEach(function (observer) {
                observer.call(self, event);
            });
            typeObservers.forEach(function (observer) {
                observer.call(self, event);
            });

            return this;
        };
        return Observable;
    }());

    var Future = (function () {
        var Future = function (getValue) {
            var self = this;

            assertInstance(self);

            var observers = new Observable();

            self.value = null;
            self.error = null;
            self.isComplete = false;

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
                cancel: function () {
                    self.isComplete = true;
                    _state = canceledState;
                    observers.notify({ type: "ifCanceled" });
                    observers.notify({ type: "onComplete" });
                }
            };

            var retrievingState = {
                get: emptyFn,
                then: defaultState.then,
                onComplete: defaultState.onComplete,
                ifError: defaultState.ifError,
                ifCanceled: defaultState.ifCanceled,
                cancel: defaultState.cancel
            };

            var errorState = {
                get: emptyFn,
                then: emptyFn,
                onComplete: function (callback) {
                    callback();
                },
                ifError: function (callback) {
                    callback(self.error);
                },
                ifCanceled: emptyFn,
                cancel: emptyFn
            };

            var canceledState = {
                get: emptyFn,
                then: emptyFn,
                onComplete: function (callback) {
                    callback();
                },
                ifError: emptyFn,
                ifCanceled: function (callback) {
                    callback();
                },
                cancel: emptyFn
            };

            var completeState = {
                get: emptyFn,
                then: function (callback) {
                    callback(self.value);
                },
                onComplete: function (callback) {
                    callback();
                },
                ifError: emptyFn,
                ifCanceled: emptyFn,
                cancel: emptyFn
            };

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

            assertInstance(self);

            var observers = new Observable;

            var futures = Array.prototype.slice.call(arguments, 0);
            var completedFutures = [];
            var _started = false;

            futures.forEach(function (future, index) {
                if (typeof future === "function") {
                    futures[index] = new Future(future);
                }
            });

            Object.defineProperties(self, {
                "value": {
                    get: function () {
                        if (!_started) {
                            self.start();
                            return undefined;
                        } else {
                            return futures;
                        }

                    }
                }
            });

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
                            var value = future.value;
                            var error = future.error;

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

            assertInstance(self);

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

            Object.defineProperties(self, {
                "root": {
                    get: function () {
                        return root;
                    },
                    set: function (value) {
                        root = value;
                        while (root.lastIndexOf("/") === root.length - 1) {
                            root = root.substring(0, root.length - 1);
                        }
                    }
                }
            });

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

            assertInstance(self);

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

                    script.onreadystatechange = function () {
                        if (("loaded" === script.readyState || "complete" === script.readyState) && !script.onloadCalled) {
                            script.onloadCalled = true;
                            setValue(undefined);
                        }
                    }

                    script.src = src;
                    document.getElementsByTagName('head')[0].appendChild(script);
                });
            };
        };

        extend(HtmlLoader, Super);

        return HtmlLoader;

    }(Loader));

    BASE = {};

    var Sweeper = function () {
        var self = this;

        var dependenciesForCallbacks = [];
        self.sweep = function () {
            var dependencies;
            // This is trickery, so be careful. Modifying an array while iterating.
            for (var x = 0 ; x < dependenciesForCallbacks.length; x++) {
                var dependencies = dependenciesForCallbacks[x];

                if (dependencies.executeIfReady()) {
                    dependenciesForCallbacks.splice(x, 1);
                    x = 0;
                }
            }
        };
        self.addDependencies = function (dependencies) {
            dependenciesForCallbacks.push(dependencies);
        };
    };

    var Dependencies = function (namespaces, callback) {
        var self = this;

        var isReady = function () {
            return namespaces.slice(0).every(function (namespace) {
                return isObject(namespace);
            });
        };

        self.executeIfReady = function () {
            var calledCallback = false;

            if (isReady()) {
                callback();
                calledCallback = true;
            }

            return calledCallback;
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

    if (global["window"]) {
        BASE.require.loader = new HtmlLoader();
    } else {
        BASE.require.loader = new NodeLoader();
    }

    Object.defineProperties(BASE, {
        "extend": {
            get: function () {
                return extend;
            }
        },
        "hasInterface": {
            get: function () {
                return hasInterface;
            }
        },
        "Loader": {
            get: function () {
                return Loader;
            }
        },
        "Observable": {
            get: function () {
                return Observable;
            }
        },
        "Future": {
            get: function () {
                return Future;
            }
        },
        "Task": {
            get: function () {
                return Task;
            }
        },
        "namespace": {
            get: function () {
                return namespace;
            }
        },
        "isObject": {
            get: function () {
                return isObject;
            }
        },
        "getObject": {
            get: function () {
                return getObject;
            }
        },
        "clone": {
            get: function () {
                return clone;
            }
        }

    });

}());
