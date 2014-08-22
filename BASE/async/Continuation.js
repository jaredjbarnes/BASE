BASE.require([
    "BASE.async.Future"
], function () {
    BASE.namespace("BASE.async");

    var Future = BASE.async.Future;

    BASE.async.Continuation = function (future) {
        var self = this;

        var hasErrorHandler = false;
        var hasCancelHandler = false;
        future.then();

        self.then = function (callback) {
            callback = callback || function () { };
            var newFuture = new Future(function (setValue, setError) {
                future.then(function (value) {
                    var returnedFuture = callback(value);
                    if (returnedFuture instanceof Future) {
                        returnedFuture.then(setValue);
                        returnedFuture.ifError(setError);
                        returnedFuture.ifCanceled(function () {
                            newFuture.cancel();
                        });
                    } else {
                        setValue(returnedFuture);
                    }
                }).ifError(function (e) {
                    setError(e);
                }).ifCanceled(function (e) {
                    newFuture.cancel();
                });
            });
            return new BASE.async.Continuation(newFuture);
        };

        self.ifError = function (callback) {
            hasErrorHandler = true;
            future.ifError(callback);
            return self;
        };

        self.ifCanceled = function (callback) {
            hasCancelHandler = true;
            future.ifCanceled(callback);
            return self;
        };

        self.cancel = function () {
            future.cancel();
        };
    };

});