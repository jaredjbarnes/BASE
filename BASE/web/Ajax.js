BASE.require([
    "BASE.util.Observable",
    "BASE.async.Future"
], function () {
    BASE.namespace("BASE.web");

    BASE.web.ajax = {
        request: function (url, settings) {
            settings = settings || {};
            settings.type = settings.type || "GET"
            settings.headers = settings.headers || {};
            //settings.headers["Accept"] = settings.headers["Accept"] || "*/*";
            settings.headers["Content-Type"] = "application/json";
            settings.data = settings.data || "";


            return new BASE.async.Future(function (setValue, setError) {

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
                try {
                    xhr.open(settings.type, url, true);
                    Object.keys(settings.headers).forEach(function (key) {
                        xhr.setRequestHeader(key, settings.headers[key]);
                    });

                    xhr.send(settings.data);
                } catch (e) {
                    setError(e);
                }
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
        POST: function (url, settings) {
            settings = settings || {};
            settings.type = "POST";
            return BASE.web.ajax.request(url, settings);
        },
        PATCH: function (url, settings) {
            settings = settings || {};
            settings.type = "PATCH";
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