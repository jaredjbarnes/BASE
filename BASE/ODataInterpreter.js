BASE.require(["BASE.Observable"], function () {
    BASE.namespace("BASE");

    BASE.ODataInterpreter = (function (Super) {
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
            var result = "?$filter=";
            return result += self.parsers["and"].apply(self.parsers, arguments);
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
            return "(" + left + " eq " + boundary + right + boundary + ")";
        };

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