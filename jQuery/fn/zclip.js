/// <reference path="/scripts/BASE.js" />
/// <reference path="/scripts/jQuery.js" />
/// <reference path="/scripts/ZeroClipboard.js" />
/// <reference path="/scripts/jQuery/fn/region.js" />

BASE.require(["jQuery", "ZeroClipboard", "jQuery.fn.region"], function () {

    jQuery.fn.zclip = function (options) {
        options = options || {};
        if ($.browser.msie) {
            return this.each(function () {

                var $this = $(this);

                $this.bind("mousedown", function () {
                    var event = new $.Event("beforeCopy");
                    event.zclip = true;
                    $this.trigger(event);
                });

                $this.bind("mouseup", function () {
                    if (typeof options.copy === "function") {
                        window.clipboardData.setData("Text", options.copy.call($this[0]));
                    } else if (typeof options.copy === "string") {
                        window.clipboardData.setData("Text", options.copy);
                    }

                    var event = new $.Event("afterCopy");
                    event.zclip = true;
                    $this.trigger(event);
                });
            });
        } else {

            ZeroClipboard.settings.swfPath = options.path ? options.path : ZeroClipboard.settings.swfPath;
            ZeroClipboard.createSwf();

            return this.each(function () {
                var $this = $(this);

                if (typeof options.beforeCopy === "function") {
                    $this.bind("beforeCopy", options.beforeCopy);
                }

                if (typeof options.afterCopy === "function") {
                    $this.bind("afterCopy", options.afterCopy);
                }

                $this.bind("mouseenter", function (e) {
                    ZeroClipboard.$active = $this;
                    var obj = $this[0];
                    var region = $this.region();

                    if (ZeroClipboard.$obj && ZeroClipboard.$obj[0].setHandCursor) {
                        ZeroClipboard.$obj[0].setHandCursor(options.showHandCursor ? true : false);
                    }

                    ZeroClipboard.$swf.offset(region).css({
                        width: region.width,
                        height: region.height
                    });

                    ZeroClipboard.$obj.css({
                        width: region.width,
                        height: region.height
                    });

                    if (typeof options.copy === "function") {
                        ZeroClipboard.setText(options.copy.call($this[0]));
                    } else if (typeof options.copy === "string") {
                        ZeroClipboard.setText(options.copy);
                    }

                    var event = new $.Event("beforeCopy");
                    event.zclip = true;
                    $this.trigger(event);

                });

                $this.bind("zclipmouseout", function (e) {

                    ZeroClipboard.hide();

                    var event = new $.Event("mouseout");
                    event.zclip = true;
                    ZeroClipboard.$active.trigger(event);

                });

                $this.bind("zclipmouseover", function () {
                    var event = new $.Event("mouseover");
                    event.zclip = true;
                    ZeroClipboard.$active.trigger(event);
                });

                $this.bind("zclipcomplete", function (e) {
                    if (e.zclip) {
                        var event = new $.Event("afterCopy");
                        event.zclip = true;
                        $this.trigger(event);
                    }
                });

            });
        }
    }

});