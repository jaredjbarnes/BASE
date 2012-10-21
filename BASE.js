//Scopes variables
(function () {

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
                if (typeof window[a[0]] === 'undefined') {
                    tmpObj = window[a[0]] = {};
                    built = true;
                } else {
                    tmpObj = window[a[0]];
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
        var a = namespace.split('.');
        var length = a.length;
        var tmpObj;

        for (var x = 0; x < length; x++) {
            if (x === 0) {
                if (typeof window[a[0]] === 'undefined') {
                    return false
                } else {
                    tmpObj = window[a[0]];
                }
            } else {
                if (typeof tmpObj[a[x]] === 'undefined') {
                    return false;
                } else {
                    tmpObj = tmpObj[a[x]];
                }
            }
        }
        return true;
    };

    var getObject = function (namespace) {
        var a = namespace.split('.');
        var length = a.length;
        var tmpObj;

        for (var x = 0; x < length; x++) {
            if (x === 0) {
                if (typeof window[a[0]] === 'undefined') {
                    return undefined;
                } else {
                    tmpObj = window[a[0]];
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

    var clonePrototype = function (deep) {
        ///<summary>
        ///Returns a clone of the object.
        ///</summary>
        ///<param name="[deep=true]" type="Boolean">
        ///If true, clones nested objects also.
        ///If false, only references nested objects.
        ///</param>
        ///<returns type="Object" >
        ///Returns a clone of the object.
        ///</returns>
        return clone(this, deep);
    };

    var defineClass = function (SuperClass, Constructor, prototypeProperties, classProperties) {
        ///<summary>
        /// Creates Classes through prototypal inheritance.
        ///</summary>
        ///<param type="Function" name="SuperClass">Super Class Constructor</param>
        ///<param type="Function" name="Constructor">Constructor</param>
        ///<param type="Object" name="prototypeProperties" optional="true">Prototype Properties (Usually just methods, because of prototypal oddities)</param>
        ///<param type="Object" name="classProperties" optional="true">Class Properties</param>
        ///<returns type="Function">Class Constructor</returns>

        var Klass = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                throw new Error("Forgot the \"new\" operator while trying to instantiate the object.");
            }

            if (self.constructor === Klass) {
                self.base = function () {
                    SuperClass.apply(self, arguments);

                    // This allows a self.base.method();
                    for (var x in Klass.prototype) (function (x) {
                        if (Klass.prototype.hasOwnProperty(x) && typeof Klass.prototype[x] === "function") {
                            var fn = self[x];
                            self.base[x] = function () {
                               return fn.apply(self, arguments);
                            };
                        }
                    })(x);
                };

                
            }
            Constructor.apply(self, arguments);
        };

        prototypeProperties = prototypeProperties || {};
        classProperties = classProperties || {};

        Klass.prototype = new SuperClass();

        for (var pp in prototypeProperties) {
            if (prototypeProperties.hasOwnProperty(pp)) {
                Klass.prototype[pp] = prototypeProperties[pp];
            }
        }

        for (var sp in SuperClass) {
            if (prototypeProperties.hasOwnProperty(sp)) {
                Klass[sp] = SuperClass[sp];
            }
        }

        for (var cp in classProperties) {
            if (classProperties.hasOwnProperty(cp)) {
                Klass[cp] = classProperties[cp];
            }
        }

        Klass.prototype.constructor = Klass;

        return Klass;
    };

    (function () {
        var dEval = function (n, src, callback, onerror) {
            var script = document.createElement("script");

            script.onload = function () {
                if (!script.onloadDone) {
                    script.onloadDone = true;
                    if (require.pending[n]) {
                        callback(n);
                    }
                }
            };

            script.onerror = function () {
                onerror();
            };

            script.onreadystatechange = function () {
                if (("loaded" === script.readyState || "complete" === script.readyState) && !script.onloadDone) {
                    if (require.pending[n]) {
                        callback(n);
                    }
                }
            }


            script.src = src;
            document.getElementsByTagName('head')[0].appendChild(script);
        };


        var sent = 1;
        var received = 1;
        var callbacks = [];

        var require = function (dependencies, callback) {
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

            //Makes sure that all sweeping is done before making another request.
            require.sweep();
            var namespaceArray = dependencies;
            callback = callback || function () { };

            namespaceArray = Object.prototype.toString.call(namespaceArray) === '[object Array]' ? namespaceArray : [namespaceArray];
            callback.dependencies = namespaceArray.slice(0);
            require.dependencyList = require.dependencyList.concat(namespaceArray);

            for (var x = 0; x < namespaceArray.length; x++) {
                if (isObject(namespaceArray[x]) || require.pending[namespaceArray[x]]) {
                    namespaceArray.splice(x, 1);
                    x--;
                } else {
                    require.pending[namespaceArray[x]] = namespaceArray[x];
                }
            }

            //Start: This is for vb studio intellisense.
            //This will cause errors if code is executed with this.
            //console.Error("Still in vb studio intellisense mode. Remove the code below this line, if executing code.");
            //callback();
            //End: This is for vb studio intellisense.

            callbacks.push(callback);

            if (namespaceArray.length > 0) {
                var onSuccess = function (n) {
                    received++;
                    delete require.pending[n];
                    require.sweep();
                };

                for (var u = 0; u < namespaceArray.length; u++) {
                    sent++;
                    url = require.getPath(namespaceArray[u]);
                    dEval(namespaceArray[u], url, onSuccess, (function (n) {
                        return function () {
                            throw new Error('Error loading resource: ' + n);
                            delete require.pending[n];
                        };
                    })(namespaceArray[u]));
                }

            } else {
                sent++;
                setTimeout(function () {
                    received++;
                    require.sweep();
                }, 0);
            }

            if (location.href) {
                return;
            }

            //This is for vs-doc to work.
            callback();

        };

        var paths = {};
        var concat = function () {
            var result = "";
            for (var x = 0 ; x < arguments.length; x++) {
                result += "/" + arguments[x];
            }
            return result.replace(/\/+/g, '/');
        };

        require.dependencyList = [];

        require.setPath = function (namespace, path) {
            if (namespace && path) {
                var finalPath = path;
                if (path.indexOf("/") !== 0) {
                    finalPath = concat(require.root, path);
                }
                paths[namespace] = finalPath.replace(/\/+/g, '/');
            }
        };
        require.getPath = function (namespace) {
            var path = require.getPrefix(namespace);
            if (/\.js$/.test(path)) {
                return path;
            }
            if (path.indexOf("http://") == 0 || path.indexOf("https://") === 0) {
                return path + concat("/" + namespace.replace(/\./g, "/") + ".js");
            }
            return concat(path, namespace.replace(/\./g, "/") + ".js");
        };

        require.getPrefix = function (namespace) {
            var prefix;
            var deepestPrefix = '';

            if (paths.hasOwnProperty(namespace)) {
                return paths[namespace];
            }

            for (prefix in paths) {
                if (paths.hasOwnProperty(prefix) && prefix + '.' === namespace.substring(0, prefix.length + 1)) {
                    if (prefix.length > deepestPrefix.length) {
                        deepestPrefix = prefix;
                    }
                }
            }

            return deepestPrefix === "" ? require.root : deepestPrefix.replace(/\./g, "/");
        };

        require.root = "";
        require.pending = {};
        require.enableDebugging = false;
        require.sweep = function (tries) {
            tries = tries || 0;
            var dependencies;
            var c;
            for (var x = 0; x < callbacks.length; x++) {
                dependencies = callbacks[x].dependencies;

                for (var d = 0; d < dependencies.length; d++) {
                    if (isObject(dependencies[d])) {
                        dependencies.splice(d, 1);
                        d--;
                    }
                }

                if (dependencies.length === 0) {
                    c = callbacks.splice(x, 1);
                    x--;
                    c[0]();
                }
            }
            if (sent === received && callbacks.length > 0) {
                //callbacks.pop()();
                tries += 1;
                //console.log(tries);

                if (tries > 1000) {
                    throw new Error("Failed to load these dependencies: " + require.getUnloaded());
                    pending = {};
                }
                setTimeout(function () { require.sweep(tries); }, 1);
            }
        };

        require.getUnloaded = function () {
            var ret = [];
            for (var x = 0; x < callbacks.length; x++) {
                ret.concat(callbacks[x]);
            }
            return ret;
        };

        var BASE;

        if (!Object.defineProperty || !Object.defineProperties) {
            //So IE 7-8 works. 
            BASE = window.BASE = {};
            BASE.require = require;
            BASE.namespace = namespace;
            BASE.clone = clone;
            BASE.getObject = getObject;
            BASE.defineClass = defineClass;

        } else {
            BASE = window.BASE = function () { };
            //This really sets it as it should be.
            Object.defineProperties(BASE, {
                "require": {
                    value: require,
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
                "defineClass": {
                    value: defineClass,
                    enumerable: false,
                    writable: false
                }
            });


            Object.defineProperties(BASE.prototype, {
                "clone": {
                    value: clonePrototype,
                    enumerable: false,
                    writable: false
                }
            });
        }
    })();


})();