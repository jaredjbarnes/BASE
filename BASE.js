//Scopes variables
(function () {
    
    var extend = function(NewClass, prototype){
        var OldClass = this;
        
        NewClass.prototype = new OldClass();
        Object.defineProperties(NewClass.prototype, {
            "superConstructor":{
                get: function(){return OldClass;},
                enumerable: false,
                configurable: false
            }
        });
        
        for (var x in prototype){
            NewClass.prototype[x] = prototype[x];
        }
        
        return NewClass;
        
    };
    
    //Checks to see if an object exists at the specified namespace.
    var namespace = function (obj) {
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

    //Checks to see if the 
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

    var clone = function(proto, deep){
      var obj = {};
      
      for (var x  in proto){
        if (typeof proto[x] === 'object' && deep && proto[x].nodeType === undefined){
          obj[x] = clone(proto[x], deep);
        } else {
          obj[x] = proto[x];
        }
      }
      return obj;
    };

    var clonePrototype = function(deep){
        return clone(this, deep);
    };

    (function(){
        var dEval = function (src, callback, onerror) {
            var script = document.createElement("script");
           
            script.onload = function () {
                if (!script.onloadDone) {
                    script.onloadDone = true;
                    callback();
                }
            };
            
            script.onerror = function(){
                onerror();    
            };
            
            script.onreadystatechange = function () {
                if (("loaded" === script.readyState || "complete" === script.readyState) && !script.onloadDone) {
                    callback();
                }
            }
    
    
            script.src = src;
            document.getElementsByTagName('head')[0].appendChild(script);
        };
    
    
        var sent = 1;
        var received = 1;
        var callbacks = [];
        
        var require = function (namespaceArray, callback) {
            callback = callback || function () { };
            namespaceArray = Object.prototype.toString.call(namespaceArray) === '[object Array]' ? namespaceArray : [namespaceArray];
            callback.dependencies = namespaceArray.slice(0);
    
            for (var x = 0; x < namespaceArray.length; x++) {
                if (isObject(namespaceArray[x]) || require.pending[namespaceArray[x]]) {
                    namespaceArray.splice(x, 1);
                    x--;
                } else {
                    require.pending[namespaceArray[x]] = namespaceArray[x];
                }
            }
    
            callbacks.push(callback);
    
            if (namespaceArray.length > 0) {
                var onSuccess = function (response, opts) {
                    received++;
                    require.sweep();
                };
    
                for (var u = 0; u < namespaceArray.length; u++) {
                    sent++;
                    url = require.getPath(namespaceArray[u]);
                    dEval(url, onSuccess, (function(n){ return function(){console.log('Error loading resource: '+n);};})(namespaceArray[u]));
                }
    
            } else {
                sent++;
                setTimeout(function () {
                    received++;
                    require.sweep();
                }, 0);
            }
    
        };
        
        var paths = {};
        require.setPath = function(namespace, path){
                if (namespace && path) paths[namespace] = path;
        };
        require.getPath = function(namespace){
            var path = '';
            var prefix = require.getPrefix(namespace);
            var dir = require.root;
            
            if (prefix.length > 0) {
                if (prefix === namespace) {
                    return paths[prefix];
                }
                path = paths[prefix];
                namespace = namespace.substring(prefix.length + 1);
            }
            if (path.length > 0) {
                path += '/';
            }
            path = path.replace(/\/\.\//g, '/') + namespace.replace(/\./g, "/") + '.js';
            if (dir) {
                path = path.indexOf("/") === 0 ? path.substr(1) : path ;
                dir = dir.lastIndexOf("/") === dir.length -1 ? dir.substr(0, dir.length-1) : dir ;
            }
            return typeof dir === 'string' ? dir + '/' +path : path ;
        };
        
        require.getPrefix = function(namespace) {
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

            return deepestPrefix;
        };
        
        require.root = null;
        require.pending = {};
        require.enableDebugging = false;
        require.sweep = function () {
            var dependencies;
            for (var x = 0; x < callbacks.length; x++) {
                dependencies = callbacks[x].dependencies;
    
                for (var d = 0; d < dependencies.length; d++) {
                    if (isObject(dependencies[d])) {
                        dependencies.splice(d, 1);
                        d--;
                    }
                }
    
                if (dependencies.length === 0) {
                    callbacks[x]();
                    callbacks.splice(x, 1);
                    x--;
                }
            }
    
            if (sent === received && callbacks.length > 0) {
                callbacks.pop()();
                require.sweep();
            }
        };
    
        require.getUnloaded = function () {
            var ret = [];
            for (var x = 0; x < callbacks.length; x++) {
                ret.concat(callbacks[x]);
            }
            return ret;
        };

        Object.defineProperties(Object, {
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
            "clone":{
                value: clone,
                enumerable: false,
                writable: false
            }
        });
        
        Object.defineProperties(Object.prototype, {
            "clone":{
                value: clonePrototype,
                enumerable: false,
                writable: false
            },
            "extend": {
                value: extend,
                enumerable: false,
                writable: false
            }
        });
        
    })();
    
})();