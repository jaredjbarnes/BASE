BASE.require(["BASE.Observable"], function () {

    // DEPRECATED!!!

    BASE.Synchronizer = (function (Super) {
        var Synchronizer = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Synchronizer();
            }

            Super.call(self);

            var _completed = 0;
            var onComplete = function () { };
            var _callback = function () {
                _completed += 1;
                if (_completed === _workers.length) {
                    _callbacks.forEach(function (callback) {
                        callback();
                    });
                    onComplete();
                }
            };
            var _workers = [];
            var _callbacks = [];

            self.add = function (worker, callback) {
                _workers.push(worker);
                _callbacks.push(callback || function () { });
            };
            self.remove = function (worker) {
                var index = _workers.indexOf(worker);
                _workers.splice(index, 1);
                _callbacks.splice(index, 1);
            };
            self.start = function (callback) {
                Object.seal(_workers);
                Object.seal(_callbacks);
                onComplete = callback;
                if (_workers.length === 0) {
                    callback();
                    return;
                }
                if (this.synchronizeWorkers) {
                    var forEach = function (x) {
                        if (x < _workers.length) {
                            _workers[x](function () {
                                forEach(x + 1);
                            });
                        } else {
                            onComplete();
                        }
                    };

                    forEach(0);
                } else {
                    _workers.forEach(function (func) {
                        func(_callback);
                    });
                }
            };

            this.synchronizeWorkers = false;

            return self;
        };

        BASE.extend(Synchronizer, Super);

        return Synchronizer;
    }(BASE.Observable));
});