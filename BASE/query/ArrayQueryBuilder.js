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
        var ArrayQueryBuilder = function (sourceArray) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ArrayQueryBuilder(sourceArray);
            }

            Super.call(self);

            var filteredArray = sourceArray.slice(0);

            var _value = null;
            Object.defineProperty(self, "value", {
                get: function () {
                    return filteredArray;
                }
            });

            var _ascending = function (namespace) {
                return new Ascending(namespace);
            };

            var _descending = function (namespace) {
                return new Descending(namespace);
            };

            var _greaterThan = function (left, right) {
                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left, item);
                    }
                    if (obj > right) {
                        results.push(item);
                    }
                });
                return results;
            };

            var _lessThan = function (left, right) {
                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left, item);
                    }
                    if (obj < right) {
                        results.push(item);
                    }
                });
                return results;
            };

            var _greaterThanOrEqual = function (left, right) {
                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left, item);
                    }
                    if (obj >= right) {
                        results.push(item);
                    }
                });
                return results;
            };

            var _lessThanOrEqual = function (left, right) {
                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left, item);
                    }
                    if (obj <= right) {
                        results.push(item);
                    }
                });
                return results;
            };

            _orderBy = function () {
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

            var _and = function () {
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

            var _where = function () {
                var self = this;
                return sourceArray = filteredArray = self.and.apply(self, arguments);
            };

            var _or = function () {
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

            var _string = function (value) {
                return value;
            };

            var _constant = function (expression) {
                return expression.value;
            };

            var _property = function (expression) {
                return expression.value;
            };

            var _guid = function (value) {
                return value;
            };

            var _null = function (value) {
                return value;
            };

            var _undefined = function (value) {
                return value;
            };

            var _number = function (value) {
                return value;
            };

            var _object = function (value) {
                return value;
            };

            var _date = function (value) {
                return value;
            };

            var _function = function (value) {
                return value;
            };

            var _boolean = function (value) {
                return value;
            };

            var _array = function (value) {
                return value;
            };

            var _startsWith = function (left, right) {
                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left, item);
                    }
                    if (obj.toLowerCase().indexOf(right.toLowerCase()) === 0) {
                        results.push(item);
                    }
                });
                return results;
            };

            var _endsWith = function (left, right) {
                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left, item);
                    }
                    if (obj.toLowerCase().lastIndexOf(right.toLowerCase()) === obj.length - right.length) {
                        results.push(item);
                    }
                });
                return results;
            };

            var _substringOf = function (left, right) {
                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left, item);
                    }
                    if (right.trim() === "") {
                        results.push(item);
                    } else if (obj.toLowerCase().indexOf(right.toLowerCase()) >= 0) {
                        results.push(item);
                    }
                });
                return results;
            };

            var _equal = function (left, right) {
                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left, item);
                    }

                    if (obj === right) {
                        results.push(item);
                    }
                });
                return results;
            };

            var _notEqual = function (left, right) {
                var self = this;

                var results = [];
                var self = this;
                sourceArray.forEach(function (item) {
                    // This will compare the base object.
                    var obj;
                    if (left === "") {
                        obj = item;
                    } else {
                        obj = BASE.getObject(left, item);
                    }

                    if (obj !== right) {
                        results.push(item);
                    }
                });
                return results;
            };

            var _skip = function (value) {
                var self = this;

                for (var x = 0 ; x < value && self.localArray.length > 0; x++) {
                    filteredArray.shift();
                }
                return filteredArray;
            };

            var _take = function (value) {
                var self = this;
                var newFilteredArray = [];
                value = value < filteredArray.length ? value : filteredArray.length;
                for (var x = 0 ; x < value ; x++) {
                    newFilteredArray.push(filteredArray.shift());
                }
                return filteredArray = newFilteredArray;
            };

            Object.defineProperties(self, {
                "descending": { enumerable: false, configurable: false, value: _descending },
                "ascending": { enumerable: false, configurable: false, value: _ascending },
                "greaterThan": { enumerable: false, configurable: false, value: _greaterThan },
                "lessThan": { enumerable: false, configurable: false, value: _lessThan },
                "greaterThanOrEqual": { enumerable: false, configurable: false, value: _greaterThanOrEqual },
                "lessThanOrEqual": { enumerable: false, configurable: false, value: _lessThanOrEqual },
                "orderBy": { enumerable: false, configurable: false, value: _orderBy },
                "and": { enumerable: false, configurable: false, value: _and },
                "where": { enumerable: false, configurable: false, value: _where },
                "or": { enumerable: false, configurable: false, value: _or },
                "string": { enumerable: false, configurable: false, value: _string },
                "constant": { enumerable: false, configurable: false, value: _constant },
                "property": { enumerable: false, configurable: false, value: _property },
                "guid": { enumerable: false, configurable: false, value: _guid },
                "null": { enumerable: false, configurable: false, value: _null },
                "undefined": { enumerable: false, configurable: false, value: _undefined },
                "number": { enumerable: false, configurable: false, value: _number },
                "object": { enumerable: false, configurable: false, value: _object },
                "date": { enumerable: false, configurable: false, value: _date },
                "function": { enumerable: false, configurable: false, value: _function },
                "boolean": { enumerable: false, configurable: false, value: _boolean },
                "array": { enumerable: false, configurable: false, value: _array },
                "startsWith": { enumerable: false, configurable: false, value: _startsWith },
                "endsWith": { enumerable: false, configurable: false, value: _endsWith },
                "substringOf": { enumerable: false, configurable: false, value: _substringOf },
                "equal": { enumerable: false, configurable: false, value: _equal },
                "notEqual": { enumerable: false, configurable: false, value: _notEqual },
                "skip": { enumerable: false, configurable: false, value: _skip },
                "take": { enumerable: false, configurable: false, value: _take }
            });

            return self;
        };

        BASE.extend(ArrayQueryBuilder, Super);

        return ArrayQueryBuilder;
    }(BASE.Observable));
});