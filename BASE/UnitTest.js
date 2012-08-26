BASE.require(["BASE.EventEmitter", "Array.isArray", "Array.prototype.forEach", "jQuery"], function () {

    BASE.UnitTest = function (delegate) {
        if (!(this instanceof BASE.UnitTest)) {
            return new BASE.UnitTest(delegate);
        }

        var self = this;
        delegate = delegate || {};
        var appendIframesToElement = delegate.appendIframesToElement || document.body;

        BASE.EventEmitter.call(this);

        //private variables

        //private methods
        var _loadScripts = function (window, scripts, callback) {
            var loadedScripts = [];
            var scripts = Array.isArray(scripts) ? scripts : [scripts];

            var registerReturn = function (scriptName) {
                loadedScripts.push(scriptName);
                if (loadedScripts.length === scripts.length) {
                    callback(window);
                }
            };

            scripts.forEach(function (scriptName) {

                var script = window.document.createElement("script");

                script.onload = function () {
                    if (!script.onloadDone) {
                        script.onloadDone = true;
                        registerReturn(scriptName);
                    }
                };

                script.onerror = function () {
                    registerReturn(scriptName);
                };

                script.onreadystatechange = function () {
                    if (("loaded" === script.readyState || "complete" === script.readyState) && !script.onloadDone) {
                        registerReturn(scriptName);
                    }
                }

                script.src = scriptName;

                window.document.body.appendChild(script);
            });

        };

        var _createIframe = function (callback, isVisible) {
            var css = isVisible ? {
                width: "100%",
                height: "1024px"
            } : {
                display: "none"
            };

            var $iframe = $("<iframe></iframe>").css(css).bind("load", function () {
                _loadScripts($iframe[0].contentWindow, [BASE.require.getPath("BASE"), BASE.require.getPath("jQuery")], function () {
                    callback($iframe[0].contentWindow, $iframe[0]);
                });
            });

            $iframe.appendTo(appendIframesToElement);
        };

        var _createSandbox = function (callback, isVisible) {
            _createIframe(callback, isVisible);
        };

        //properties

        //methods
        self.run = function (namespaceOfTest, options) {
            options = options || {};

            var beforeTest = options.beforeTest || function () { };
            var afterTest = options.afterTest || function () { };

            _createSandbox(function (window) {
                window.document.title = namespaceOfTest;
                beforeTest(window);

                window.BASE.require([namespaceOfTest], function () {
                    var test = new window.BASE.getObject(namespaceOfTest)();

                    test.on("error", function (e) {
                        var event = new BASE.Event("error");
                        event.message = e.message;
                        event.testNamespace = namespaceOfTest;

                        self.emit(event);
                        afterTest(window);
                    });

                    test.on("success", function (e) {
                        var event = new BASE.Event("success");
                        event.message = e.message;
                        event.testNamespace = namespaceOfTest;

                        self.emit(event);
                        afterTest(window);
                    });

                    test.run();
                });


            }, options.isVisible);
        };

        self.createSandbox = function (callback) {
            return _createSandbox(callback);
        };

        return self;
    };

});