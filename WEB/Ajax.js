BASE.require(["BASE.Observable"], function () {
    BASE.namespace("WEB");

    WEB.Ajax = (function (Super) {
        var Ajax = function (url, settings) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Ajax();
            }

            Super.call(self);

            settings = settings || {};
            settings.type = settings.type || "GET"
            settings.headers = settings.headers || {};
            settings.success = settings.success || function () { };
            settings.error = settings.error || function () { };
            settings.data = settings.data || "";

            settings.headers["Content-Type"] = "application/json";

            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function (event) {
                if (xhr.readyState == 4) {
                    if (xhr.status < 300 && xhr.status >= 200) {
                        try {
                            var data = JSON.parse(xhr.responseText);
                        } catch (e) {
                            settings.error(xhr, "parseError", e);
                            return;
                        }
                        settings.success(data, "success", xhr);
                    } else {
                        settings.error(xhr, "error", new Error(status));
                    }
                }
            }
            xhr.open(settings.type, encodeURI(url), true);
            Object.keys(settings.headers).forEach(function (key) {
                xhr.setRequestHeader(key, settings.headers[key]);
            });

            xhr.send(settings.data);

            return self;
        };

        BASE.extend(Ajax, Super);

        return Ajax;
    }(BASE.Observable));
});