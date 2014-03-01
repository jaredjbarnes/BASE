if (!Array.prototype.hasOwnProperty("indexOf")) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        var i = fromIndex || 0;
        var length = this.length;

        while (i < length) {
            if (this.hasOwnProperty(i) && this[i] === searchElement) {
                return i;
            }
            i += 1;
        }
        return -1;
    };
}