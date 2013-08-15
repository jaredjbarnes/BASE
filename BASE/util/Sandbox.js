BASE.require([
    "BASE.util.Observable",
    "BASE.util.PropertyChangedEvent",
    "BASE.async.Future"
], function () {
    BASE.namespace("BASE.util");

    BASE.util.Sandbox = (function (Super) {
        var Sandbox = function (baseRoot) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Sandbox();
            }

            Super.call(self);

            self.createWindow = function () {
                return new BASE.async.Future(function (setValue, setError) {
                    var iframe = document.createElement("iframe");
                    iframe.src = "about:blank";
                    iframe.style.display = "none";

                    iframe.addEventListener("load", function () {
                        var win = iframe.contentWindow;

                        var script = win.document.createElement("script");
                        script.src = baseRoot + "BASE.js";

                        script.onerror = function () {
                            clearTimeout(timeout);
                            setError(new Error("Couldn't find script."));
                        };

                        var check = function () {
                            timeout = setTimeout(function () {
                                if (win.BASE) {
                                    win.BASE.require.setRoot(baseRoot);
                                    setValue(win);
                                } else {
                                    check();
                                }
                            }, 1);
                        };

                        var timeout = setTimeout(function () {
                            check();
                        }, 0);

                        win.document.body.appendChild(script);

                    });

                    document.body.appendChild(iframe);
                });
            };


            var _window = self.createWindow();
            Object.defineProperty(self, "window", {
                get: function () {
                    return _window;
                }
            });

            return self;
        };

        BASE.extend(Sandbox, Super);

        return Sandbox;
    }(BASE.util.Observable));
});