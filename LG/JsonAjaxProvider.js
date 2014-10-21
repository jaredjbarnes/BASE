BASE.require(["BASE.web.ajax", "LG.AjaxProvider"], function () {
    BASE.namespace("LG");

    LG.JsonAjaxProvider = (function (Super) {
        var JsonAjaxProvider = function (appId, token) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new JsonAjaxProvider(appId, token);
            }

            Super.call(self, appId, token);

            self.ajax = function (url, settings) {
                settings = settings || {};
                settings.headers = settings.headers || {};
                Object.keys(self.defaultHeaders).forEach(function (key) {
                    settings.headers[key] = self.defaultHeaders[key];
                });

                return new BASE.web.ajax.request(url, settings);
            };

            return self;
        };

        BASE.extend(JsonAjaxProvider, Super);

        return JsonAjaxProvider;
    }(LG.AjaxProvider));
});