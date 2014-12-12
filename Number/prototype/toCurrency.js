BASE.require(["Number.prototype.withThousandsSeparator"], function () {
    Number.prototype.toCurrency = function (currencySymbol, options) {
        currencySymbol = currencySymbol || "$";
        options = options || { decimalPrecision: 2 };
        if (this < 0) {
            var positive = this * -1;
            var withThousands = positive.withThousandsSeparator(options);
            return "-" + currencySymbol + withThousands;
        }
        return currencySymbol + this.withThousandsSeparator(options);
    };
});
