leavitt.require(["jQuery", "leavitt.utils.EventEmitter"], function () {
    var EventEmitter = leavitt.utils.EventEmitter;
    var Event = leavitt.utils.Event;

    var App = function (options) {
        if (!(this instanceof App)) {
            return new App(options);
        }
        var self = this;
        options = options = {};

        self.init = function (options) {
            //Tracks offline or not
            var isOnline = true;
            self.removeAllListeners();
            self.on("ajaxResponse", function (e) {
                if (!isOnline) {
                    var event = new Event("online");
                    event.url = e.url;
                    event.callback = e.callback;
                    event.parameters = e.parameters;

                    self.emit(event);
                    if (!event.isDefaultPrevented()) {
                        isOnline = true;
                    }
                }
            });
            self.on("ajaxError", function (e) {
                if (e.jqXHR.status === 0) {
                    var event = new Event("offline");
                    event.options = e.options;

                    self.emit(event);
                    if (!event.isDefaultPrevented()) {
                        isOnline = false;
                    }
                }
            });

            $(window).bind('orientationChange', function (e) {
                var event = new Event("orientationChange");

                if (window.orientation === 0) {
                    event.orientationType = "portrait";
                } else {
                    event.orientationType = "landscape";
                }
                event.orientation = window.orientation;

                self.emit(event);
            });

            var jQueryAjax = $.ajax;
            self.ajax = function (url, options) {
                // If url is an object, simulate pre-1.5 signature
                if (typeof url === "object") {
                    options = url;
                    url = undefined;
                }

                // Force options to be an object
                options = options || {};

                var event = new self.Event("ajaxRequest");
                event.options;

                self.emit(event);

                var oSuccess = options.success || function () { };
                var oError = options.error || function () { };

                var onSuccess = function (data, textStatus, jqXHR) {
                    var e = new self.Event("ajaxResponse");
                    e.data = data;
                    e.textStatus = textStatus;
                    e.jqXHR = jqXHR;
                    e.options = options;

                    self.emit(e);
                    if (!e.isDefaultPrevented()) {
                        event.callback(data);
                    }
                    oSuccess.apply(null, arguments);
                };

                var onError = function (jqXHR, textStatus, errorThrown) {
                    var e = new self.Event("ajaxError");
                    e.jqXHR = jqXHR;
                    e.textStatus = textStatus;
                    e.errorThrown = errorThrown;
                    e.options = options;

                    self.emit(e);
                    oError.apply(null, arguments);
                };

                if (!event.isDefaultPrevented()) {
                    jQueryAjax.apply($, [options]);
                }

            };

            $.ajax = self.ajax;

        };

        self.init(options);
    };

    App.prototype = new EventEmitter();
    App.prototype.Event = Event;

    leavitt.App = App;

});