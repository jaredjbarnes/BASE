BASE.require(["BASE.Observable"], function () {
    BASE.namespace("BASE.query");

    var Ascending = function (namespace) {
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
    var Descending = function (namespace) {
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
        var ArrayQueryBuilder = function (localArray) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ArrayQueryBuilder();
            }

            Super.call(self);

            self.localArray = localArray;
            self.filteredArray = localArray;
            return self;
        };

        BASE.extend(ArrayQueryBuilder, Super);

        ArrayQueryBuilder.prototype["ascending"] = function (namespace) {
            return new Ascending(namespace);
        };

        ArrayQueryBuilder.prototype["descending"] = function (namespace) {
            return new Descending(namespace);
        };

        ArrayQueryBuilder.prototype["greaterThan"] = function (left, right) {
            var results = [];
            var self = this;
            self.localArray.forEach(function (item) {
                var obj = BASE.getObject(left, item);
                if (obj > right) {
                    results.push(item);
                }
            });
            return results;
        };

        ArrayQueryBuilder.prototype["lessThan"] = function (left, right) {
            var results = [];
            var self = this;
            self.localArray.forEach(function (item) {
                var obj = BASE.getObject(left, item);
                if (obj < right) {
                    results.push(item);
                }
            });
            return results;
        };

        ArrayQueryBuilder.prototype["greaterThanOrEqual"] = function (left, right) {
            var results = [];
            var self = this;
            self.localArray.forEach(function (item) {
                var obj = BASE.getObject(left, item);
                if (obj >= right) {
                    results.push(item);
                }
            });
            return results;
        };

        ArrayQueryBuilder.prototype["lessThanOrEqual"] = function (left, right) {
            var results = [];
            var self = this;
            self.localArray.forEach(function (item) {
                var obj = BASE.getObject(left, item);
                if (obj <= right) {
                    results.push(item);
                }
            });
            return results;
        };

        ArrayQueryBuilder.prototype["orderBy"] = function () {
            var self = this;
            var orderByCriterions = Array.prototype.slice.call(arguments, 0);

            self.filteredArray.sort(function (itemA, itemB) {
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

            return self.filteredArray;
        };

        ArrayQueryBuilder.prototype["and"] = function () {
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

        ArrayQueryBuilder.prototype["where"] = function () {
            var self = this;
            self.filteredArray = ArrayQueryBuilder.prototype["and"].apply(self, arguments);
        };

        ArrayQueryBuilder.prototype["or"] = function () {
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


        ArrayQueryBuilder.prototype["string"] = function (value) {
            return value;
        };

        ArrayQueryBuilder.prototype["constant"] = function (expression) {
            return expression.value;
        };

        ArrayQueryBuilder.prototype["property"] = function (expression) {
            return expression.value;
        };

        ArrayQueryBuilder.prototype["guid"] = function (value) {
            return value;
        };

        ArrayQueryBuilder.prototype["null"] = function (value) {
            return value;
        };

        ArrayQueryBuilder.prototype["undefined"] = function (value) {
            return value;
        };

        ArrayQueryBuilder.prototype["number"] = function (value) {
            return value;
        };

        ArrayQueryBuilder.prototype["object"] = function (value) {
            return value;
        };

        ArrayQueryBuilder.prototype["array"] = function (value) {
            return value;
        };

        ArrayQueryBuilder.prototype["equal"] = function (left, right) {
            var results = [];
            var self = this;
            self.localArray.forEach(function (item) {
                var obj = BASE.getObject(left, item);
                if (obj === right) {
                    results.push(item);
                }
            });
            return results;
        };

        ArrayQueryBuilder.prototype["notEqual"] = function (left, right) {
            var self = this;

            var results = [];
            var self = this;
            self.localArray.forEach(function (item) {
                var obj = BASE.getObject(left, item);
                if (obj !== right) {
                    results.push(item);
                }
            });
            return results;
        };

        ArrayQueryBuilder.prototype["skip"] = function (value) {
            var self = this;

            for (var x = 0 ; x < value && self.filteredArray.length > 0; x++) {
                self.filteredArray.shift();
            }
            return self.filteredArray;
        };

        ArrayQueryBuilder.prototype["take"] = function (value) {
            var self = this;
            var newFilteredArray = [];
            value = value < self.filteredArray.length ? value : self.filteredArray.length;
            for (var x = 0 ; x < value ; x++) {
                newFilteredArray.push(self.filteredArray.shift());
            }
            return self.filteredArray = newFilteredArray;
        };

        return ArrayQueryBuilder;
    }(BASE.Observable));
});