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
            return self;
        };

        BASE.extend(ODataInterpreter, Super);

        ODataInterpreter.prototype["ascending"] = function (namespace) {
            return toServiceNamespace(namespace) + " asc";
        };

        ODataInterpreter.prototype["descending"] = function (namespace) {
            return toServiceNamespace(namespace) + " desc";
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
            result.unshift("(");
            result.push(")");
            return result.join("");
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
            result.unshift("(");
            result.push(")");
            return result.join("");
        };

        //todo: maybe map the operator to the odata operater here
        var operatorMapping = {
            "equal": "eq",
            "notEqual": "ne"
        };

        ODataInterpreter.prototype["equal"] = function (left, right) {
            var boundary = typeof right === "string" ? "'" : "";
            return "(" + toServiceNamespace(left) + " eq " + right + ")";
        };

        ODataInterpreter.prototype["guid"] = function (value) {
            return "guid '" + value + "'";
        };

        ODataInterpreter.prototype["null"] = function (value) {
            return "null";
        };

        ODataInterpreter.prototype["string"] = function (value) {
            return "'" + value + "'";
        };

        ODataInterpreter.prototype["number"] = function (value) {
            return value.toString();
        };

        ODataInterpreter.prototype["notEqual"] = function (left, right) {
            var boundary = typeof right === "string" ? "'" : "";
            return "(" + toServiceNamespace(left) + " ne " + boundary + right + boundary + ")";
        };

        ODataInterpreter.prototype["greaterThan"] = function (left, right) {
            var boundary = typeof right === "string" ? "'" : "";
            return "(" + toServiceNamespace(left) + " gt " + boundary + right + boundary + ")";
        };

        ODataInterpreter.prototype["lessThan"] = function (left, right) {
            var boundary = typeof right === "string" ? "'" : "";
            return "(" + toServiceNamespace(left) + " lt " + boundary + right + boundary + ")";
        };

        ODataInterpreter.prototype["greaterThanOrEqual"] = function (left, right) {
            var boundary = typeof right === "string" ? "'" : "";
            return "(" + toServiceNamespace(left) + " ge " + boundary + right + boundary + ")";
        };

        ODataInterpreter.prototype["lessThanOrEqual"] = function (left, right) {
            var boundary = typeof right === "string" ? "'" : "";
            return "(" + toServiceNamespace(left) + " le " + boundary + right + boundary + ")";
        };

        ODataInterpreter.prototype["not"] = function (left, right) {
            var boundary = typeof right === "string" ? "'" : "";
            return "(" + toServiceNamespace(left) + " not " + boundary + right + boundary + ")";
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