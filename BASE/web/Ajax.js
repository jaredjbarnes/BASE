BASE.require(["BASE.Observable", "BASE.Future"], function () {
    BASE.namespace("BASE.web");

    BASE.web.ajax = {
        request: function (url, settings) {
            settings = settings || {};
            settings.type = settings.type || "GET"
            settings.headers = settings.headers || {};
            //settings.headers["Accept"] = settings.headers["Accept"] || "*/*";
            settings.data = settings.data || "";


            return new BASE.Future(function (setValue, setError) {

                var xhr = new XMLHttpRequest();
                xhr.onreadystatechange = function (event) {
                    if (xhr.readyState == 4) {
                        if (xhr.status < 300 && xhr.status >= 200) {
                            try {
                                var data = JSON.parse(xhr.responseText);
                            } catch (e) {
                                var error = new Error("Parse Error.");
                                error.xhr = xhr;
                                error.message = e.message;
                                setError(error);
                                return;
                            }

                            setValue({ data: data, xhr: xhr, message: "Success" });
                        } else {
                            var error = new Error(status);
                            error.xhr = xhr;
                            error.message = "Error";
                            setError(error);
                        }
                    }
                }

                xhr.open(settings.type, url, true);
                Object.keys(settings.headers).forEach(function (key) {
                    xhr.setRequestHeader(key, settings.headers[key]);
                });

                xhr.send(settings.data);
            });
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
        POST: function () {
            settings = settings || {};
            settings.type = "POST";
            return BASE.web.ajax.request(url, settings);
        },
        PATCH: function () {
            settings = settings || {};
            settings.type = "PATCH";
            return BASE.web.ajax.request(url, settings);
        },
        DELETE: function () {
            settings = settings || {};
            settings.type = "DELETE";
            return BASE.web.ajax.request(url, settings);
        },
        OPTIONS: function () {
            settings = settings || {};
            settings.type = "OPTIONS";
            return BASE.web.ajax.request(url, settings);
        },
        UPDATE: function () {
            settings = settings || {};
            settings.type = "UPDATE";
            return BASE.web.ajax.request(url, settings);
        }
    };

});