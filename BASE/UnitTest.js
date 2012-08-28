BASE.require(["BASE.EventEmitter", "Array.isArray", "Array.prototype.forEach", "jQuery"], function () {

    BASE.UnitTest = function (delegate) {
        if (!(this instanceof BASE.UnitTest)) {
            return new BASE.UnitTest(delegate);
        }

        var self = this;
        delegate = delegate || {};

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

        //methods
        self.run = function (namespaceOfTest, options) {
            options = options || {};

            var setupUnitTest = options.setupUnitTest || function () { };
            var breakDownUnitTest = options.breakDownUnitTest || function () { };

            var _createIframe = function (callback) {
                var $iframe = $("<iframe></iframe>").bind("load", function () {
                    _loadScripts($iframe[0].contentWindow, [BASE.require.getPath("BASE"), BASE.require.getPath("jQuery")], function () {
                        callback($iframe[0].contentWindow, $iframe[0]);
                    });
                });

                if (typeof delegate.appendIframe === "function") {
                    delegate.appendIframe($iframe[0], namespaceOfTest);
                } else {
                    $iframe.appendTo(document.body);
                }
            };

            var _createSandbox = function (callback) {
                _createIframe(callback);
            };

            _createSandbox(function (window) {
                window.document.title = namespaceOfTest;
                setupUnitTest(window);

                window.BASE.require([namespaceOfTest], function () {
                    var test = new window.BASE.getObject(namespaceOfTest)();

                    test.on("error", function (e) {
                        var event = new BASE.Event("error");
                        event.message = e.message;
                        event.details = e.details;
                        event.testNamespace = namespaceOfTest;

                        self.emit(event);
                        breakDownUnitTest(window);
                    });

                    test.on("warning", function (e) {
                        var event = new BASE.Event("warning");
                        event.message = e.message;
                        event.details = e.details;
                        event.testNamespace = namespaceOfTest;

                        self.emit(event);
                        breakDownUnitTest(window);
                    });

                    test.on("notes", function (e) {
                        var event = new BASE.Event("notes");
                        event.message = e.message;
                        event.details = e.details;
                        event.testNamespace = namespaceOfTest;

                        self.emit(event);
                        breakDownUnitTest(window);
                    });

                    test.on("success", function (e) {
                        var event = new BASE.Event("success");
                        event.message = e.message;
                        event.details = e.details;
                        event.testNamespace = namespaceOfTest;

                        self.emit(event);
                        breakDownUnitTest(window);
                    });

                    test.run();
                });


            }, options.isVisible);
        };

        return self;
    };

});