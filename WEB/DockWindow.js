BASE.require(["Object.prototype.enableEventEmitting", "jQuery.fn.region", "jQuery.fn.pushView"], function () {

    var DockWindow = function (options) {
        options = options || {};
        var dockWindow = this;
        var $dock = null;
        var dockSize = options.size || "45"
        var dockedOn = null;

        var beginMargins = {
            top: $("body").css("margin-top"),
            right: $("body").css("margin-right"),
            bottom: $("body").css("margin-bottom"),
            left: $("body").css("margin-left")
        };

        var dockTo = {
            top: function () {
                if ($dock) {
                    if (!dockedOn) {
                        beginMargins = {
                            top: $("body").css("margin-top"),
                            right: $("body").css("margin-right"),
                            bottom: $("body").css("margin-bottom"),
                            left: $("body").css("margin-left")
                        };
                    } else {
                        $("body").css("margin-top", beginMargins.top);
                        $("body").css("margin-right", beginMargins.right);
                        $("body").css("margin-bottom", beginMargins.bottom);
                        $("body").css("margin-left", beginMargins.left);
                    }

                    dockedOn = "top";

                    $("body").css({
                        marginTop: (parseInt(dockSize, 10) + parseInt(beginMargins.top, 10)) + "px"
                    });

                    $dock.css({
                        position: "fixed",
                        top: "0px",
                        bottom: "",
                        left: "0px",
                        width: "100%",
                        right: "",
                        height: dockSize + "px"
                    });
                }
            },
            right: function () {
                if ($dock) {
                    if (!dockedOn) {
                        beginMargins = {
                            top: $("body").css("margin-top"),
                            right: $("body").css("margin-right"),
                            bottom: $("body").css("margin-bottom"),
                            left: $("body").css("margin-left")
                        };
                    } else {
                        $("body").css("margin-top", beginMargins.top);
                        $("body").css("margin-right", beginMargins.right);
                        $("body").css("margin-bottom", beginMargins.bottom);
                        $("body").css("margin-left", beginMargins.left);
                    }

                    dockedOn = "right";

                    $("body").css({
                        marginRight: (parseInt(dockSize, 10) + parseInt(beginMargins.right, 10)) + "px"
                    });
                    $dock.css({
                        bottom: "",
                        position: "fixed",
                        top: "0px",
                        left: "",
                        right: "0px",
                        width: dockSize + "px",
                        height: "100%"
                    });
                }
            },
            bottom: function () {
                if ($dock) {
                    if (!dockedOn) {
                        beginMargins = {
                            top: $("body").css("margin-top"),
                            right: $("body").css("margin-right"),
                            bottom: $("body").css("margin-bottom"),
                            left: $("body").css("margin-left")
                        };
                    } else {
                        $("body").css("margin-top", beginMargins.top);
                        $("body").css("margin-right", beginMargins.right);
                        $("body").css("margin-bottom", beginMargins.bottom);
                        $("body").css("margin-left", beginMargins.left);
                    }

                    dockedOn = "bottom";

                    $("body").css({
                        marginBottom: (parseInt(dockSize, 10) + parseInt(beginMargins.bottom, 10)) + "px"
                    });
                    $dock.css({
                        position: "fixed",
                        bottom: "0px",
                        left: "0px",
                        right: "",
                        width: "100%",
                        height: dockSize + "px",
                        top: ""
                    });
                }
            },
            left: function () {
                if ($dock) {

                    if (!dockedOn) {
                        beginMargins = {
                            top: $("body").css("margin-top"),
                            right: $("body").css("margin-right"),
                            bottom: $("body").css("margin-bottom"),
                            left: $("body").css("margin-left")
                        };
                    } else {
                        $("body").css("margin-top", beginMargins.top);
                        $("body").css("margin-right", beginMargins.right);
                        $("body").css("margin-bottom", beginMargins.bottom);
                        $("body").css("margin-left", beginMargins.left);
                    }

                    dockedOn = "left";

                    $("body").css({
                        marginLeft: (parseInt(dockSize, 10) + parseInt(beginMargins.left, 10)) + "px"
                    });
                    $dock.css({
                        position: "fixed",
                        top: "0px",
                        right: "",
                        width: dockSize + "px",
                        height: "100%",
                        bottom: "",
                        left: "0px"
                    });
                }
            }
        };

        dockWindow.dockTo = function (type) {
            if (dockTo[type]) {
                var event = new dockWindow.Event("position");
                event.dockedTo = type;
                dockWindow.emit(event);
                if (!event.isDefaultPrevented()) {
                    dockTo[type]();
                }
            } else {

                var event = new dockWindow.Event("position");
                event.dockedTo = top;
                dockWindow.emit(event);
                if (!event.isDefaultPrevented()) {
                    dockTo.top();
                }
            }
        };

        dockWindow.close = function () {
            var event = new dockWindow.Event("close");
            dockWindow.emit(event);
            if (!event.isDefaultPrevented()) {
                $("body").css("margin-top", beginMargins.top);
                $("body").css("margin-right", beginMargins.right);
                $("body").css("margin-bottom", beginMargins.bottom);
                $("body").css("margin-left", beginMargins.left);
                $dock.detach();
            }
        };

        dockWindow.open = function () {
            var event = new dockWindow.Event("open");
            dockWindow.emit(event);
            if (!event.isDefaultPrevented()) {
                $dock.appendTo(document.body);
            }
        };

        dockWindow.setSize = function (size) {
            dockSize = size;
            dockWindow.dockTo(dockedOn);
        };

        var notifyOn = {
            "top": function (msg, options) {
                msg = msg || "No Message.";
                options = options || {};
                duration = options.duration || 5000;
                color = options.color || "#FFF";
                backgroundColor = options.backgroundColor || "#999";

                var $msg = $notify.find("#msg");
                $msg.html(msg);
                var mregion = $msg.region();
                var windowWidth = $(window).width();

                $notify.css({
                    backgroundColor: backgroundColor,
                    color: color,
                    "top": (dockSize) + "px",
                    left: Math.ceil((windowWidth / 2) - (mregion.width / 2)) + "px",
                    height: "0px",
                    padding: "0px"
                });

                $notify.animate({
                    height: mregion.height + 10
                }, 300, "easeOutCirc", function () {
                    clearTimeout(nTimeout);
                    nTimeout = setTimeout(function () {
                        $notify.animate({
                            height: 0
                        }, 300, "easeOutCirc");
                    }, duration);
                });
            },
            "right": function () { },
            "bottom": function () { },
            "left": function () { }
        };

        var nTimeout;

        dockWindow.notify = function () {
            //console.log(dockedOn);
            notifyOn[dockedOn].apply(dockWindow, arguments);
        };

        this.enableEventEmitting();

        var $dock = dockWindow.$dock = $("<div></div>").css({
            width: "100%",
            height: (dockSize) + "px",
            "box-shadow": "0px 0px 5px #000",
            zIndex: 2000
        }).addClass("web-dock-window");

        var $notify = dockWindow.$notify = $("<div><div id=\"msg\" style=\"margin:5px;\"></div></div>").css({
            "position": "fixed",
            "top": (dockSize) + "px",
            "left": "0px",
            "height": "auto",
            "width": "auto",
            "backgroundColor": "#999",
            "color": "#fff",
            "box-shadow": "0px 2px 2px rgba(0,0,0,0.6)",
            /*
            "border-bottom": "2px solid #fff",
            "border-left": "2px solid #fff",
            "border-right": "2px solid #fff",
            */
            "border-bottom-right-radius": "3px",
            "border-bottom-left-radius": "3px",
            "font-size": "12px",
            "font-weight": "bold",
            "overflow": "hidden",
            "font-family": "'Lucida Grande', 'Lucida Sans Unicode', 'Lucida Sans', Geneva, Verdana, sans-serif"
        }).appendTo($dock);

        var $notifyInset = $("<div></div>").css({
            "box-shadow": "inset -2px 2px 5px rgba(0,0,0,0.4)",
            "width": "120%",
            "height": "5px",
            "position": "absolute",
            "top": "0px",
            "left": "0px"
        }).appendTo($notify);

        dockWindow.dockTo(options.dockTo);

    };

    WEB.DockWindow = DockWindow;
});