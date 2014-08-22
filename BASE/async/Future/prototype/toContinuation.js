BASE.require([
    "BASE.async.Continuation",
    "BASE.async.Future"
], function () {

    var Future = BASE.async.Future;
    var Continuation = BASE.async.Continuation;

    Future.prototype.toContinuation = function () {
        return new Continuation(this);
    };

});