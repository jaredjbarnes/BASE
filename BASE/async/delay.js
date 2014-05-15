BASE.require([
    "BASE.async.Future"
], function () {

    var Future = BASE.async.Future;

    BASE.namespace("BASE.async");
    BASE.async.delay = function (delayInMilliseconds) {
        delayInMilliseconds = typeof delayInMilliseconds === "number" ? delayInMilliseconds : 100;

        return new Future(function (setValue) {
            setTimeout(setValue, delayInMilliseconds);
        }).then();
    };

});