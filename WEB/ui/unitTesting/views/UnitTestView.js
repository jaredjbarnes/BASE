BASE.require(["jQuery", "BASE.EventEmitter", "jQuery.fn.region"], function () {
    BASE.namespace("WEB.ui.unitTesting.views");

    WEB.ui.unitTesting.views.UnitTestView = function (elem) {
        if (!(this instanceof WEB.ui.unitTesting.views.UnitTestView)) {
            return new WEB.ui.unitTesting.views.UnitTestView(elem);
        }

        var self = this;

        BASE.EventEmitter.call(this);

        //private variables
        var _$elem = $(elem);
        var _$log = _$elem.find(".unit-test-log");
        var _$header = _$elem.find(".unit-test-header");
        var _$newUnitTest = _$elem.find(".new-unit-test");
        var _$addTestButton = _$elem.find(".add-unit-test-button");
        var _$closeNewUnitTest = _$elem.find(".close-unit-test");
        var _$checkbox = _$elem.find("#DOMBased");
        var _$runButton = _$elem.find("#run");

        var _unitTests = {};

        //private methods
        var _repositionNewUnitTestWindow = function () {
            if (_$header.css("display") !== "none") {
                var headerRegion = _$header.region();
                var windowRegion = $(window).region();
                var newUnitTestRegion = _$newUnitTest.region();

                var newPos = Math.floor(windowRegion.width / 2) - Math.floor(newUnitTestRegion.width / 2)

                _$newUnitTest.css({
                    top: 0 + "px",
                    left: newPos + "px"
                });
            }
        };

        var _resizeLog = function () {
            var headerRegion = _$header.region();
            var windowRegion = $(window).region();

            var newLogHeight = windowRegion.height - headerRegion.height;

            _$log.css({
                height: newLogHeight + "px"
            });

            _repositionNewUnitTestWindow();
        };

        var addNewUnitTestOnClick = function (e) {
            if (_$newUnitTest.css("display") === "none") {
                _$newUnitTest.css("display", "block");

                _repositionNewUnitTestWindow();

                var region = _$newUnitTest.region()

                _$newUnitTest.css({
                    top: region.y - region.height + "px"
                });

                _$newUnitTest.animate({
                    top: "+=" + region.height
                }, 300, "easeOutExpo");
            }
        };

        var closeNewUnitTestOnClick = function (e, callback) {
            callback = callback || function () { };
            if (_$newUnitTest.css("display") === "block") {
                var region = _$newUnitTest.region()

                _$newUnitTest.animate({
                    top: "-=" + region.height
                }, 300, "easeOutExpo", function () {
                    _$newUnitTest.css("display", "none");
                    callback();
                });
            }
        };

        var toggleChecked = function (e) {
            var $this = $(this);
            if ($this.hasClass("checked")) {
                $this.addClass("unchecked");
                $this.removeClass("checked");
            } else {
                $this.addClass("checked");
                $this.removeClass("unchecked");
            }
        };

        var runUnitTest = function (e) {
            var $inputs = _$newUnitTest.find("input");

            var unitTestNamspace = $inputs.slice(0, 1).val();
            var scriptRoot = $inputs.slice(1, 2).val();
            var isVisible = _$checkbox.hasClass("checked");

            if (!unitTestNamspace || !scriptRoot) {
                console.log("Incomplete");
            } else {
                _$log.empty();
                closeNewUnitTestOnClick(undefined, function () {
                    var event = new BASE.Event("unitTestAdded");
                    event.unitTestNamespace = unitTestNamspace;
                    event.scriptRoot = scriptRoot;
                    event.isVisible = isVisible;

                    self.emit(event);
                });
            }
        };

        var _getTemplate = function () {
            var $elem = $($("#unitTestItem").text());
            $elem.find(".detail-button").bind("click", function (e) {
                var $this = $(this);
                if ($elem.css("height") !== "55px") {
                    $elem.css("height", "55px");
                    $this.html("Show Details");

                } else {
                    $elem.css("height", "auto");
                    $this.html("Close Details");
                }
            });
            return $elem;
        };

        //properties

        //methods
        self.addNotes = function (message, details) {
            var $note = _getTemplate();
            $note.find(".message").html(message || "None");
            $note.find(".detail").html(details || "No Details");
            $note.appendTo(_$log);
        };

        self.addSuccess = function (message, details) {
            var $success = _getTemplate();
            $success.find(".icon").css({
                backgroundImage: "url(/images/icons/success.png)"
            });
            $success.find(".message").html(message || "None");
            $success.find(".detail").html(details || "No Details");
            $success.appendTo(_$log);
        };

        self.addError = function (message, details) {
            var $error = _getTemplate();
            $error.find(".icon").css({
                backgroundImage: "url(/images/icons/error.png)"
            });
            $error.find(".message").html(message || "None");
            $error.find(".detail").html(details || "No Details");
            $error.appendTo(_$log);
        };

        self.addWarning = function (message, details) {
            var $warning = _getTemplate();
            $warning.find(".icon").css({
                backgroundImage: "url(/images/icons/warning.png)"
            });
            $warning.find(".message").html(message || "None");
            $warning.find(".detail").html(details || "No Details");
            $warning.appendTo(_$log);
        };

        self.appendIframe = function (iframe, isVisible) {
            var $iframe = $(iframe);
            var region = _$log.region();
            var css = isVisible ? {
                width: "100%",
                height: region.height + "px",
                border: "0px"
            } : { display: "none" };

            $iframe.css(css);
            _$log.append(iframe);
        };



        //resize  $elem on window resize;
        $(window).bind("resize", _resizeLog);
        _$addTestButton.bind("click", addNewUnitTestOnClick);
        _$closeNewUnitTest.bind("click", closeNewUnitTestOnClick);
        _$checkbox.bind("click", toggleChecked);
        _$runButton.bind("click", runUnitTest);

        _resizeLog();

        return self;
    };

});