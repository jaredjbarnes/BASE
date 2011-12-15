if (!Array.prototype.hasOwnProperty("map")) {
    Array.prototype.map = function (fn, thisp) {
        var i;
        var length = this.length;
        var result = [];

        for (i = 0; i < length; i += 1) {
            if (this.hasOwnProperty(i)) {
                result[i] = fn.call(thisp, this[i], i, this);
            }
        }

        return result;
    };
}