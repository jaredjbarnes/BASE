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
                        marginTop: dockSize + "px"
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
                        marginRight: dockSize + "px"
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
                        marginBottom: dockSize + "px"
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
                        marginLeft: dockSize + "px"
                    });
                    $dock.css({
                        position: "fixed",
                        top: "0px",
                        right: "0px",
                        width: dockSize + "px",
                        height: "100%",
                        bottom: ""
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

        this.enableEventEmitting();

        var $dock = dockWindow.$dock = $("<div></div>").css({
            width: "100%",
            height: (dockSize) + "px",
            "box-shadow": "0px 0px 5px #000",
            zIndex: 2000
        }).addClass("web-dock-window");

        dockWindow.dockTo(options.dockTo);

    };

    WEB.DockWindow = DockWindow;
});