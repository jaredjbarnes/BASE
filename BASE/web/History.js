BASE.require(["BASE.util.Observable", "BASE.util.PropertyChangedEvent", "BASE.web.Url"], function () {
    BASE.namespace("BASE.web");

    BASE.web.History = (function (Super) {
        var History = function () {
            var self = this;

            if (!(self instanceof arguments.callee)) {
                return new History();
            }

            Super.call(self);

            var _length = null;
            Object.defineProperty(self, "length", {
                get: function () {
                    return history.length;
                }
            });

            var _oldOnPopState = window.onpopstate || function () { };

            var _onPopState = function (e) {
                var event = new BASE.util.ObservableEvent("popState");
                event.state = e.state;
                event.url = BASE.web.Url.parse(location.href);
                self.notify(event);
            };

            window.onpopstate = _onPopState;

            self.onPopState = function (callback) {
                self.observe(callback, "popState");
            };

            self.onPushState = function (callback) {
                self.observe(callback, "pushState");
            };

            self.onReplaceState = function (callback) {
                self.observe(callback, "relaceState");
            };

            self.back = function () {
                history.back.apply(history, arguments);
            };

            self.forward = function () {
                history.forward.apply(history, arguments);
            };

            self.go = function () {
                history.go.apply(history, arguments);
            };

            self.pushState = function () {
                history.pushState.apply(history, arguments);

                var event = new BASE.util.ObservableEvent("pushState");
                event.state = arguments[0];
                event.url = BASE.web.Url.parse(location.href);
                self.notify(event);
            };

            self.replaceState = function () {
                history.replaceState.apply(history, arguments);

                var event = new BASE.util.ObservableEvent("relaceState");
                event.state = arguments[0];
                event.url = BASE.web.Url.parse(location.href);
                self.notify(event);
            };

            return self;
        };

        BASE.extend(History, Super);

        var _instance = new History();
        Object.defineProperty(History, "instance", {
            get: function () { return _instance; }
        })

        return History;
    }(BASE.util.Observable));
});