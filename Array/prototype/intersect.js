if (!Array.prototype.intersect) {
    Object.defineProperty(Array.prototype, "intersect", {
        enumerable: false,
        configurable: true,
        value: function (array) {
            array = Array.isArray(array) ? array : [];
            return this.filter(function (n) {
                return array.indexOf(n) != -1;
            });
        }
    });
}