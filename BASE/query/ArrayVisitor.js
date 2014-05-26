BASE.require([
    "BASE.query.ExpressionVisitor",
    "BASE.collections.Hashmap"
], function () {
    BASE.namespace("BASE.query");

    var Hashmap = BASE.collections.Hashmap;

    var Ascending = function (expression) {
        var namespace = expression.value;
        var self = this;
        if (!(self instanceof Ascending)) {
            return new Ascending();
        }

        self.evaluate = function (a, b) {
            var aValue = BASE.getObject(namespace, a);
            var bValue = BASE.getObject(namespace, b);

            if (typeof aValue === "string" && typeof bValue === "string") {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue === bValue) {
                return 0;
            } else if (aValue < bValue) {
                return -1;
            } else if (aValue > bValue) {
                return 1;
            }
        };
    };
    var Descending = function (expression) {
        var namespace = expression.value;
        var self = this;
        if (!(self instanceof Descending)) {
            return new Descending();
        }

        self.evaluate = function (a, b) {
            var aValue = BASE.getObject(namespace, a);
            var bValue = BASE.getObject(namespace, b);

            if (typeof aValue === "string" && typeof bValue === "string") {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (aValue === bValue) {
                return 0;
            } else if (aValue > bValue) {
                return -1;
            } else if (aValue < bValue) {
                return 1;
            }
        };
    };

    BASE.query.ArrayVisitor = (function (Super) {
        var ArrayVisitor = function (sourceArray) {
            var self = this;
            BASE.assertNotGlobal(self);

            Super.call(self);

            var filteredArray = sourceArray.slice(0);

            self.getValue = function () {
                return filteredArray;
            };

            self.ascending = function (namespace) {
                return new Ascending(namespace);
            };

            self.descending = function (namespace) {
                return new Descending(namespace);
            };

            self.greaterThan = function (left, right) {
                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left.value === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left.value, item);
                    }
                    if (obj > right.value) {
                        results.push(item);
                    }
                });
                return results;
            };

            self.lessThan = function (left, right) {
                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left.value === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left.value, item);
                    }
                    if (obj < right.value) {
                        results.push(item);
                    }
                });
                return results;
            };

            self.greaterThanOrEqualTo = function (left, right) {
                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left.value === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left.value, item);
                    }
                    if (obj >= right.value) {
                        results.push(item);
                    }
                });
                return results;
            };

            self.lessThanOrEqualTo = function (left, right) {
                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left.value === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left.value, item);
                    }
                    if (obj <= right.value) {
                        results.push(item);
                    }
                });
                return results;
            };

            self.orderBy = function () {
                var self = this;
                var orderByCriterions = Array.prototype.slice.call(arguments, 0);

                filteredArray.sort(function (itemA, itemB) {
                    var returnValue = 0;
                    orderByCriterions.every(function (orderBy) {
                        returnValue = orderBy.evaluate(itemA, itemB);
                        if (returnValue === 0) {
                            return true;
                        } else {
                            return false;
                        }
                    });
                    return returnValue;
                });

                return filteredArray;
            };

            self.and = function () {
                var results = [];
                var hashes = [];

                var children = Array.prototype.slice.call(arguments, 0);

                // Load all the results into a hash once.
                children.forEach(function (array, index) {
                    var hash = hashes[index] = new Hashmap();
                    var item;
                    var length = array.length;

                    for (var x = 0 ; x < length; x++) {
                        item = array[x];
                        hash.add(item, item);
                    }
                });

                children[0].forEach(function (item, index) {

                    var pass = hashes.slice(1).every(function (hash) {
                        return hash.hasKey(item);
                    });

                    if (pass) {
                        results.push(item);
                    }
                });

                return results;
            };

            self.where = function () {
                var self = this;
                return sourceArray = filteredArray = self.and.apply(self, arguments);
            };

            self.or = function () {
                var hash = new Hashmap();

                var children = Array.prototype.slice.call(arguments, 0);

                // Load all the results into a hash once.
                children.forEach(function (array, index) {
                    var item;
                    var length = array.length;

                    for (var x = 0 ; x < length; x++) {
                        item = array[x];
                        hash.add(item, item);
                    }
                });

                return hash.getValues();
            };

            self.any = function (property, expression) {
                var propertyName = property.value;
                var results = [];

                sourceArray.forEach(function (item) {
                    var array = item[propertyName];
                    var parser = new ArrayVisitor(array);
                    var result = parser.parse(expression);

                    if (result.length > 0) {
                        results.push(item);
                    }
                });

                return results;
            };

            self.all = function (property, expression) {
                var propertyName = property.value;
                var results = [];

                sourceArray.forEach(function (item) {
                    var array = item[propertyName];
                    var parser = new ArrayVisitor(array);
                    var result = parser.parse(expression);

                    if (result.length === array.length && array.length > 0) {
                        results.push(item);
                    }
                });

                return results;
            };

            self.expression = function (expression) {
                return expression.value;
            };

            self.string = function (value) {
                return value;
            };

            self.constant = function (expression) {
                return expression;
            };

            self.property = function (expression) {
                return expression;
            };

            self.guid = function (value) {
                return value;
            };

            self["null"] = function (value) {
                return value;
            };

            self["undefined"] = function (value) {
                return value;
            };

            self.number = function (value) {
                return value;
            };

            self.object = function (value) {
                return value;
            };

            self.date = function (value) {
                return value;
            };

            self["function"] = function (value) {
                return value;
            };

            self.boolean = function (value) {
                return value;
            };

            self.array = function (value) {
                return value;
            };

            self.startsWith = function (left, right) {
                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left.value === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left.value, item);
                    }
                    if (obj.toLowerCase().indexOf(right.value.toLowerCase()) === 0) {
                        results.push(item);
                    }
                });
                return results;
            };

            self.endsWith = function (left, right) {
                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left.value === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left.value, item);
                    }
                    if (obj.toLowerCase().lastIndexOf(right.value.toLowerCase()) === obj.length - right.value.length) {
                        results.push(item);
                    }
                });
                return results;
            };

            self.substringOf = function (left, right) {
                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left.value === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left.value, item);
                    }
                    if (right.value.trim() === "") {
                        results.push(item);
                    } else if (obj.toLowerCase().indexOf(right.value.toLowerCase()) >= 0) {
                        results.push(item);
                    }
                });
                return results;
            };

            self.equalTo = function (left, right) {
                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left.value === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left.value, item);
                    }

                    if (obj === right.value) {
                        results.push(item);
                    }
                });
                return results;
            };

            self.notEqualTo = function (left, right) {
                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left.value === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left.value, item);
                    }

                    if (obj !== right.value) {
                        results.push(item);
                    }
                });
                return results;
            };

            self.skip = function (valueExpression) {
                var value = valueExpression.value;
                for (var x = 0 ; x < value && filteredArray.length > 0; x++) {
                    filteredArray.shift();
                }
                return filteredArray;
            };

            self.take = function (valueExpression) {
                return filteredArray = filteredArray.slice(0, valueExpression.value);
            };

            return self;
        };

        BASE.extend(ArrayVisitor, Super);

        return ArrayVisitor;
    }(BASE.query.ExpressionVisitor));
});