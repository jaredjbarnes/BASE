Array.prototype.empty = function () {
    while (this.length > 0) {
        this.pop();
    }
};