BASE.require(["Number.prototype.withThousandsSeparator"], function () {
    Number.prototype.toCurrency = function (currencySymbol, options) {
        currencySymbol = currencySymbol || "$";
        return currencySymbol + this.withThousandsSeparator(options);
    };
});
