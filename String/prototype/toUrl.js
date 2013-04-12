BASE.require(["BASE.web.Url"], function () {

    Object.defineProperty(String.prototype, "toUrl", {
        enumerable: false,
        writable: false,
        value: function () {
            return BASE.web.Url.parse(this.toString());
        }
    });

});