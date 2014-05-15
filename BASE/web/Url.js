BASE.namespace("BASE.web");

BASE.web.Url = (function () {
    //URL Class start.
    var Url = function (url) {
        var self = this;

        BASE.assertNotGlobal(self);

        //Thanks Douglas Crockford.
        var parse_url = /^(?:([A-Za-z]+):)?(\/{0,3})([0-9.\-A-Za-z]+)(?::(\d+))?(?:\/([^?#]*))?(?:\?([^#]*))?(?:#(.*))?$/;
        var result = parse_url.exec(url);

        var parseQuery = function (querystring) {
            var values = {};

            if (querystring) {
                querystring = decodeURI(querystring);

                var keyValues = querystring.split("&");
                keyValues.forEach(function (keyValue) {
                    var split = keyValue.split("=");
                    values[split[0]] = split[1];
                });

            }
            return values;
        };

        var queryStringValues = parseQuery(result[6]);

        self.getHref = function () {
            result[0];
        };

        self.getScheme = function () {
            return result[1];
        };

        self.getSlash = function () {
            return result[2];
        };

        self.getHost = function () {
            return result[3];
        };

        self.getPort = function () {
            if (!result[4]) {
                return result[1] === 'https' ? 443 : 80;
            } else {
                return parseInt(result[4], 10);
            }
        };

        self.getPath = function () {
            return result[5];
        };

        self.getQuery = function () {
            return result[6];
        };

        self.getParsedQuery = function () {
            return queryStringValues;
        }

        self.getHash = function () {
            return result[7];
        };

        self.getPage = function () {
            var tmpArray;
            if (result[5]) {
                tmpArray = result[5].split("/");
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

    };

    return Url;
}());

