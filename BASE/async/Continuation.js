BASE.require([
    "BASE.async.Future"
], function () {
    BASE.namespace("BASE.async");

    var Future = BASE.async.Future;

    BASE.async.Continuation = function (future) {
        var self = this;

        var hasErrorHandler = future.error ? true : false;

        future.then();

        self.then = function (callback) {
            var newFuture = new Future(function (setValue, setError) {
                future.then(function (value) {
                    var returnedFuture = callback(value);
                    if (returnedFuture instanceof Future) {
                        returnedFuture.then(setValue);
                    } else {
                        throw new Error("Expected a future to be returned from a continuation.");
                    }
                }).ifError(function (e) {
                    if (!hasErrorHandler) {
                        setError(e);
                    }
                });
            });
            return new BASE.async.Continuation(newFuture);
        };

        self.ifError = function (callback) {
            hasErrorHandler = true;
            future.ifError(callback);
            return self;
        };

        self.cancel = function () {
            future.cancel();
        };
    };

});