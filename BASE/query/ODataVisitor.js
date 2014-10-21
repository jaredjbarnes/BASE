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
    };

    var toLocal = function (str) {
        return str.substr(0, 1).toLowerCase() + str.substring(1);
    };

    var getOdataValue = function (value) {
        if (typeof value === "string") {
            return "'" + value + "'";
        } else if (typeof value === "boolean") {
            return value.toString();
        } else if (typeof value === "number") {
            return value.toString();
        } else if (value instanceof Date) {
            var dateString = value.toISOString();
            dateString = dateString.substr(0, dateString.length - 1);
            dateString += "-00:00";
            return "DateTime'" + dateString + "'";
        } else if (value === null) {
            return "null";
        } else {
            return value;
        }
    };

    BASE.query.ODataVisitor = (function (Super) {
        var ODataVisitor = function (config) {
            var self = this;
            BASE.assertNotGlobal(self);

            Super.call(self);
            config = config || {};
            self.scope = config.scope || "";
            var model = self.model = config.model || { properties: {} };

            self.toServiceNamespace = toServiceNamespace;
            self.getValue = function (key, value) {
                var property = model.properties[toLocal(key)];
                if (property) {
                    if (value === null) {
                        return "null";
                    }
                    if (property.type === Date) {
                        var dateString = value.toISOString();
                        dateString = dateString.substr(0, dateString.length - 1);
                        dateString += "-00:00";
                        return "DateTime'" + dateString + "'";
                    } else if (property.type === DateTimeOffset) {
                        var dateString = value.toISOString();
                        dateString = dateString.substr(0, dateString.length - 1);
                        dateString += "-00:00";
                        return "DateTimeOffset'" + dateString + "'";
                    } else if (property.type === Number) {
                        return value.toString();
                    } else if (property.type === String) {
                        return "'" + value + "'";
                    } else if (property.type === Boolean) {
                        return value.toString();
                    } else {
                        return value;
                    }
                } else {
                    return getOdataValue(value);
                }
            };
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
            return "(" + left + " eq " + this.getValue(left, right) + ")";
        };

        ODataVisitor.prototype["notEqualTo"] = function (left, right) {
            return "(" + left + " ne " + this.getValue(left, right) + ")";
        };

        ODataVisitor.prototype["constant"] = function (expression) {
            return expression.value;
        };

        ODataVisitor.prototype["property"] = function (expression) {
            return this.toServiceNamespace(expression.value);
        };

        ODataVisitor.prototype["guid"] = function (expression) {
            return expression.value;
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

        ODataVisitor.prototype["null"] = function (expression) {
            return null;
        };

        ODataVisitor.prototype["undefined"] = function (expression) {
            return expression.value;
        };

        ODataVisitor.prototype["date"] = function (expression) {
            return expression.value;
        };

        ODataVisitor.prototype["string"] = function (expression) {
            return expression.value;
        };

        ODataVisitor.prototype["number"] = function (expression) {
            return expression.value;
        };

        ODataVisitor.prototype["boolean"] = function (expression) {
            return expression.value;
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
            return "(" + left + " gt " + this.getValue(left, right) + ")";
        };

        ODataVisitor.prototype["lessThan"] = function (left, right) {
            var boundary = typeof right.value === "string" ? "'" : "";
            return "(" + left + " lt " + this.getValue(left, right) + ")";
        };

        ODataVisitor.prototype["greaterThanOrEqualTo"] = function (left, right) {
            var boundary = typeof right.value === "string" ? "'" : "";
            return "(" + left + " ge " + this.getValue(left, right) + ")";
        };

        ODataVisitor.prototype["lessThanOrEqualTo"] = function (left, right) {
            var boundary = typeof right.value === "string" ? "'" : "";
            return "(" + left + " le " + this.getValue(left, right) + ")";
        };

        ODataVisitor.prototype["not"] = function (left, right) {
            var boundary = typeof right.value === "string" ? "'" : "";
            return "(" + left + " not " + this.getValue(left, right) + ")";
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