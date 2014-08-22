BASE.require([
    "BASE.async.Future"
], function () {

    var Future = BASE.async.Future;

    BASE.namespace("BASE.async");
    BASE.async.delay = function (delayInMilliseconds) {
        delayInMilliseconds = typeof delayInMilliseconds === "number" ? delayInMilliseconds : 100;
        var timeout = null;

        var future = new Future(function (setValue) {
            timeout = setTimeout(setValue, delayInMilliseconds);
        }).then();

        future.ifCanceled(function () {
            clearTimeout(timeout);
        });

        return future;
    };

});