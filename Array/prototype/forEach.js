if (!Array.prototype.hasOwnProperty("forEach")) {
    Array.prototype.forEach = function (fn, thisp) {
        var i;
        var length = this.length;
        var result = [];

        for (i = 0; i < length; i += 1) {
            if (this.hasOwnProperty(i)) {
                fn.call(thisp, this[i], i, this);
            }
        }
        return result;
    };
}