BASE.require(["Object.prototype.enableEventEmitting", "jQuery.fn.enableDragEvents", "jQuery.fn.region", "jQuery.fn.pushView"], function () {
    var browserPrefix = (function () {
        var prefix = {
            mozilla: "-moz-",
            webkit: "-webkit-",
            msie: "-ms-",
            opera: "-o-"
        };

        for (var x in $.browser) {
            if (prefix.hasOwnProperty(x)) {
                return prefix[x];
            }
        }
        return "";
    })();

    var WindowManager = function (options) {
        if (!(this instanceof WindowManager)) {
            return new WindowManager(options);
        }
        var manager = this;
        manager.focusedWindow = null;
        var windows = [];
        var domWindows = [];

        var $veil;
        var isVeilOpen = false;

        var handleFocus = function (e) {
            var $window = this.$window;
            if (manager.focusedWindow && (manager.focusedWindow !== this && !manager.focusedWindow.blur())) {
                e.preventDefault();
                $window.css({
                    zIndex: "1000",
                    "box-shadow": "0px 5px 25px #000"
                });
            } else {

                $window.css({
                    zIndex: "2000",
                    "box-shadow": "0px 5px 25px #000"
                });
                manager.focusedWindow = this;
            }
        };

        var handleBlur = function (e) {
            var $window = this.$window;
            $window.css({
                zIndex: "1000",
                "box-shadow": "0px 1px 5px #000"
            });

            manager.focusedWindow = null;
        };

        var handleClose = function (e) {
            if (manager.focusedWindow === this) {
                this.blur();
            }
            manager.unregister(this);
        };

        var handleOpen = function (e) {
            if (isVeilOpen) {
                return false;
            }
            return true;
        };

        var resizeHandle = function (e) {
            veil.css({
                width: $(window).width(),
                height: $(window).height()
            });
        }

        manager.showVeil = function () {
            veil.css({
                width: $(window).width(),
                height: $(window).height(),
                display: "block"
            });

            $(window).bind("resize", resizeHandle);
            isVeilOpen = true;
        };
        manager.hideVeil = function () {
            $(window).unbind("resize", resizeHandle);
            isVeilOpen = false;
            veil.css({
                display: "none"
            });
        };


        manager.register = function (tWindow) {
            if ($windowContainer.has(tWindow.$window)) {
                tWindow.$window.appendTo(manager.$windowContainer)
            }
            windows.push(tWindow);
            domWindows.push(tWindow.$window[0]);

            tWindow.on("focus", handleFocus);
            tWindow.on("blur", handleBlur);
            tWindow.on("open", handleOpen);
            tWindow.on("close", handleClose);
        };
        manager.unregister = function (tWindow) {
            tWindow.removeListener("focus", handleFocus);
            tWindow.removeListener("blur", handleBlur);
            tWindow.removeListener("open", handleOpen);
            tWindow.removeListener("close", handleClose);

            var index = windows.indexOf(tWindow);
            if (index > -1) { windows.splice(index, 1); }

            index = domWindows.indexOf(tWindow.$window[0]);
            if (index > -1) { domWindows.splice(index, 1); }

            tWindow.$window.detach();

        };

        var $windowContainer = this.$windowContainer = $("<div></div>").css({
            width: "0px",
            height: "0px"
        }).appendTo(document.body);

        veil = $("<div></div>").css({
            "z-index": "1001",
            "background-color": "#000",
            "opacity": 0.5,
            display: "none",
            position: "fixed",
            top: "0px",
            left: "0px"
        }).appendTo($windowContainer);
    };

    var manager = new WindowManager();

    var Window = function (options) {
        if (!(this instanceof Window)) {
            return new Window(options);
        }

        options = options || {};

        //Private Members
        var tWindow = this;
        var $window = null;
        var $titlebar = null;
        var $content = null;

        var getCenterScreenXY = function (tWindow) {
            var centerX = $(window).width() / 2;
            var centerY = $(window).height() / 2;

            var region = tWindow.$window.region();
            var ret = {
                x: Math.floor(centerX - (region.width / 2)),
                y: Math.floor(centerY - (region.height / 2))
            };

            return ret;
        };

        var createDragDrop = function () {
            var $titlebar = $window.find(".web-window-titlebar");
            $titlebar.enableDragEvents();

            $titlebar.bind("drag", function (e) {
                var scrollTop = $("body").scrollTop();
                var scrollLeft = $("body").scrollLeft();

                var y = e.pageY - scrollTop;
                var x = e.pageX - scrollLeft;

                tWindow.position((x - e.offsetX), (y - e.offsetY) + parseInt($titlebar.css("height"), 10));
                //console.log("drag: (", "offsetX: ", e.offsetX, "offsetY: ", e.offsetY, ")");
            });
            $titlebar.bind("dragstart", function (e) {
                //console.log(e.pageX);
            });
            $titlebar.bind("dragstop", function (e) {
                //console.log(e.pageX);
            });

            if (options.resize) {
                var $resize = $window.find(".web-window-resize");
                var mouse;
                var windowWidth;
                var windowHeight;

                $resize.enableDragEvents();
                $resize.bind("drag", function (e) {
                    var cmouse = {
                        x: e.pageX,
                        y: e.pageY
                    };
                    var diff = {
                        x: cmouse.x - mouse.x,
                        y: cmouse.y - mouse.y
                    };

                    var newWidth = ((windowWidth + diff.x));
                    var newHeight = ((windowHeight + diff.y));

                    $window.css({
                        width: newWidth > 15 ? newWidth : 15 + "px",
                        height: newHeight > 15 ? newHeight : 15 + "px"
                    });
                });

                $resize.bind("dragstart", function (e) {
                    //console.log(e.pageX);
                    mouse = {
                        x: e.pageX,
                        y: e.pageY
                    };
                    windowWidth = parseInt($window.css("width"));
                    windowHeight = parseInt($window.css("height"));

                });
                $resize.bind("dragstop", function (e) {
                    //console.log(e.pageX);
                });
            } else {
                var $resize = $window.find(".web-window-resize");
                $resize.remove();
            }
        };



        var createWindowDOM = function () {
            $window = tWindow.$window = $("<div></div>").css({
                resize: options.resize || "none",
                width: "250px",
                height: "250px",
                position: "fixed",
                overflow: "visible",
                "box-shadow": "0px 1px 5px #000",
                padding: "0px 0px 20px 0px"
            }).addClass("web-window");

            $content = $("<div></div>").css({
                width: "100%",
                height: "100%",
                position: "absolute",
                top: "0px",
                left: "0px",
                //backgroundColor: "#FFF",
                overflow: "auto",
                resize: "none"
            }).addClass("web-window-content").appendTo($window);

            $titlebar = $("<div></div>").css({
                width: "100%",
                height: "20px",
                position: "absolute",
                top: "-20px",
                left: "0px"
            }).addClass("web-window-titlebar").appendTo($window);

            $resize = $("<div></div>").css({
                width: "15px",
                height: "15px",
                position: "absolute",
                bottom: "0px",
                right: "0px",
                cursor: "nw-resize"
            }).addClass("web-window-resize").appendTo($window);

            //Create DragDrop
            createDragDrop();
        };

        tWindow.hasFocus = false;
        tWindow.open = function (options) {
            var tWindow = this;
            manager.register(tWindow);
            var event = new tWindow.Event("open");
            options = options || {};
            tWindow.emit(event);
            if (!event.isDefaultPrevented()) {
                tWindow.focus();

                tWindow.$window.css({
                    width: options.width || tWindow.$window.css("width"),
                    height: options.height || tWindow.$window.css("height")
                });

                var center = getCenterScreenXY(tWindow);

                tWindow.position(options.x || center.x, options.y || center.y);
            } else {
                manager.unregister(tWindow);
            }
        };

        tWindow.position = function (x, y) {
            var tWindow = this;
            var region = $window.region();
            x = x > 0 ? x : 0;
            y = y > 0 ? y : 0;

            x = x + region.width < $(window).width() ? x : $(window).width() - region.width > 0 ? $(window).width() - region.width : 0;
            y = y + region.height < $(window).height() ? y : $(window).height() - region.height > 0 ? $(window).height() - region.height : 0;
            tWindow.$window.css({
                top: y + "px",
                left: x + "px"
            });
        };

        tWindow.close = function () {
            var tWindow = this;
            var event = new tWindow.Event("close");

            tWindow.emit(event);
            if (!event.isDefaultPrevented()) {
                manager.unregister(tWindow);
            }
        };

        tWindow.pushView = function () {
            $.fn.pushView.apply($content, arguments);
        };

        tWindow.popView = function () {
            $.fn.popView.apply($content, arguments);
        };

        tWindow.focus = function () {
            var tWindow = this;
            var event = new tWindow.Event("focus");

            if (tWindow !== manager.focusedWindow) {
                tWindow.emit(event);

                if (!event.isDefaultPrevented()) {
                    tWindow.hasFocus = true;
                    return true;
                }
                return false;
            }
            return true;
        };

        tWindow.setMinHeight = function (h) {
            var tWindow = this;
            tWindow.$window.css("height", h + "px");
        };
        tWindow.setMinWidth = function (w) {
            var tWindow = this;
            tWindow.$window.css("width", w + "px");
        };
        tWindow.setMinDimesions = function (w, h) {
            var tWindow = this;
            tWindow.setMinWidth(w);
            tWindow.setMinHeight(h);
        };

        tWindow.blur = function () {
            var tWindow = this;
            var event = new tWindow.Event("blur");

            tWindow.emit(event);
            if (!event.isDefaultPrevented()) {
                tWindow.hasFocus = false;
                return true;
            }
            return false;
        };

        createWindowDOM();

        $window.bind("mousedown", function (e) {
            tWindow.focus();
        });

        this.enableEventEmitting();


    };

    var Modal = function (options) {
        if (!(this instanceof Modal)) {
            return new Modal(options);
        }
        var modal = this;
        Window.apply(modal, arguments);
        modal.isModal = true;

        modal.open = function () {
            Modal.prototype.open.apply(modal, arguments);
            manager.showVeil();
        };

        modal.on("close", function () {
            manager.hideVeil();
        });

    };
    Modal.prototype = new Window();

    WEB.Window = Window;
    WEB.Modal = Modal;

});