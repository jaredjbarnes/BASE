BASE.require([], function () {

    BASE.namespace("BASE.web.queryString");

    BASE.web.queryString.toString = function (obj) {
        var parts = Object.keys(obj).map(function (key) {
            return encodeURIComponent(key) + "=" + encodeURIComponent(obj[key]);
        });
        return "?" + parts.join("&");
    };

    BASE.web.queryString.parse = function (querystring) {
        var values = {};

        if (querystring) {

            if (querystring.indexOf("?") === 0) {
                querystring = querystring.substr(1);
            }

            querystring = decodeURI(querystring);

            var keyValues = querystring.split("&");
            keyValues.forEach(function (keyValue) {
                var split = keyValue.split("=");
                values[split[0]] = decodeURIComponent(split[1]);
            });

        }
        return values;
    };
});