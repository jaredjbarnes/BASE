BASE.require([], function () {

    BASE.namespace("BASE.data");

    BASE.data.utils = {
        isPrimitive: function (value) {

            if (typeof value === "number" ||
                typeof value === "string" ||
                typeof value === "boolean" ||
                value instanceof Date ||
                value === null) {

                return true;

            }

            return false;
        }
    };

});