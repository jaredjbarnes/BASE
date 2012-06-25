if (!String.prototype.hasOwnProperty("trim")) {

    String.prototype.trim = (function (re) {
        return function () {
            return this.replace(re, "$1");
        };
    })(/^\s*(\S*(\s+\S)*)\s*$/);

}