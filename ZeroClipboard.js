/// <reference path="/scripts/BASE.js" />
/// <reference path="/scripts/jQuery.js" />
/// <reference path="/scripts/BASE/enableEventEmitting.js" />
/// <reference path="/scripts/Array/prototype/forEach.js" />

BASE.require(["jQuery", "BASE.enableEventEmitting", "Array.prototype.forEach"], function () {

    //Private Methods
    var getSwfHTML = function () {
        var width = 500;
        var height = 500;

        var html = '';
        var flashvars = 'id=ZeroCliboardId&width=' + width + '&height=' + height;

        if (navigator.userAgent.match(/MSIE/)) {
            // IE gets an OBJECT tag
            var protocol = getProtocol();
            html += '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="' + protocol + 'download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0" width="' + width + '" height="' + height + '" id="ZeroCliboardId" align="middle"><param name="allowScriptAccess" value="always" /><param name="allowFullScreen" value="false" /><param name="movie" value="' + window.ZeroClipboard.settings.swfPath + '" /><param name="loop" value="false" /><param name="menu" value="false" /><param name="quality" value="best" /><param name="bgcolor" value="#ffffff" /><param name="flashvars" value="' + flashvars + '"/><param name="wmode" value="transparent"/></object>';
        } else {
            // all other browsers get an EMBED tag
            html += '<embed id="ZeroCliboardId" src="' + window.ZeroClipboard.settings.swfPath + '" loop="false" menu="false" quality="best" bgcolor="#ffffff" width="' + width + '" height="' + height + '" name="ZeroCliboardId" align="middle" allowScriptAccess="always" allowFullScreen="false" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/go/getflashplayer" flashvars="' + flashvars + '" wmode="transparent" />';
        }
        return html;
    }

    var getProtocol = function () {
        return location.href.match(/^https/i) ? 'https://' : 'http://';
    };

    var getPath = function () {
        return getProtocol() + "webcontent.leavitt.com/js/scripts/Utils/Flash/ZeroClipboard.swf";
    };

    //End of Private Methods.
    window.ZeroClipboard = {
        setText: function (text) {
            if (this.$swf && this.$obj[0] && this.$obj[0].setText) {
                this.$obj[0].setText(text);
            }
        },
        $swfObject: null,
        $active: null,
        $swf: null,
        settings: {
            swfPath: getPath()
        },
        dispatch: function (id, eventName, args) {
            var event = new $.Event("zclip" + eventName.toLowerCase());
            event.args = args;
            event.zclip = true;
            this.$active.trigger(event);
        },
        hide: function () {
            this.$swf.css({
                left: "-2000px"
            });
        },
        createSwf: function () {
            var self = this;
            if ($("#zclip-swf").length === 0) {
                self.$swf = $("<div></div>").attr("id", "zclip-swf").css({
                    position: "absolute",
                    width: "10px",
                    height: "10px",
                    zIndex: 5000,
                    overflow: "hidden",
                    top: "0px",
                    left: "-2000px"
                }).appendTo(document.body);

                self.$swf.html(getSwfHTML());

                if (self.$swf) {
                    self.$obj = self.$swf.find("#ZeroCliboardId");
                }

            }
        }
    };

});

