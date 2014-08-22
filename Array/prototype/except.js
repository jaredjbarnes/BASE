if (!Array.prototype.except) {
    Array.prototype.except = function (array) {
        array = Array.isArray(array) ? array : [];
        return this.filter(function (n) {
            return array.indexOf(n) === -1;
        });
    };
}