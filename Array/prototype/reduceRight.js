if (!Array.prototype.hasOwnProperty("reduceRight")){
    Array.prototype.reduceRight = function (fn, initialValue) {
        var i = this.length - 1;

        while (i >= 0)  {
            if (this.hasOwnProperty(i)) {
                initialValue = fn.call(undefined, initialValue, this[i], i, this);
            }
            i -= 1
        }

        return initialValue;
    };
}