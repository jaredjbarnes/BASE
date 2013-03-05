BASE.require(["BASE.ExpressionParser"], function () {
    BASE.namespace("BASE");

    BASE.ODataExpressionParser = (function (Super) {
        var ODataExpressionParser = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ODataExpressionParser();
            }

            Super.call(self);
            var _parsers = {
                "ascending": function (namespace) {
                    return namespace + " asc";
                },
                "descending": function (namespace) {
                    return namespace + " desc";
                },
                "orderBy": function () {
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
                },
                "where": function () {
                    var result = "?$filter=";
                    return result += self.parsers["and"].apply(self.parsers, arguments);
                },
                "and": function () {
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
                },
                "or": function () {
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
                },
                "equal": function (left, right) {
                    var boundary = typeof right === "string" ? "'" : "";
                    return "(" + left + " eq " + boundary + right + boundary + ")";
                },
                "notEqual": function (left, right) {
                    var boundary = typeof right === "string" ? "'" : "";
                    return "(" + left + " ne " + boundary + right + boundary + ")";
                },
                "skip": function () {
                    return "";
                },
                "take": function () {
                    return "";
                }
            };

            Object.defineProperties(self, {
                "parsers": {
                    get: function(){return _parsers;}
                }
            });

            return self;
        };

        BASE.extend(ODataExpressionParser, Super);

        return ODataExpressionParser;
    }(BASE.ExpressionParser));
});