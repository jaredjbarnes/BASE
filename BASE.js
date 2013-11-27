
(function () {

    var global = (function () { return this; }());
    if (!global.BASE) {
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

        var namespace = function (namespace) {
            ///<summary>
            ///A method to create deep namespaces.
            ///</summary>
            ///<param name="namespace" type="String">
            ///An string representing the namespace desired to be made. 
            ///e.g. "my.custom.namespace"
            ///</param>
            ///<returns type="Boolean" >
            ///Returns true if the namespace was created.
            ///</returns>
            var obj = namespace;
            var a = obj.split('.');
            var length = a.length;
            var tmpObj;
            var built = false;

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
            return built;
        };

        var isObject = function (namespace) {
            var obj = getObject(namespace);
            return obj ? true : false;
        };

        var getObject = function (namespace, scope) {
            context = typeof context === "undefined" ? global : context;

            if (namespace === "") {
                return context;
            }

            if (typeof namespace === "string") {
                var a = namespace.split('.');
                var length = a.length;
                var tmpObj;

                for (var x = 0; x < length; x++) {
                    if (x === 0) {
                        if (typeof context[a[0]] === 'undefined') {
                            return undefined;
                        } else {
                            tmpObj = context[a[0]];
                        }
                    } else {
                        if (typeof tmpObj[a[x]] === 'undefined') {
                            return undefined;
                        } else {
                            tmpObj = tmpObj[a[x]];
                        }
                    }
                }
                return tmpObj;
            } else {
                return undefined;
            }
        };

        var clone = function (object, deep) {
            ///<summary>
            ///Returns a clone of the specified object.
            ///</summary>
            ///<param name="object" type="Object">
            ///Object desired to be cloned
            ///</param>
            ///<param name="[deep=true]" type="Boolean">
            ///If true, clones nested objects also.
            ///If false, only references nested objects.
            ///</param>
            ///<returns type="Object" >
            ///Returns a clone of the object specified with the first Argument.
            ///</returns>
            var obj = {};
            var proto = object;
            for (var x in proto) {
                if (typeof proto[x] === 'object' && deep && proto[x].nodeType === undefined) {
                    obj[x] = clone(proto[x], deep);
                } else {
                    obj[x] = proto[x];
                }
            }
            return obj;
        };

        var extend = function (d, b) {
            function __() { this.constructor = d; }
            __.prototype = b.prototype;
            d.prototype = new __();
        };

        var Synchronizer = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Synchronizer();
            }

            Object.call(self);

            var _completed = 0;
            var onComplete = function () { };

            var _workers = [];
            var _callbacks = [];

            self.add = function (worker, callback) {
                _workers.push(worker);
                _callbacks.push(callback || function () { });
            };
            self.remove = function (worker) {
                var index = _workers.indexOf(worker);
                _workers.splice(index, 1);
                _callbacks.splice(index, 1);
            };
            self.start = function (callback) {
                onComplete = callback;
                if (_workers.length === 0) {
                    callback();
                    return;
                }
                var copy = _workers.slice();
                copy.forEach(function (func) {
                    func(function () {
                        var index = _workers.indexOf(func);
                        if (index >= 0) {
                            _workers.splice(index, 1);
                        }

                        if (_workers.length === 0) {
                            _callbacks.forEach(function (callback) {
                                callback();
                            });
                            callback();
                        }
                    });
                });
            };

            return self;
        };

        var dependencyList = [];
        var dependencyHash = {};

        var HtmlLoader = function (namespace) {
            var self = scriptManager;
            self.notify();
            if (!loading[namespace] && !isObject(namespace)) {
                loading[namespace] = true;

                var script = document.createElement("script");
                var src = defaultRequire.getPath(namespace);

                script.onload = function () {
                    if (!script.onloadDone) {
                        script.onloadDone = true;
                        if (loading[namespace]) {
                            self.loaded(namespace);
                        }
                    }
                };

                script.onerror = function () {
                    throw new Error("Failed to load: \"" + namespace + "\".");
                };

                script.onreadystatechange = function () {
                    if (("loaded" === script.readyState || "complete" === script.readyState) && !script.onloadDone) {
                        if (loading[namespace]) {
                            self.loaded(namespace);
                        }
                    }
                }

                script.src = src;
                document.getElementsByTagName('head')[0].appendChild(script);
            }
        };

        var NodeLoader = function (namespace) {
            var self = scriptManager;

            if (!isObject(namespace)) {
                var path = defaultRequire.getPath(namespace);
                require(path);
                self.notify();
            }

        };

        var scriptManager = (function () {
            var observers = {};
            var loading = {};

            var scriptManager = {
                load: HtmlLoader,
                loaded: function (namespace) {
                    var self = this;
                    self.notify();
                },
                observe: function (callback, namespace) {
                    var self = scriptManager;

                    var wrapperCallback = function () {
                        self.unobserve(wrapperCallback, namespace);
                        callback();
                    };

                    if (!observers[namespace]) {
                        observers[namespace] = [];
                    }

                    observers[namespace].push(wrapperCallback);
                },
                unobserve: function (callback, namespace) {
                    var self = scriptManager;
                    if (observers[namespace]) {
                        var callbacks = observers[namespace];
                        var index = callbacks.indexOf(callback);
                        if (index >= 0) {
                            callbacks.splice(index, 1);
                        }
                    }
                },
                notify: function () {
                    var self = this;
                    Object.keys(observers).forEach(function (namespace) {
                        var callbacks = observers[namespace] ? observers[namespace].slice() : [];
                        if (isObject(namespace) && callbacks.length > 0) {
                            if (!dependencyHash[namespace]) {
                                dependencyList.push(namespace);
                                dependencyHash[namespace] = true;
                            }
                            callbacks.forEach(function (callback) {
                                callback();
                            });

                            self.notify();

                            observers[namespace] = [];
                        }
                    });
                },
                getPending: function () {
                    var pending = [];
                    Object.keys(loading).forEach(function (namespace) {
                        if (!isObject(namespace)) {
                            pending.push(namespace);
                        }
                    });
                    return pending;
                },
                isPending: function (namespace) {
                    return loading[namespace] && !isObject(namespace) ? true : false;
                },
                getObservers: function () {
                    return observers;
                }
            };
            return scriptManager;
        }());

        var Loader = function (options) {
            options = options || {};
            options.paths = options.paths || {};
            options.files = options.files || {};
            options.root = options.root || "";
            var self = this;

            if (!(self instanceof Loader)) {
                return new Loader(options);
            }

            var root;
            var paths = options.paths;
            var files = options.files;
            var concat = function () {
                var result = arguments[0];
                for (var x = 1 ; x < arguments.length; x++) {
                    result += "/" + arguments[x];
                }
                return result.replace(/\/+/g, '/');
            };

            self.scriptManager = scriptManager;

            self.load = function (dependencies, callback, error) {
                callback = callback || function () { };
                error = error || function () { };

                scriptManager.notify();

                var cleanedDependencies = [];

                dependencies.forEach(function (namespace) {
                    if (!namespace) {
                        return;
                    }
                    cleanedDependencies.push(namespace);
                });

                var synchronizer = new Synchronizer();

                cleanedDependencies.forEach(function (namespace) {
                    synchronizer.add(function (callback) {
                        scriptManager.observe(function () {
                            callback();
                        }, namespace);

                        scriptManager.load(namespace, self.getPath(namespace));
                    });
                });

                // This will ensure that if all dependencies are there it will immediately execute the file.
                if (cleanedDependencies.length === 0) {
                    callback();
                } else {
                    synchronizer.start(function () {
                        callback();
                    });
                }



            }

            self.setFile = function (namespace, path) {
                if (namespace && path) {
                    var finalPath = path;
                    if (finalPath.indexOf("http://") == 0 || finalPath.indexOf("https://") === 0) {
                        finalPath = finalPath.lastIndexOf("/") === finalPath.length - 1 ? finalPath.substr(0, finalPath.length - 1) : finalPath;
                        files[namespace] = finalPath;
                        return;
                    }

                    if (path.indexOf("/") !== 0) {
                        finalPath = concat(root, path);
                    }

                    files[namespace] = finalPath.replace(/\/+/g, '/');

                }
            };

            self.setPath = function (namespace, path) {
                if (namespace && path) {
                    var finalPath = path;

                    if (path.indexOf("../") >= 0) {
                        paths[namespace] = finalPath.replace(/\/+/g, '/');
                        return;
                    }

                    if (finalPath.indexOf("http://") == 0 || finalPath.indexOf("https://") === 0) {
                        finalPath = finalPath.lastIndexOf("/") === finalPath.length - 1 ? finalPath.substr(0, finalPath.length - 1) : finalPath;
                        paths[namespace] = finalPath;
                        return;
                    }

                    if (path.indexOf("/") !== 0) {
                        finalPath = concat(root, path);
                    }

                    paths[namespace] = finalPath.replace(/\/+/g, '/');

                }
            };

            self.getPath = function (namespace) {
                //Checks to see if there is a file for this namespace.
                if (files[namespace]) {
                    return files[namespace];
                }

                var prefix = self.getPrefix(namespace);
                var path;

                if (prefix) {
                    path = paths[prefix];
                    namespace = namespace.replace(prefix, "");
                } else {
                    path = root;
                }

                if (path.indexOf("http://") == 0 || path.indexOf("https://") === 0) {
                    return path + concat("/" + namespace.replace(/\./g, "/") + ".js");
                }
                return concat(path, namespace.replace(/\./g, "/") + ".js");
            };

            self.getPrefix = function (namespace) {
                var prefix;
                var deepestPrefix = '';

                if (paths.hasOwnProperty(namespace)) {
                    return namespace;
                }

                for (prefix in paths) {
                    if (paths.hasOwnProperty(prefix) && prefix + '.' === namespace.substring(0, prefix.length + 1)) {
                        if (prefix.length > deepestPrefix.length) {
                            deepestPrefix = prefix;
                        }
                    }
                }

                return deepestPrefix === "" ? null : deepestPrefix;
            };

            self.getRoot = function (newRoot) {
                return root;
            };

            self.setRoot = function (newRoot) {
                var index = newRoot.lastIndexOf("/");
                if (index === newRoot.length - 1) {
                    newRoot = newRoot.substr(0, newRoot.length - 1);
                }

                root = newRoot;
            };

            self.setEnvironmentToNode = function () {
                    scriptManager.load = NodeLoader;
            };

            self.setEnvironmentToBrowser = function () {
                scriptManager.load = HtmlLoader;
            };

            self.setRoot(options.root);

            return self;
        };


        var defaultRequire = (function () {
            var loader = new Loader();
            var defaultRequire = function (dependencies, callback) {
                ///<summary>
                ///An on demand script loader. e.g. (["jQuery","Object.prototype.enableObserving"], function(){ //invoked after dependencies are loaded.})
                ///</summary>
                ///<param name="dependencies" type="Array">
                ///An Array of dependencies needed to be loaded before callback is invoked.
                ///e.g ["jQuery","Object.prototype.enableObserving"]
                ///</param>
                ///<param name="callback" type="Function">
                ///This will only be invoked if all dependencies are loaded.
                ///</param>
                ///<returns type="undefined" />

                loader.load(dependencies, callback);
            };

            defaultRequire.setFile = loader.setFile;
            defaultRequire.setPath = loader.setPath;
            defaultRequire.getPath = loader.getPath;
            defaultRequire.getPrefix = loader.getPrefix;
            defaultRequire.scriptManager = loader.scriptManager;
            defaultRequire.setRoot = loader.setRoot;
            defaultRequire.getRoot = loader.getRoot;
            defaultRequire.dependencyList = dependencyList;
            return defaultRequire;

        }());

        global.BASE = {};

        if (!Object.defineProperty || !Object.defineProperties) {
            //So IE 6-8 works. 
            global.BASE.require = defaultRequire;
            global.BASE.namespace = namespace;
            global.BASE.clone = clone;
            global.BASE.getObject = getObject;
            global.BASE.isObject = isObject;
            global.BASE.extend = extend;
            global.BASE.Loader = Loader;

        } else {
            //This really sets it as it should be.
            Object.defineProperties(global.BASE, {
                "require": {
                    value: defaultRequire,
                    enumerable: false,
                    writable: false
                },
                "namespace": {
                    value: namespace,
                    enumerable: false,
                    writable: false
                },
                "clone": {
                    value: clone,
                    enumerable: false,
                    writable: false
                },
                "getObject": {
                    value: getObject,
                    enumerable: false,
                    writable: false
                },
                "isObject": {
                    value: isObject,
                    enumerable: false,
                    writable: false
                },
                "extend": {
                    value: extend,
                    enumerable: false,
                    writable: false
                },
                "Loader": {
                    value: Loader,
                    enumerable: false,
                    writable: false
                }
            });
        }
    }
})();
