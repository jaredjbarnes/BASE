BASE.require(["BASE.util.Observable"], function () {
    BASE.namespace("BASE.query");

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

    BASE.query.ArrayQueryBuilder = (function (Super) {
        var ArrayQueryBuilder = function (sourceArray) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ArrayQueryBuilder(sourceArray);
            }

            Super.call(self);

            var filteredArray = sourceArray.slice(0);

            self.getValue = function() {
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
                var children = Array.prototype.slice.call(arguments, 0);
                children[0].forEach(function (item, index) {
                    var pass = children.every(function (array, index) {
                        return array.indexOf(item) >= 0
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
                var results = [];
                var children = Array.prototype.slice.call(arguments, 0);
                var match = children.forEach(function (array, index) {
                    array.forEach(function (item) {
                        if (results.indexOf(item) < 0) {
                            results.push(item);
                        }
                    })
                });

                return results;
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
                var self = this;

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
                var self = this;
                var value = valueExpression.value;
                for (var x = 0 ; x < value && filteredArray.length > 0; x++) {
                    filteredArray.shift();
                }
                return filteredArray;
            };

            self.take = function (valueExpression) {
                var self = this;
                var newFilteredArray = [];
                var value = valueExpression.value;
                value = value < filteredArray.length ? value : filteredArray.length;
                for (var x = 0 ; x < value ; x++) {
                    newFilteredArray.push(filteredArray.shift());
                }
                return filteredArray = newFilteredArray;
            };

            return self;
        };

        BASE.extend(ArrayQueryBuilder, Super);

        return ArrayQueryBuilder;
    }(Object));
});