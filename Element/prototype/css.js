Object.defineProperty(Element.prototype, "css", {
    enumerable: false,
    configurable: true,
    value: function (styleName) {
        var value;

        if (!document.documentElement.contains(this)) {
            value = this.style[styleName];
        } else {
            value = document.defaultView.getComputedStyle(this, null).getPropertyValue(styleName);
        }

        return value;
    }
});

