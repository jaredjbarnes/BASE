if (!Element.prototype.empty) {
    Element.prototype.empty = function () {
        var self = this;
        while (self.childNodes.length > 0) {
            self.removeChild(self.lastChild);
        }
    };
}