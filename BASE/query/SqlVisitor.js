BASE.require([
    "BASE.query.ExpressionVisitor",
    "Date.prototype.format"
], function () {
    BASE.namespace("BASE.query");

    var escapeSingleQuotes = function (value) {
        if (typeof value !== "string") {
            value = value.toString();
        }

        return value.replace("'", "''");
    };

    var sqlizePrimitive = function (value) {

        if (typeof value === "string") {
            return "'" + escapeSingleQuotes(value) + "'";
        } else if (typeof value === "number") {
            return value.toString();
        } else if (typeof value === "boolean") {
            return value ? 1 : 0;
        } else if (value instanceof Date) {
            return value.getTime();
        }

    };

    BASE.query.SqlVisitor = (function (Super) {
        var SqlVisitor = function (tableName, model) {
            var self = this;
            BASE.assertNotGlobal(self);

            Super.call(self);
            self.model = model;
            self.tableName = tableName;

            return self;
        };

        BASE.extend(SqlVisitor, Super);

        SqlVisitor.prototype["isIn"] = function (property, array) {
            return "(" + array.map(function (value) {
                return property + " = " + value;
            }).join(" OR ") + ")";
        };

        SqlVisitor.prototype["ascending"] = function (namespace) {
            return namespace + " ASC";
        };

        SqlVisitor.prototype["descending"] = function (namespace) {
            return namespace + " DESC";
        };

        SqlVisitor.prototype["orderBy"] = function () {
            var result = Array.prototype.slice.call(arguments, 0);
            return "ORDER BY " + result.join(", ");
        };

        SqlVisitor.prototype["count"] = function (left, right) {
            throw new Error("Not yet implemented.");
        };

        SqlVisitor.prototype["where"] = function () {
            var self = this;
            return "WHERE " + self["and"].apply(self, arguments);
        };

        SqlVisitor.prototype["and"] = function () {
            var children = Array.prototype.slice.call(arguments, 0);
            var result = [];
            children.forEach(function (expression, index) {
                result.push(expression);
                if (index !== children.length - 1) {
                    result.push(" AND ");
                }
            });

            var joined = result.join("");

            if (joined === "") {
                return "";
            }

            return "(" + joined + ")";
        };

        SqlVisitor.prototype["or"] = function () {
            var children = Array.prototype.slice.call(arguments, 0);
            var result = [];
            children.forEach(function (expression, index) {
                result.push(expression);
                if (index !== children.length - 1) {
                    result.push(" OR ");
                }
            });

            var joined = result.join("");

            if (joined === "") {
                return "";
            }

            return "(" + joined + ")";
        };

        SqlVisitor.prototype["equalTo"] = function (left, right) {
            if (right === null) {
                return left + " IS NULL";
            } else {
                return left + " = " + sqlizePrimitive(right);
            }
        };

        SqlVisitor.prototype["notEqualTo"] = function (left, right) {
            if (right === null) {
                return left + " IS NOT NULL";
            } else {
                return left + " != " + sqlizePrimitive(right);
            }
        };

        SqlVisitor.prototype["greaterThan"] = function (left, right) {
            return left + " > " + sqlizePrimitive(right);
        };

        SqlVisitor.prototype["lessThan"] = function (left, right) {
            return left + " < " + sqlizePrimitive(right);
        };

        SqlVisitor.prototype["greaterThanOrEqualTo"] = function (left, right) {
            return left + " >= " + sqlizePrimitive(right);
        };

        SqlVisitor.prototype["lessThanOrEqualTo"] = function (left, right) {
            return left + " <= " + sqlizePrimitive(right);
        };

        SqlVisitor.prototype["not"] = function (left, right) {
            return left + " NOT " + right;
        };

        SqlVisitor.prototype["skip"] = function (value) {
            return " OFFSET " + value;
        };

        SqlVisitor.prototype["take"] = function (value) {
            return " LIMIT " + (value || -1);
        };

        SqlVisitor.prototype["constant"] = function (expression) {
            return expression.value;
        };

        SqlVisitor.prototype["property"] = function (expression) {
            var property = expression.value;
            return property;
        };

        SqlVisitor.prototype["substringOf"] = function (namespace, value) {
            return namespace + " LIKE '%" + escapeSingleQuotes(value) + "%'";
        };

        SqlVisitor.prototype["startsWith"] = function (namespace, value) {
            return namespace + " LIKE '" + escapeSingleQuotes(value) + "%'";
        };

        SqlVisitor.prototype["endsWith"] = function (namespace, value) {
            return namespace + " LIKE '%" + escapeSingleQuotes(value) + "'";
        };

        SqlVisitor.prototype["null"] = function (expression) {
            return null;
        };

        SqlVisitor.prototype["date"] = function (expression) {
            return sqlizePrimitive(expression.value);
        };

        SqlVisitor.prototype["string"] = function (expression) {
            return expression.value;
        };

        SqlVisitor.prototype["guid"] = SqlVisitor.prototype["string"];

        SqlVisitor.prototype["number"] = function (expression) {
            return expression.value;
        };

        SqlVisitor.prototype["boolean"] = function (expression) {
            return expression.value;
        };

        SqlVisitor.prototype["expression"] = function (expression) {
            return expression.value;
        };

        SqlVisitor.prototype["array"] = function (expression) {
            return expression.value;
        };

        return SqlVisitor;
    }(BASE.query.ExpressionVisitor));

});