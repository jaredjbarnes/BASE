BASE.require([
    "BASE.query.ExpressionVisitor",
    "Date.prototype.format"
], function () {
    BASE.namespace("BASE.query");

    var escapeSingleQuotes = function (value) {
        if (typeof value !== "string") {
            value = value.toString();
        }

        return value.replace("'", "\\'");
    };

    var toJavascriptValue = function (value) {
        if (typeof value === "string") {
            return "'" + escapeSingleQuotes(value) + "'";
        } else if (typeof value === "number") {
            return value.toString();
        } else if (typeof value === "boolean") {
            return value ? "true" : "false";
        } else if (value instanceof Date) {
            return "new Date(" + value.getTime() + ")";
        }
    };

    BASE.query.IndexedDbVisitor = (function (Super) {
        var IndexedDbVisitor = function () {
            var self = this;
            BASE.assertNotGlobal(self);

            Super.call(self);

            return self;
        };

        BASE.extend(IndexedDbVisitor, Super);

        IndexedDbVisitor.prototype["isIn"] = function (property, array) {
            return "(" + array.map(function (value) {
                return property + " === " + value;
            }).join(" || ") + ")";
        };

        IndexedDbVisitor.prototype["ascending"] = function (namespace) {
            namespace = namespace.split(".")[1];
            return "function(itemA, itemB){ var a = itemA." + namespace + ".toString().toLowerCase(); var b = itemB." + namespace + ".toString().toLowerCase(); if (a === b){ return 0; } else if (a < b){ return -1; } else if (a > b){ return 1; }}";
        };

        IndexedDbVisitor.prototype["descending"] = function (namespace) {
            namespace = namespace.split(".")[1];
            return "function(itemA, itemB){ var a = itemA." + namespace + ".toString().toLowerCase(); var b = itemB." + namespace + ".toString().toLowerCase(); if (a === b){ return 0; } else if (a > b){ return -1; } else if (a < b){ return 1; }}";
        };

        IndexedDbVisitor.prototype["orderBy"] = function () {
            var result = Array.prototype.slice.call(arguments, 0);

            if (result.length > 0) {
                fnString = "var returnValue = 0;";
                fnString += "[" + result.join(", ") + "]";
                fnString += ".every(function(orderBy){ returnValue = orderBy(itemA, itemB);  if (returnValue===0){return true;} else {return false;} });";
                fnString += " return returnValue;";
                return new Function("itemA", "itemB", fnString);
            } else {
                return function (a, b) { return -1 };
            }

        };

        IndexedDbVisitor.prototype["where"] = function () {
            var self = this;
            return new Function("entity", "return " + self["and"].apply(self, arguments) + ";");
        };

        IndexedDbVisitor.prototype["and"] = function () {
            var children = Array.prototype.slice.call(arguments, 0);
            var result = [];
            children.forEach(function (expression, index) {
                result.push(expression);
                if (index !== children.length - 1) {
                    result.push(" && ");
                }
            });

            var joined = result.join("");

            if (joined === "") {
                return "";
            }

            return "(" + joined + ")";
        };

        IndexedDbVisitor.prototype["or"] = function () {
            var children = Array.prototype.slice.call(arguments, 0);
            var result = [];
            children.forEach(function (expression, index) {
                result.push(expression);
                if (index !== children.length - 1) {
                    result.push(" || ");
                }
            });

            var joined = result.join("");

            if (joined === "") {
                return "";
            }

            return "(" + joined + ")";
        };

        IndexedDbVisitor.prototype["equalTo"] = function (left, right) {
            return left + " === " + right;
        };

        IndexedDbVisitor.prototype["notEqualTo"] = function (left, right) {
            return left + " !== " + right;
        };

        IndexedDbVisitor.prototype["greaterThan"] = function (left, right) {
            return left + " > " + right;
        };

        IndexedDbVisitor.prototype["lessThan"] = function (left, right) {
            return left + " < " + right;
        };

        IndexedDbVisitor.prototype["greaterThanOrEqualTo"] = function (left, right) {
            return left + " >= " + right;
        };

        IndexedDbVisitor.prototype["lessThanOrEqualTo"] = function (left, right) {
            return left + " <= " + right;
        };

        IndexedDbVisitor.prototype["not"] = function (left, right) {
            return left + " !== " + right;
        };

        IndexedDbVisitor.prototype["constant"] = function (expression) {
            return expression.value;
        };

        IndexedDbVisitor.prototype["property"] = function (expression) {
            var property = expression.value;
            return "entity['" + property + "']";
        };

        IndexedDbVisitor.prototype["substringOf"] = function (namespace, value) {
            return namespace + ".toLowerCase().indexOf(" + value.toString().toLowerCase() + ") >= 0";
        };

        IndexedDbVisitor.prototype["startsWith"] = function (namespace, value) {
            return namespace + ".toLowerCase().indexOf(" + value.toString().toLowerCase() + ") === 0";
        };

        IndexedDbVisitor.prototype["endsWith"] = function (namespace, value) {
            // We have to minus 2 at the end because of the strings single quotes that are put on.
            return namespace + ".toLowerCase().indexOf(" + value.toString().toLowerCase() + ") === " + namespace + ".length - " + (value.length - 2);
        };

        IndexedDbVisitor.prototype["null"] = function (expression) {
            return null;
        };

        IndexedDbVisitor.prototype["date"] = function (expression) {
            return toJavascriptValue(expression.value);
        };

        IndexedDbVisitor.prototype["string"] = function (expression) {
            return toJavascriptValue(expression.value);
        };

        IndexedDbVisitor.prototype["guid"] = IndexedDbVisitor.prototype["string"];

        IndexedDbVisitor.prototype["number"] = function (expression) {
            return toJavascriptValue(expression.value);
        };

        IndexedDbVisitor.prototype["boolean"] = function (expression) {
            return toJavascriptValue(expression.value);
        };

        IndexedDbVisitor.prototype["array"] = function (expression) {
            return expression.value;
        };

        IndexedDbVisitor.prototype["expression"] = function (expression) {
            return expression.value;
        };

        return IndexedDbVisitor;
    }(BASE.query.ExpressionVisitor));

});