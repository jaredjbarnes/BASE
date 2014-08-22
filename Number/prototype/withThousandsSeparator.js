BASE.require([
    "String.prototype.reverse"
], function () {
    Number.prototype.withThousandsSeparator = function (options) {
        options = options || {};
        var number = this;

        var decimalMark = options.decimalMark || ".";
        var thousandsMark = options.thousandsMark || ",";
        var decimalPrecision = 2;
        if (typeof options.decimalPrecision === "number") {
            decimalPrecision = options.decimalPrecision;
        }
        var fixedNumber = number.toFixed(decimalPrecision);
        var split = fixedNumber.split(".");
        var integer = split[0];
        var decimal = split[1];
        var reversed = integer.reverse();
        var x = 0;
        var result = "";

        while (x < reversed.length) {

            result += reversed.substr(x, 3);

            if (x + 3 < reversed.length) {
                result += thousandsMark;
            }

            x += 3;
        }

        var result = result.reverse();

        if (decimalPrecision > 0) {
            result += decimalMark + decimal;
        }

        return result;;

    };
});

