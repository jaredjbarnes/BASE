BASE.require([
    "BASE.web.queryString"
], function () {
    
    BASE.namespace("BASE.web");
    
    BASE.web.Url = function (url) {
        var self = this;
        
        BASE.assertNotGlobal(self);
        
        //Thanks Douglas Crockford.
        var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
        url = url || "";
        var result = parse_url.exec(url);
        
        if (result === null) {
            result = [];
        }
        
        var parseQuery = BASE.web.queryString.parse;
        var stringify = BASE.web.queryString.toString;
        
        var scheme = result[1];
        var slash = result[2];
        var host = result[3];
        var port = result[4];
        var path = result[5];
        var query = result[6];
        var hash = result[7];
        var queryStringValues = parseQuery(result[6]);
        
        
        if (typeof port === "undefined") {
            port = (scheme === 'https') ? 443 : 80;
        } else {
            port = parseInt(port, 10);
        }
        
        
        self.getHref = function () {
            var schemeString = scheme || "http";
            var hostString = host || "";
            var portString = (port === 80 && schemeString === "http") || (port === 443 && schemeString === "https") || typeof port === "undefined" ? "" : ":" + port;
            var hashString = hash ? "#" + encodeURIComponent(hash) : "";
            var pathString = path ? "/" + encodeURI(path) : "";
            var queryString = query ? "?" + query : "";
            
            return schemeString + ":" + (slash || "//") + hostString + portString + (pathString || "") + queryString + hashString;
        };
        
        self.getScheme = function () {
            return scheme;
        };
        
        self.setScheme = function (value) {
            scheme = value;
        };
        
        self.getSlash = function () {
            return slash;
        };
        
        self.setSlash = function (value) {
            slash = value;
        };
        
        self.getHost = function () {
            return host;
        };
        
        self.setHost = function (value) {
            host = value;
        };
        
        self.getPort = function () {
            return port;
        };
        
        self.setPort = function (value) {
            port = value;
        };
        
        self.getPath = function () {
            return decodeURI(path);
        };
        
        self.setPath = function (value) {
            path = value;
        };
        
        self.getQuery = function () {
            return query;
        };
        
        self.setQuery = function (obj) {
            queryStringValues = obj;
            query = stringify(obj).substr(1);
        };
        
        self.getParsedQuery = function () {
            return queryStringValues;
        }
        
        self.getHash = function () {
            return decodeURIComponent(hash);
        };
        
        self.setHash = function (value) {
            hash = value;
        };
        
        self.getPage = function () {
            var tmpArray;
            if (path) {
                tmpArray = path.split("/");
                return tmpArray[tmpArray.length - 1];
            } else {
                return undefined;
            }
        };
        
        self.getExtension = function () {
            var page = self.getPage();
            if (page) {
                var regExp = /\.[^\.]*?$/i;
                var value = page.match(regExp);
                return value ? value[0] : undefined;
            } else {
                return undefined;
            }
        };
        
        self.toString = self.getHref;

    };
        
});
