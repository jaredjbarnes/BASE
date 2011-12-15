if (!Array.prototype.hasOwnProperty("reduce")){
    Array.prototype.reduce = function (fn, initialValue) {
        var i;
        var length = this.length;

        for (i = 0; i < length; i += 1) {
            if (this.hasOwnProperty(i)) {
                initialValue = fn.call(undefined, initialValue, this[i], i, this);
            }
        }

        return initialValue;
    };
}