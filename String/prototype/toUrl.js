BASE.require(["BASE.web.Url"], function () {

    String.prototype.toUrl = function () {
        return BASE.web.Url.parse(this.toString());
    };

});