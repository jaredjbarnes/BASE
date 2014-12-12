BASE.require([
    "BASE.util.Observable",
    "BASE.async.Future",
    "JSON"
], function () {
    var global = (function () { return this; }());
    var document = global.document || {};

    BASE.namespace("BASE.web");

    var isHTML4 = (function () {
        if ('querySelector' in document && 'localStorage' in global && 'addEventListener' in global) {
            return false;
        } else {
            return true;
        }
    }());

    BASE.web.ajax = {
        request: function (url, settings) {
            settings = settings || {};
            settings.type = settings.type || "GET"
            settings.headers = settings.headers || {};

            if (!settings.converter) {
                settings.converter = function (responseText) {
                    return JSON.parse(responseText);
                };
                settings.headers["Accept"] = "application/json";
            }


            if (!settings.headers["Content-Type"] && typeof settings.headers["Content-Type"] !== "boolean") {
                settings.headers["Content-Type"] = "application/json";
            }

            settings.data = settings.data || "";

            if (typeof settings.data !== "string") {
                settings.data = JSON.stringify(settings.data);
            }

            // IE 8 doesn't support PATCH, sooooo we have to do this :(
            if (isHTML4 && settings.type && settings.type.toUpperCase() === "PATCH") {
                settings.type = "PUT";
            }
            var xhr = new XMLHttpRequest();

            var future = new BASE.async.Future(function (setValue, setError) {

                xhr.onreadystatechange = function (event) {
                    if (xhr.readyState == 4) {
                        if (xhr.status < 300 && xhr.status >= 200) {
                            try {
                                var data = settings.converter(xhr.responseText);
                            } catch (e) {
                                var error = new Error("Parse Error.");
                                error.xhr = xhr;
                                error.message = e.message;
                                setError(error);
                                return;
                            }

                            setValue({ data: data, xhr: xhr, message: "Success" });
                        } else {
                            var error = new Error(xhr.status);
                            error.xhr = xhr;
                            error.message = "Error";
                            setError(error);
                        }
                    }
                }
                try {
                    xhr.open(settings.type, url, true);
                    Object.keys(settings.headers).forEach(function (key) {
                        if (settings.headers[key] !== false) {
                            xhr.setRequestHeader(key, settings.headers[key]);
                        }
                    });

                    xhr.send(settings.data);
                } catch (e) {
                    throw new Error("Url: \"" + url + "\" couldn't be retrieved because CORS isn't enabled, or you are working in ie 8 and below.");
                }

            });

            future.ifCanceled(function () {
                xhr.abort();
            });

            return future;
        },
        GET: function (url, settings) {
            settings = settings || {};
            settings.type = "GET";
            return BASE.web.ajax.request(url, settings);
        },
        PUT: function (url, settings) {
            settings = settings || {};
            settings.type = "PUT";
            return BASE.web.ajax.request(url, settings);
        },
        POST: function (url, settings) {
            settings = settings || {};
            settings.type = "POST";
            return BASE.web.ajax.request(url, settings);
        },
        PATCH: function (url, settings) {
            settings = settings || {};
            var type = "PATCH";

            settings.type = type;
            return BASE.web.ajax.request(url, settings);
        },
        DELETE: function (url, settings) {
            settings = settings || {};
            settings.type = "DELETE";
            return BASE.web.ajax.request(url, settings);
        },
        OPTIONS: function (url, settings) {
            settings = settings || {};
            settings.type = "OPTIONS";
            return BASE.web.ajax.request(url, settings);
        },
        UPDATE: function (url, settings) {
            settings = settings || {};
            settings.type = "UPDATE";
            return BASE.web.ajax.request(url, settings);
        }
    };

});