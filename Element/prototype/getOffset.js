Object.defineProperty(Element.prototype, "getOffset", {
    enumerable: false,
    configurable: true,
    value: function () {
        var box = this.getBoundingClientRect();
        var offset = {
            top: box.top + (window.pageYOffset || document.documentElement.scrollTop) - (document.documentElement.clientTop || 0),
            left: box.left + (window.pageXOffset || document.documentElement.scrollLeft) - (document.documentElement.clientLeft || 0)
        };

        return offset;
    }
});
