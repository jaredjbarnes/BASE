String.prototype.toNumber = function () {
    var float;
    var value = this;
    if (!value) {
        value = 0.00;
    }

    float = parseFloat(value.replace(/[^0-9\.\-]+/g, ''));
    if (isNaN(float)) {
        float = 0.00;
    }

    return float;

};