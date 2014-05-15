BASE.require(["Element.prototype.getOffset"], function () {

    var getRealOffsetParent = function (element) {
        var offsetParent = element.offsetParent || document.documentElement;
        while (offsetParent && (!(offsetParent.nodeName.toLowerCase() === "html") && offsetParent.css("display") === "static")) {
            offsetParent = offsetParent.offsetParent;
        }
        return offsetParent || document.documentElement;
    };

    Object.defineProperty(Element.prototype, "position", {
        enumerable: false,
        configurable: true,
        value: function () {

            var offsetParent;
            var offset;
            var parentOffset = { top: 0, left: 0 };
            var self = this;

            // fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is it's only offset parent
            if (self.css("position") === "fixed") {
                // we assume that getBoundingClientRect is available when computed position is fixed
                offset = elem.getBoundingClientRect();
            } else {
                // Get *real* offsetParent
                offsetParent = getRealOffsetParent(self);

                // Get correct offsets
                offset = this.getOffset();
                if (!(offsetParent.nodeName.toLowerCase() === "html")) {
                    parentOffset = offsetParent.getOffset();
                }

                // Add offsetParent borders
                // TODO: I don't think that this will work when the box-sizing is equal to border-box
                parentOffset.top += parseInt(offsetParent.css("borderTopWidth") || 0, 10);
                parentOffset.left += parseInt(offsetParent.css("borderLeftWidth") || 0, 10);
            }

            // Subtract parent offsets and element margins
            // note: when an element has margin: auto the offsetLeft and marginLeft
            // are the same in Safari causing offset.left to incorrectly be 0
            return {
                top: offset.top - parentOffset.top - parseInt(self.css("marginTop") || 0, 10),
                left: offset.left - parentOffset.left - parseInt(self.css("marginLeft") || 0, 10)
            };
        }
    });

});



