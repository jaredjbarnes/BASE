if (!Array.prototype.hasOwnProperty("some")){
    Array.prototype.some = function (fn, thisp) {
        var i;
        var length = this.length;
        for (i = 0; i < length; i += 1) {
            if (this.hasOwnProperty(i) && !fn.call(thisp, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };
}