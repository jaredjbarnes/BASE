BASE.require([
    "BASE.collections.MultiKeyMap"
], function () {

    BASE.namespace("BASE.data");

    var MultiKeyMap = BASE.collections.MultiKeyMap;

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
        },
        flattenEntity: function (obj) {
            var clone = new obj.constructor();
            var self = this;

            Object.keys(obj).forEach(function (key) {
                var value = obj[key];

                if (BASE.data.utils.isPrimitive(value)) {
                    if (key !== "_hash") {
                        clone[key] = obj[key];
                    }
                } else {
                    clone[key] = undefined;
                }
            });

            return clone;
        },
        convertDtoToJavascriptEntity: function (Type, dto) {
            var entity = new Type();

            for (var x in dto) {
                var objX = x;

                if (x.substr(0, 2) !== x.substr(0, 2).toUpperCase()) {
                    objX = x.substr(0, 1).toLowerCase() + x.substring(1);
                }

                if (BASE.data.utils.isPrimitive(dto[x])) {
                    entity[objX] = dto[x];
                }
            }

            return entity;
        },
        makePrimaryKeyString: function (entity, primaryKeys) {
            var keys = {};
            primaryKeys.forEach(function (primaryKey) {
                keys[primaryKey] = entity[primaryKey];
            });

            return JSON.stringify(keys);
        }
    };

});