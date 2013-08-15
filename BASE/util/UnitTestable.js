BASE.require([
    "BASE.util.Observable",
    "BASE.async.Task",
    "BASE.async.Future",
    "BASE.util.PropertyChangedEvent"
], function () {

    BASE.namespace("BASE.util");

    var PropertyChangedEvent = BASE.util.PropertyChangedEvent;

    BASE.util.UnitTestable = ((function (Super) {

        var UnitTestable = function (name) {
            var self = this;

            if (!(self instanceof arguments.callee)) {
                return new UnitTestable(name);
            }

            Super.call(self);

            Object.defineProperty(self, "name", {
                get: function () {
                    return name;
                },
                set: function (value) {
                    var oldValue = name;
                    if (value !== oldValue) {
                        name = value;
                        self.notify(new PropertyChangedEvent("name", oldValue, value, self));
                    }
                }
            });

            var _message = null;
            Object.defineProperty(self, "message", {
                get: function () {
                    return _message;
                },
                set: function (value) {
                    var oldValue = _message;
                    if (value !== oldValue) {
                        _message = value;
                        self.notify(new PropertyChangedEvent("message", oldValue, value, self));
                    }
                }
            });

            var _state = {
                type: "Running..."
            };

            Object.defineProperty(self, "state", {
                get: function () {
                    return _state;
                },
                set: function (value) {
                    var oldValue = _state;
                    if (value !== oldValue) {
                        _state = value;
                        self.notify(new PropertyChangedEvent("state", oldValue, value, self));
                    }
                }
            });

            self.assert = function (isTrue, passedMessage, errorMessage) {
                if (isTrue) {
                    self.message = passedMessage;


                    self.state = {
                        type: "Passed"
                    };

                } else {
                    self.message = errorMessage;

                    self.state = {
                        type: "Failed"
                    };
                }
            };

            self.execute = function () {
                throw new Error("This was meant to be overriden.");
            };

        };

        BASE.extend(UnitTestable, Super);

        return UnitTestable;

    })(BASE.util.Observable));

});