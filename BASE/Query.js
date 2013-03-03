BASE.require(["BASE.Observable", "BASE.ObservableEvent"], function () {

    BASE.Operator = (function () {
        var Operator = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Operator();
            }

            var _left = null;
            var _right = null;

            Object.defineProperties(self, {
                "left": {
                    get: function () {
                        return _left;
                    },
                    set: function (value) {
                        _left = value;
                    }
                },
                "right": {
                    get: function () {
                        return _right;
                    },
                    set: function (value) {
                        _right = value;
                    }
                }
            });

            self.evaluate = function () {
                return true;
            };

        };

        return Operator;
    }());

    BASE.OperatorGroup = (function () {
        var OperatorGroup = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new OperatorGroup();
            }

            var _left = null;
            var _right = null;

            Object.defineProperties(self, {
                "left": {
                    get: function () {
                        return _left;
                    },
                    set: function (value) {
                        _left = value;
                    }
                },
                "right": {
                    get: function () {
                        return _right;
                    },
                    set: function (value) {
                        _right = value;
                    }
                }
            });

            self.evaluate = function () {
                return self.left.evaluate();
            };

        };

        return OperatorGroup;
    }());

    BASE.OrGroup = (function () {
        var OrGroup = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new OrGroup();
            }

            Object.defineProperties(self, {
                "operator": {
                    get: function () {
                        return "||"
                    }
                }
            });

            self.evaluate = function () {
                if (!self.right) {
                    return self.left.evaluate();
                } else {
                    return self.left.evaluate() || self.right.evaluate();
                }

            };

        };

        return OrGroup;
    }(BASE.OperatorGroup));

    BASE.AndGroup = (function () {
        var AndGroup = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new AndGroup();
            }

            Object.defineProperties(self, {
                "operator": {
                    get: function () {
                        return "&&"
                    }
                }
            });

            self.evaluate = function () {
                if (!self.right) {
                    return self.left.evaluate();
                } else {
                    return self.left.evaluate() && self.right.evaluate()
                }
            };

        };

        return AndGroup;
    }(BASE.OperatorGroup));

    /*
    equals
    notEquals
    greaterThan
    lessThan
    greaterThanOrEqual
    lessThanOrEqual
    contains
    startsWith
    endsWith
    length ???

    //functions on the expression builder
    and
    or
    skip
    take
    orderBy
    orderByDescending
    */

    var getObject = function (namespace, context) {
        context = context || window;
        if (typeof namespace === "string") {
            var a = namespace.split('.');
            var length = a.length;
            var tmpObj;

            for (var x = 0; x < length; x++) {
                if (x === 0) {
                    if (typeof context[a[0]] === 'undefined') {
                        return undefined;
                    } else {
                        tmpObj = context[a[0]];
                    }
                } else {
                    if (typeof tmpObj[a[x]] === 'undefined') {
                        return undefined;
                    } else {
                        tmpObj = tmpObj[a[x]];
                    }
                }
            }
            return tmpObj;
        } else {
            return undefined;
        }
    };

    BASE.Equals = (function (Super) {
        var Equals = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Equals();
            }
            Super.call();

            Object.defineProperties(self, {
                "operand": {
                    get: function () {
                        return "="
                    }
                }
            });

            self.evaluate = function () {
                return self.left === self.right;
            };

        };

        return Equals;
    }(BASE.Operator));

    BASE.NotEquals = (function (Super) {
        var NotEquals = function (left) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new NotEquals();
            }
            Super.call();

            Object.defineProperties(self, {
                "operand": {
                    get: function () {
                        return "!="
                    }
                }
            });

            self.evaluate = function () {
                return self.left !== self.right;
            };

        };

        return NotEquals;
    }(BASE.Operator));

    BASE.Expression = (function () {
        var Expression = function (operator) {
            var self = this;

            if (!(self instanceof arguments.callee)) {
                return new Expression();
            }

            Object.defineProperties(self, {
                "operator": {
                    get: function () {
                        return operator;
                    }
                }
            });
        };

        return Expression;
    }());

    BASE.GroupBuilder = (function () { }());

    BASE.ExpressionBuilder = (function (Super) {
        var ExpressionBuilder = function (Type, namespace) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new ExpressionBuilder(Type);
            }

            Super.call(self);
            var mapping;
            if (typeof Type === "function") {
                mapping = new Type();
            } else {
                mapping = Type;
            }

            namespace = namespace || "";

            var groups = [];

            Object.defineProperties(self, {
                "namespace": {
                    get: function () {
                        return namespace;
                    }
                },
                "groups": {
                    get: function () {
                        return _groups;
                    }
                }
            });

            self.equals = function (value) {
                var equals = new BASE.Equals();
                equals.left = namespace;
                equals.right = value;

                var event = new BASE.ObservableEvent("expressionCreated");
                event.expression = new BASE.Expression(equals);

                self.notify(event);
            };


            self.notEquals = function (value) {
                var notEquals = new BASE.NotEquals();
                notEquals.left = namespace;
                notEquals.right = value;

                var event = new BASE.ObservableEvent("expressionCreated");
                event.expression = new BASE.Expression(notEquals);

                self.notify(event);
            };


            for (var property in mapping) (function (property) {
                Object.defineProperty(self, property, {
                    get: function () {
                        var ChildType;
                        if (mapping[property] === null) {
                            ChildType = Object;
                        } else {
                            ChildType = mapping[property].constructor;
                        }

                        // If a json true was provided then use that.
                        //if (mapping === Type) {
                           // ChildType = mapping[property];
                       // }

                        var expressionBuilder = new ExpressionBuilder(ChildType, (namespace ? (namespace + ".") : "") + property);

                        expressionBuilder.onExpressionCreated(function (e) {
                            self.notify(e);
                        });

                        return expressionBuilder;
                    }
                });
            }(property));


            self.onExpressionCreated = function (callback) {
                self.observe(callback, "expressionCreated");
            };

            self.removeOnExpressionCreated = function (callback) {
                self.unobserve(callback, "expressionCreated");
            };
        };

        BASE.extend(ExpressionBuilder, Super);

        return ExpressionBuilder;
    }(BASE.Observable));

    /*
    equals
    notEquals
    greaterThan
    lessThan
    greaterThanOrEqual
    lessThanOrEqual
    */

    BASE.Query = (function () {
        var Query = function (filter, mapping) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Query(filter);
            }

            self.match = function (onObj) {
                var expressions;

                try {
                    expressions = self.getExpressions(mapping || onObj.constructor);
                } catch (e) {
                    return false;
                }

                return expressions.every(function (expression) {
                    var operator = expression.operator;
                    var obj = getObject(expression.operator.left, onObj);
                    operator.left = obj;

                    return operator.evaluate();
                });
            };

            self.getExpressions = function (Type) {
                var expressions = [];

                var builder = new BASE.ExpressionBuilder(Type);
                builder.onExpressionCreated(function (e) {
                    expressions.push(e.expression);
                });

                filter.call(builder);

                return expressions;
            };
        };

        return Query;
    }());

});