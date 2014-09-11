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

    var head = document.getElementsByTagName('head')[0];

    var loadLocalJsonFile = function (url, settings) {
        settings = settings || {};
        settings.headers = settings.headers || {};
        var callback = settings.onSuccess;

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function (event) {
            if (xhr.readyState == 4) {
                if (xhr.status < 300 && xhr.status >= 200) {
                    try {
                        var data = JSON.parse(xhr.responseText);
                    } catch (e) {
                        throw new Error("Parse Error.");
                    }

                    callback(data);
                } else {
                    throw new Error(xhr.status);
                }
            }
        }
        try {
            xhr.open("GET", url, true);
            Object.keys(settings.headers).forEach(function (key) {
                xhr.setRequestHeader(key, settings.headers[key]);
            });

            xhr.send();
        } catch (e) {
            throw new Error("Url: \"" + url + "\" couldn't be retrieved because CORS isn't enabled, or you are working in ie 8 and below.");
        }
    };

    var parseValues = function (valueString) {
        var obj = {};
        var values = valueString.split("=");
        obj[values[0]] = values[1];

        return obj;
    };

    var makeArray = function (arrayLike) {
        return Array.prototype.slice.call(arrayLike, 0);
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

    var loadScript = function (url, callback) {
        // All of this is pretty weird because of browser caching etc.
        var script = document.createElement("script");
        script.async = true;
        script.src = url;

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
                callback();
            }
        };

        script.onerror = function () {
            throw new Error("Failed to load: \"" + url + "\".");
        };

        if (head.children.length > 0) {
            head.insertBefore(script, head.firstChild);
        } else {
            head.appendChild(script);
        }
    };

    var prependCss = function (url, callback) {
        var link = document.createElement('link');
        link.type = 'text/css';
        link.rel = 'stylesheet';
        link.href = url;

        link.onerror = function () {
            throw new Error("Couldn't find css at url: " + url);
        };
        link.onload = callback;

        if (head.children.length > 0) {
            head.insertBefore(link, head.firstChild);
        } else {
            head.appendChild(link);
        }
    };

    var load = function (config) {
        var root = config.root || "";
        var rootComponents = concatPaths(root, "/components");
        var rootJs = concatPaths(root, "/js");
        var rootCss = concatPaths(root, "/css");
        var baseUrl = concatPaths(root, "/js/BASE.js");

        prependCss(concatPaths(rootCss, "bootstrap.css"));
        prependCss(concatPaths(rootCss, "reset-min.css"));

        var script = document.createElement("script");
        script.type = "components/config";
        script.src = concatPaths(rootComponents, "components.json");
        head.appendChild(script);

        loadScript(baseUrl, function () {
            var base = config.base;
            var components = config.components;

            if (base) {
                if (base.namespaces) {
                    Object.keys(base.namespaces).forEach(function (key) {
                        BASE.require.loader.setNamespace(key, base.namespaces[key]);
                    });
                }

                if (base.objects) {
                    Object.keys(base.objects).forEach(function (key) {
                        BASE.require.loader.setObject(key, base.objects[key]);
                    });
                }

                if (typeof base.root === "string") {
                    BASE.require.loader.setRoot(base.root);
                }
            }

            if (components) {

                if (Array.isArray(components.configs)) {
                    components.configs.forEach(function (config) {
                        var script = document.createElement("script");
                        script.type = "components/config";
                        script.src = config;
                        head.appendChild(script);
                    });
                }

                if (components.aliases) {
                    var script = document.createElement("script");
                    script.type = "components/config";
                    script.innerText(JSON.stringify({ aliases: components.aliases }));
                    head.appendChild(script);
                }

            }

            BASE.require.loader.setRoot(rootJs);
            BASE.require.loader.setNamespace("components", rootComponents);
            BASE.require(["BASE.web.components", "BASE.web.smoothScrollingHelper", "FastClick", "jQuery"], function () {
                $(function () {
                    FastClick.attach(document.body);
                });
            });
        });
    };

    var handlers = {
        "platform-config": function (value, metaTag) {
            loadLocalJsonFile(value, {
                onSuccess: function (data) {

                    load(data);

                }
            });
        }
    };

    var allMetaTags = document.getElementsByTagName("meta");

    makeArray(allMetaTags).forEach(function (metaTag) {

        Object.keys(handlers).forEach(function (handlerName) {
            if (metaTag.getAttribute("name") === handlerName) {
                handlers[handlerName](metaTag.getAttribute("content"), metaTag);
            }
        });

    });




}());

/*

{
    root: "/libcdn/v1.1",
    components: {
        configs: ["components.json"],
        aliases: {
            "":""
        }
    },
    base: {
        namespaces: {
            "myApp.components":"/myApp/components/"
        },
        objects: {
            "jQuery":"/Found/Somewhere/Otherthan/normal/"
        },
        root: "/libcdn/v1.1"
    }
}

*/