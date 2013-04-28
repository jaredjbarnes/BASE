BASE.require(["BASE.Notifiable", "BASE.ObservableEvent"], function () {

    BASE.Future = (function (Super) {

        var Future = function (getValue) {
            var self = this;
            if (!(self instanceof Future)) {
                return new Future(getValue);
            }

            Super.call(self);

            var _value;
            var _error;

            Object.defineProperties(self, {
                "value": {
                    get: function () {
                        if (typeof _value === "undefined") {
                            self.then();
                        }
                        return _value;
                    }
                },
                "errorObject": {
                    get: function () {
                        return _error;
                    }
                }
            });

            var _unloadedState = function (success, error) {

                if (success) {
                    self.observe(function wrapper() {
                        self.unobserve(wrapper, "success");
                        success(_value);
                    }, "success");
                }

                if (error) {
                    self.observe(function wrapper() {
                        self.unobserve(wrapper, "error");
                        error(_error);
                    }, "error");
                }

                getValue(function (value) {
                    if (typeof _error === "undefined" && typeof _value === "undefined") {
                        _state = _loadedState;
                        _value = value;
                        self.notify(new BASE.ObservableEvent("success"));
                        self.notify(new BASE.ObservableEvent("complete"));
                    }
                }, function (err) {
                    if (typeof _error === "undefined" && typeof _value === "undefined") {
                        _state = _errorState;
                        _error = err;
                        self.notify(new BASE.ObservableEvent("error"));
                        self.notify(new BASE.ObservableEvent("complete"));
                    }
                });
                // Reassign get value as to not call the retreive function twice.
                getValue = function () { };
            };

            var _loadedState = function (success, error) {
                if (success) {
                    setTimeout(function () {
                        success(_value);
                    }, 0);
                }
            };

            var _errorState = function (success, error) {
                if (error) {
                    setTimeout(function () {
                        error(_error);
                    }, 0);
                }
            };

            var _state = _unloadedState;


            self.then = function (callback) {
                callback = callback || function () { };
                _state(callback, null);
                return self;
            };

            self.error = function (callback) {
                callback = callback || function () { };
                _state(null, callback);
                return self;
            };

            return self;
        };

        BASE.extend(Future, Super);
        return Future;
    }(BASE.Notifiable));

});