BASE.require(["BASE.util.Observable"], function () {
    BASE.namespace("BASE.query");

    var toServiceNamespace = function (value) {
        var array = value.split(".");
        var newArray = [];
        array.forEach(function (name) {
            newArray.push(name.substr(0, 1).toUpperCase() + name.substring(1));
        });
        return newArray.join(".");
    }

    BASE.query.ODataQueryBuilder = (function (Super) {
        var ODataQueryBuilder = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ODataQueryBuilder();
            }

            Super.call(self);
            self.toServiceNamespace = toServiceNamespace;
            return self;
        };

        BASE.extend(ODataQueryBuilder, Super);

        ODataQueryBuilder.prototype["ascending"] = function (namespace) {
            return namespace + " asc";
        };

        ODataQueryBuilder.prototype["descending"] = function (namespace) {
            return namespace + " desc";
        };

        ODataQueryBuilder.prototype["orderBy"] = function () {
            var result = Array.prototype.slice.call(arguments, 0);
            return "&$orderby=" + result.join(", ");
        };

        ODataQueryBuilder.prototype["count"] = function (left, right) {
            return "&$inlinecount=allpages";
        };

        ODataQueryBuilder.prototype["where"] = function () {
            var self = this;
            return "&$filter=" + self["and"].apply(self.parsers, arguments);
        };

        ODataQueryBuilder.prototype["and"] = function () {
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

        ODataQueryBuilder.prototype["or"] = function () {
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

        ODataQueryBuilder.prototype["equal"] = function (left, right) {
            return "(" + left + " eq " + right + ")";
        };

        ODataQueryBuilder.prototype["notEqual"] = function (left, right) {
            return "(" + left + " ne " + right + ")";
        };

        ODataQueryBuilder.prototype["constant"] = function (expression) {
            return expression.value;
        };

        ODataQueryBuilder.prototype["property"] = function (expression) {
            return toServiceNamespace(expression.value);
        };

        ODataQueryBuilder.prototype["guid"] = function (value) {
            return "guid'" + value.replace("'", "''") + "'";
        };

        ODataQueryBuilder.prototype["substring"] = function (namespace, startAt, endAt) {
            return "substring(" + namespace + " "(startAt ? "," + startAt : "," + 0) + " " + (endAt ? "," + endAt : "") + ")";
        };

        ODataQueryBuilder.prototype["substringOf"] = function (namespace, value) {
            return "substringof(" + value + "," + namespace + ")";
        };

        ODataQueryBuilder.prototype["startsWith"] = function (namespace, value) {
            return "startswith(" + namespace + "," + value + ")";
        };

        ODataQueryBuilder.prototype["endsWith"] = function (namespace, value) {
            return "endswith(" + namespace + "," + value + ")";
        };

        ODataQueryBuilder.prototype["null"] = function (value) {
            return "null";
        };

        ODataQueryBuilder.prototype["undefined"] = function (value) {
            return "undefined";
        };

        ODataQueryBuilder.prototype["date"] = function (expression) {
            return "DateTime" + JSON.stringify(expression.value).replace(/"/g, "'") + "";
        };

        ODataQueryBuilder.prototype["string"] = function (expression) {
            return "'" + expression.value.replace("'", "''") + "'";
        };

        ODataQueryBuilder.prototype["number"] = function (expression) {
            return expression.value.toString();
        };

        ODataQueryBuilder.prototype["boolean"] = function (expression) {
            return expression.value.toString();
        };

        ODataQueryBuilder.prototype["array"] = function (expression) {

        }

        ODataQueryBuilder.prototype["greaterThan"] = function (left, right) {
            return "(" + left + " gt " + right + ")";
        };

        ODataQueryBuilder.prototype["lessThan"] = function (left, right) {
            var boundary = typeof right.value === "string" ? "'" : "";
            return "(" + left + " lt " + right + ")";
        };

        ODataQueryBuilder.prototype["greaterThanOrEqual"] = function (left, right) {
            var boundary = typeof right.value === "string" ? "'" : "";
            return "(" + left + " ge " + right + ")";
        };

        ODataQueryBuilder.prototype["lessThanOrEqual"] = function (left, right) {
            var boundary = typeof right.value === "string" ? "'" : "";
            return "(" + left + " le " + right + ")";
        };

        ODataQueryBuilder.prototype["not"] = function (left, right) {
            var boundary = typeof right.value === "string" ? "'" : "";
            return "(" + left + " not " + right + ")";
        };

        ODataQueryBuilder.prototype["skip"] = function (value) {
            return "&$skip=" + value;
        };

        ODataQueryBuilder.prototype["take"] = function (value) {
            return "&$top=" + value;
        };

        return ODataQueryBuilder;
    }(BASE.util.Observable));
});