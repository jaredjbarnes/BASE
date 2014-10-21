BASE.namespace("LG");

LG.AjaxProvider = (function () {
    function AjaxProvider(appId, token) {
        var self = this;
        if (!(self instanceof arguments.callee)) {
            return new AjaxProvider(appId, token);
        }
        this.defaultHeaders = {
        };
        this.defaultHeaders["X-LGAppId"] = appId;
        this.defaultHeaders["X-LGToken"] = token;
        this.defaultHeaders["Content-Type"] = "application/json";
    }
    AjaxProvider.prototype.ajax = function (settings) {
        throw new Error("AjaxProvider was meant to be a abstract class.");
    };
    AjaxProvider.prototype.setToken = function (token) {
        this.defaultHeaders["X-LGToken"] = token;
    };
    AjaxProvider.prototype.setAppId = function (appId) {
        this.defaultHeaders["X-LGAppId"] = appId;
    };
    return AjaxProvider;
})();