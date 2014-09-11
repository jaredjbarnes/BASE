BASE.require([
    "BASE.query.ExpressionVisitor"
], function () {
    BASE.namespace("BASE.query");

    var toServiceNamespace = function (value) {
        var array = value.split(".");
        var newArray = [];
        var scope = this.scope ? this.scope + "/" : "";

        array.forEach(function (name) {
            newArray.push(scope + name.substr(0, 1).toUpperCase() + name.substring(1));
        });
        return newArray.join(".");
    }

    BASE.query.ODataVisitor = (function (Super) {
        var ODataVisitor = function (scope) {
            var self = this;
            BASE.assertNotGlobal(self);

            Super.call(self);
            self.scope = scope || "";

            self.toServiceNamespace = toServiceNamespace;
            return self;
        };

        BASE.extend(ODataVisitor, Super);

        ODataVisitor.prototype["ascending"] = function (namespace) {
            return namespace + " asc";
        };

        ODataVisitor.prototype["descending"] = function (namespace) {
            return namespace + " desc";
        };

        ODataVisitor.prototype["orderBy"] = function () {
            var result = Array.prototype.slice.call(arguments, 0);
            return "&$orderby=" + result.join(", ");
        };

        ODataVisitor.prototype["count"] = function (left, right) {
            return "&$inlinecount=allpages";
        };

        ODataVisitor.prototype["where"] = function () {
            var self = this;
            return "&$filter=" + self["and"].apply(self.parsers, arguments);
        };

        ODataVisitor.prototype["and"] = function () {
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

        ODataVisitor.prototype["or"] = function () {
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

        ODataVisitor.prototype["equalTo"] = function (left, right) {
            return "(" + left + " eq " + right + ")";
        };

        ODataVisitor.prototype["notEqualTo"] = function (left, right) {
            return "(" + left + " ne " + right + ")";
        };

        ODataVisitor.prototype["constant"] = function (expression) {
            return expression.value;
        };

        ODataVisitor.prototype["property"] = function (expression) {
            return this.toServiceNamespace(expression.value);
        };

        ODataVisitor.prototype["guid"] = function (value) {
            return "guid'" + value.replace("'", "''") + "'";
        };

        ODataVisitor.prototype["substring"] = function (namespace, startAt, endAt) {
            return "substring(" + namespace + " "(startAt ? "," + startAt : "," + 0) + " " + (endAt ? "," + endAt : "") + ")";
        };

        ODataVisitor.prototype["substringOf"] = function (namespace, value) {
            return "substringof(" + value + "," + namespace + ")";
        };

        ODataVisitor.prototype["startsWith"] = function (namespace, value) {
            return "startswith(" + namespace + "," + value + ")";
        };

        ODataVisitor.prototype["endsWith"] = function (namespace, value) {
            return "endswith(" + namespace + "," + value + ")";
        };

        ODataVisitor.prototype["null"] = function (value) {
            return "null";
        };

        ODataVisitor.prototype["undefined"] = function (value) {
            return "undefined";
        };

        ODataVisitor.prototype["date"] = function (expression) {
            return "DateTime" + JSON.stringify(expression.value).replace(/"/g, "'") + "";
        };

        ODataVisitor.prototype["string"] = function (expression) {
            return "'" + expression.value.replace("'", "''") + "'";
        };

        ODataVisitor.prototype["number"] = function (expression) {
            return expression.value.toString();
        };

        ODataVisitor.prototype["boolean"] = function (expression) {
            return expression.value.toString();
        };

        ODataVisitor.prototype["all"] = function (property, expression) {
            var parser = new ODataVisitor("entity");
            return property + "/all(entity: " + parser.parse(expression) + ")";
        };

        ODataVisitor.prototype["any"] = function (property, expression) {
            var parser = new ODataVisitor("entity");
            return property + "/any(entity: " + parser.parse(expression) + ")";
        };

        ODataVisitor.prototype["expression"] = function (expression) {
            return expression.value;
        };

        ODataVisitor.prototype["array"] = function (expression) {

        }

        ODataVisitor.prototype["greaterThan"] = function (left, right) {
            return "(" + left + " gt " + right + ")";
        };

        ODataVisitor.prototype["lessThan"] = function (left, right) {
            var boundary = typeof right.value === "string" ? "'" : "";
            return "(" + left + " lt " + right + ")";
        };

        ODataVisitor.prototype["greaterThanOrEqualTo"] = function (left, right) {
            var boundary = typeof right.value === "string" ? "'" : "";
            return "(" + left + " ge " + right + ")";
        };

        ODataVisitor.prototype["lessThanOrEqualTo"] = function (left, right) {
            var boundary = typeof right.value === "string" ? "'" : "";
            return "(" + left + " le " + right + ")";
        };

        ODataVisitor.prototype["not"] = function (left, right) {
            var boundary = typeof right.value === "string" ? "'" : "";
            return "(" + left + " not " + right + ")";
        };

        ODataVisitor.prototype["skip"] = function (value) {
            return "&$skip=" + value;
        };

        ODataVisitor.prototype["take"] = function (value) {
            return "&$top=" + value;
        };

        return ODataVisitor;
    }(BASE.query.ExpressionVisitor));
});