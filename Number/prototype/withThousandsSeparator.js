BASE.require([
    "String.prototype.reverse"
], function () {
    Number.prototype.withThousandsSeparator = function (options) {
        options = options || {};
        var number = this;

        var decimalMark = options.decimalMark || ".";
        var thousandsMark = options.thousandsMark || ",";
        var fixedNumber = number.toFixed(2);
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

        return result.reverse() + decimalMark + decimal;

    };
});

