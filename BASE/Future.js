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
                "error": {
                    get: function () {
                        return _error;
                    }
                }
            });

            var _isComplete = false;
            Object.defineProperty(self, "isComplete", {
                get: function () {
                    return _isComplete;
                }
            });

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

            var _defaultState = {
                observeSuccess: function (callback) {
                    var wrapper = function (event) {
                        self.unobserve(wrapper, "success");
                        callback.apply(_value, [_value]);
                    }
                    self.observe(wrapper, "success");
                },
                observeError: function (callback) {
                    var wrapper = function (event) {
                        self.unobserve(wrapper, "error");
                        callback(_error);
                    }
                    self.observe(wrapper, "error");
                },
                observeCanceled: function (callback) {
                    var wrapper = function (event) {
                        self.unobserve(wrapper, "canceled");
                        callback();
                    }
                    self.observe(wrapper, "canceled");
                },
                request: function () {
                    getValue(function (value) {
                        _isComplete = true;
                        if (_state !== _canceledState &&
                            typeof _error === "undefined" &&
                            typeof _value === "undefined") {
                            _state = _loadedState;
                            _value = value;
                            self.notify(new BASE.ObservableEvent("success"));
                            self.notify(new BASE.ObservableEvent("complete"));
                        }
                    }, function (err) {
                        isComplete = true;
                        if (_state !== _canceledState &&
                            typeof _error === "undefined" &&
                            typeof _value === "undefined") {
                            _state = _errorState;
                            _error = err;
                            self.notify(new BASE.ObservableEvent("error"));
                            self.notify(new BASE.ObservableEvent("complete"));
                        }
                    });

                    //This ensures that the getValue is only called once.
                    getValue = function () { };
                    _state = _retrievingState;
                }
            };

            var _retrievingState = {
                observeSuccess: function (callback) {
                    var wrapper = function (event) {
                        self.unobserve(wrapper, "success");
                        callback(_value);
                    }
                    self.observe(wrapper, "success");
                },
                observeError: function (callback) {
                    var wrapper = function (event) {
                        self.unobserve(wrapper, "error");
                        callback(_error);
                    }
                    self.observe(wrapper, "error");
                },
                observeCanceled: function (callback) {
                    var wrapper = function (event) {
                        self.unobserve(wrapper, "canceled");
                        callback();
                    }
                    self.observe(wrapper, "canceled");
                },
                request: function () { }
            };

            var _errorState = {
                observeSuccess: function (callback) { },
                observeError: function (callback) {
                    setTimeout(function () {
                        callback(_error);
                    }, 0);
                },
                observeCanceled: function (callback) { },
                request: function () { }
            };

            var _canceledState = {
                observeSuccess: function (callback) { },
                observeError: function (callback) { },
                observeCanceled: function (callback) {
                    setTimeout(function () {
                        callback();
                    }, 0);
                },
                request: function () { }
            }

            var _loadedState = {
                observeSuccess: function (callback) {
                    setTimeout(function () {
                        callback.apply(_value, [_value]);
                    }, 0);
                },
                observeError: function (callback) { },
                observeCanceled: function (callback) { },
                request: function () { }
            };

            var _state = _defaultState;

            self.then = function (callback) {
                ///<summary>callback = function(result){
                /// <br />
                ///}</summary>
                /// <returns type="BASE.Future" ></returns>
                callback = callback || function () { };
                _state.observeSuccess(callback);
                _state.request();
                return self;
            };

            self.ifError = function (callback) {
                callback = callback || function () { };
                _state.observeError(callback);
                _state.request();
                return self;
            };

            self.ifCanceled = function (callback) {
                callback = callback || function () { };
                _state.observeCanceled(callback);
                _state.request();
                return self;
            }

            self.cancel = function () {

                if (_state !== _loadedState && _state !== _canceledState) {
                    _isComplete = true;
                    _state = _canceledState;
                    self.notify(new BASE.ObservableEvent("canceled"));
                }

                return self;
            };

            return self;
        };

        BASE.extend(Future, Super);

        var _fromResult = function (value) {
            return new Future(function (setValue) {
                setTimeout(function () { setValue(value); }, 0);
            });
        };

        Object.defineProperty(Future, "fromResult", {
            enumerable: false,
            value: _fromResult
        });

        return Future;
    }(BASE.Notifiable));

});