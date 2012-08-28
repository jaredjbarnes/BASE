BASE.require(["BASE.UnitTest"], function () {

    BASE.namespace("WEB.ui.unitTesting.controllers");

    var UnitTestController = function (view) {
        if (!(this instanceof UnitTestController)) {
            return new UnitTestController(view);
        }

        var self = this;

        //private variables
        var _unitTests = {};
        //private methods
        //properties
        //methods

        var _unitTest = new BASE.UnitTest({
            appendIframe: function (iframe, unitTestNamespace) {
                view.appendIframe(iframe, _unitTests[unitTestNamespace].isVisible);
            }
        });

        _unitTest.on("success", function (e) {
            view.addSuccess(e.message, e.details);
        });

        _unitTest.on("error", function (e) {
            view.addError(e.message, e.details);
        });

        _unitTest.on("warning", function (e) {
            view.addWarning(e.message, e.details);
        });

        _unitTest.on("notes", function (e) {
            view.addNotes(e.message, e.details);
        });

        view.on("unitTestAdded", function (e) {
            _unitTests[e.unitTestNamespace] = { isVisible: e.isVisible };
            _unitTest.run(e.unitTestNamespace, {
                setupUnitTest: function (window) {
                    if (e.scriptRoot) window.BASE.require.root = e.scriptRoot;
                    if (typeof e.setup === "function") {
                        e.setup(window);
                    }
                }
            });
        });

        return self;
    };

    WEB.ui.unitTesting.controllers.UnitTestController = UnitTestController;

});