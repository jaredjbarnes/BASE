BASE.require([
    "BASE.util.Observer",
    "jQuery"
], function () {

    BASE.namespace("BASE.web");
    var Observer = BASE.util.Observer;

    var onHashChangeListener = function (e) {
        hashChangeObserver.notify(e);
    };

    var hashChangeObserver = new Observer(function () {
        $(window).off("hashchange", onHashChangeListener);
    });

    $(window).on("hashchange", onHashChangeListener);

    BASE.web.Route = function (descriptor) {
        var self = this;
        var state = null;

        var getHashValue = function () {
            return location.hash.substr(1);
        };

        var observer = hashChangeObserver.filter(function (e) {
            var hash = getHashValue();

            if ((hash && hash.indexOf(descriptor) === 0) || typeof descriptor === "undefined") {
                return true;
            }
            return false;
        });

        var mappedObserver = observer.map(function (e) {
            return getHashValue();
        });

        self.observe = function () {
            return mappedObserver.copy();
        };

        self.start = function () {
            observer.start();
            observer.notify({});
        };

        self.stop = function () {
            observer.stop();
        };

        self.dispose = function () {
            observer.dispose();
        };

        // This allows others to bind to it before it notifies the observers.
        setTimeout(function () {
            observer.notify({});
        });
    };

});