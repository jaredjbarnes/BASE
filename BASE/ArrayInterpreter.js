BASE.require(["BASE.Observable"], function () {
    BASE.namespace("BASE");

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

    BASE.ArrayInterpreter = (function (Super) {
        var ArrayInterpreter = function (localArray) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ArrayInterpreter();
            }

            Super.call(self);

            self.localArray = localArray;
            self.filteredArray = localArray;
            return self;
        };

        BASE.extend(ArrayInterpreter, Super);

        ArrayInterpreter.prototype["ascending"] = function (namespace) {
            return new Ascending(namespace);
        };

        ArrayInterpreter.prototype["descending"] = function (namespace) {
            return new Descending(namespace);
        };

        ArrayInterpreter.prototype["greaterThan"] = function (left, right) {
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

        ArrayInterpreter.prototype["lessThan"] = function (left, right) {
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

        ArrayInterpreter.prototype["greaterThanOrEqual"] = function (left, right) {
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

        ArrayInterpreter.prototype["lessThanOrEqual"] = function (left, right) {
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

        ArrayInterpreter.prototype["orderBy"] = function () {
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

        ArrayInterpreter.prototype["and"] = function () {
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

        ArrayInterpreter.prototype["where"] = function () {
            var self = this;
            self.filteredArray = ArrayInterpreter.prototype["and"].apply(self, arguments);
        };

        ArrayInterpreter.prototype["or"] = function () {
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

        ArrayInterpreter.prototype["equal"] = function (left, right) {
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

        ArrayInterpreter.prototype["notEqual"] = function (left, right) {
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

        ArrayInterpreter.prototype["skip"] = function (value) {
            var self = this;

            for (var x = 0 ; x < value && self.filteredArray.length > 0; x++) {
                self.filteredArray.shift();
            }
            return self.filteredArray ;
        };

        ArrayInterpreter.prototype["take"] = function (value) {
            var self = this;
            var newFilteredArray = [];
            value = value < self.filteredArray.length ? value : self.filteredArray.length;
            for (var x = 0 ; x < value ; x++) {
                newFilteredArray.push(self.filteredArray.shift());
            }
            return self.filteredArray = newFilteredArray;
        };

        return ArrayInterpreter;
    }(BASE.Observable));
});