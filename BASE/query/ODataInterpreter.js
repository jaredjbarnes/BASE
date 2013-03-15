BASE.require(["BASE.Observable"], function () {
    BASE.namespace("BASE.query");

    var toServiceNamespace = function (value) {
        var array = value.split(".");
        var newArray = [];
        array.forEach(function (name) {
            newArray.push(name.substr(0, 1).toUpperCase() + name.substring(1));
        });
        return newArray.join(".");
    }

    BASE.query.ODataInterpreter = (function (Super) {
        var ODataInterpreter = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ODataInterpreter();
            }

            Super.call(self);
            self.toServiceNamespace = toServiceNamespace;
            return self;
        };

        BASE.extend(ODataInterpreter, Super);

        ODataInterpreter.prototype["ascending"] = function (namespace) {
            return namespace + " asc";
        };

        ODataInterpreter.prototype["descending"] = function (namespace) {
            return namespace + " desc";
        };

        ODataInterpreter.prototype["orderBy"] = function () {
            var result = "&$orderby=";

            var children = Array.prototype.slice.call(arguments, 0);
            var result = [];
            children.forEach(function (expression, index) {
                result.push(expression);
                if (index !== children.length - 1) {
                    result.push(", ");
                }
            });
            return result.join("");
        };

        ODataInterpreter.prototype["where"] = function () {
            var self = this;
            return self["and"].apply(self.parsers, arguments);
        };

        ODataInterpreter.prototype["and"] = function () {
            var children = Array.prototype.slice.call(arguments, 0);
            var result = [];
            children.forEach(function (expression, index) {
                result.push(expression);
                if (index !== children.length - 1) {
                    result.push(" and ");
                }
            });

            var joined = result.join("");

            if (joined === "") {
                return "";
            }

            return "(" + joined + ")";
        };

        ODataInterpreter.prototype["or"] = function () {
            var children = Array.prototype.slice.call(arguments, 0);
            var result = [];
            children.forEach(function (expression, index) {
                result.push(expression);
                if (index !== children.length - 1) {
                    result.push(" or ");
                }
            });

            var joined = result.join("");

            if (joined === "") {
                return "";
            }

            return "(" + joined + ")";
        };

        //todo: maybe map the operator to the odata operater here
        var operatorMapping = {
            "equal": "eq",
            "notEqual": "ne"
        };

        ODataInterpreter.prototype["equal"] = function (left, right) {
            var boundary = typeof right === "string" ? "'" : "";
            return "(" + left + " eq " + right + ")";
        };

        ODataInterpreter.prototype["constant"] = function (expression) {
            return expression.value;
        };

        ODataInterpreter.prototype["property"] = function (expression) {
            return toServiceNamespace(expression.value);
        };

        ODataInterpreter.prototype["guid"] = function (value) {
            return "guid'" + value.replace("'", "''") + "'";
        };

        ODataInterpreter.prototype["substring"] = function (namespace, startAt, endAt) {
            return "substring(" + namespace + " "(startAt ? "," + startAt : "," + 0) + " " + (endAt ? "," + endAt : "") + ")";
        };

        ODataInterpreter.prototype["substringOf"] = function (namespace, value) {
            return "substringof(" + value + "," + namespace + ")";
        };

        ODataInterpreter.prototype["startsWith"] = function (namespace, value) {
            return "startswith(" + namespace + "," + value + ")";
        };

        ODataInterpreter.prototype["endsWith"] = function (namespace, value) {
            return "endswith(" + namespace + "," + value + ")";
        };

        ODataInterpreter.prototype["null"] = function (value) {
            return "null";
        };

        ODataInterpreter.prototype["string"] = function (value) {
            return "'" + value.replace("'", "''") + "'";
        };

        ODataInterpreter.prototype["number"] = function (value) {
            return value.toString();
        };

        ODataInterpreter.prototype["boolean"] = function (value) {
            return value.toString();
        };

        ODataInterpreter.prototype["array"] = function (expression) {

        }

        ODataInterpreter.prototype["notEqual"] = function (left, right) {
            var boundary = typeof right === "string" ? "'" : "";
            return "(" + left + " ne " + boundary + right + boundary + ")";
        };

        ODataInterpreter.prototype["greaterThan"] = function (left, right) {
            var boundary = typeof right === "string" ? "'" : "";
            return "(" + left + " gt " + boundary + right + boundary + ")";
        };

        ODataInterpreter.prototype["lessThan"] = function (left, right) {
            var boundary = typeof right === "string" ? "'" : "";
            return "(" + left + " lt " + boundary + right + boundary + ")";
        };

        ODataInterpreter.prototype["greaterThanOrEqual"] = function (left, right) {
            var boundary = typeof right === "string" ? "'" : "";
            return "(" + left + " ge " + boundary + right + boundary + ")";
        };

        ODataInterpreter.prototype["lessThanOrEqual"] = function (left, right) {
            var boundary = typeof right === "string" ? "'" : "";
            return "(" + left + " le " + boundary + right + boundary + ")";
        };

        ODataInterpreter.prototype["not"] = function (left, right) {
            var boundary = typeof right === "string" ? "'" : "";
            return "(" + left + " not " + boundary + right + boundary + ")";
        };

        ODataInterpreter.prototype["skip"] = function (value) {
            return value;
        };

        ODataInterpreter.prototype["take"] = function (value) {
            return value;
        };

        return ODataInterpreter;
    }(BASE.Observable));
});