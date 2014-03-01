if (!Array.prototype.hasOwnProperty("filter")) {
    Array.prototype.filter = function (fn, thisp) {
        var i;
        var length = this.length;
        var result = [];
        var value;

        for (i = 0; i < length; i += 1) {
            if (this.hasOwnProperty(i)) {
                value = this[i];
                if (fn.call(thisp, value, i, this)) {
                    result.push(value);
                }
            }
        }
        return result;
    };
}