BASE.require(["Date.prototype.format"], function () {
    Date.prototype.toISOString = function () {
        return this.format("isoDateTime");
    }
});