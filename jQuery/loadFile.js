BASE.require(["jQuery"], function () {
    var cache = {};

    jQuery.loadFile = function (url, options, callback) {
        switch (arguments.length) {
            case 2: {
                if (typeof options === "function") {
                    callback = options;
                    options = {};
                }
                break;
            }
        }
        callback = typeof callback === "function" ? callback : function () { };

        var oSuccess = options.success || function () { };
        var oError = options.error || function () { };

        var onSuccess = function (html) {
            oSuccess.apply(null, arguments);
            cache[url] = html;
            callback(null, html);
        };

        var onFailure = function () {
            oError.apply(null, arguments);
            callback(arguments[2]);
        };

        options.success = onSuccess;
        options.error = onFailure;

        if (options.fromCache && cache[url]) {
            onSuccess(cache[url]);
        } else {
            $.ajax(url, options);
        }
    };
});