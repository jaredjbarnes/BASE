
BASE.require([
    "BASE.util.Notifiable",
    "BASE.util.PropertyChangedEvent",
    "BASE.async.Future",
    "BASE.async.Task"
], function () {

    BASE.namespace("BASE.util");

    BASE.util.Observable = (function (Super) {
        var Observable = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Observable();
            }

            Super.call(self);

            self.notify = function (event) {
                if (typeof event === "string") {
                    event = new BASE.util.ObservableEvent(event);
                }

                var self = this;
                var globalObservers = this._globalObservers.slice(0);
                var typeObservers = [];

                var task = new BASE.async.Task();

                if (this._typeObservers[event.type]) {
                    typeObservers = this._typeObservers[event.type].slice(0);
                }

                var forEachObserver = function (observer) {
                    var futureResponse;
                    var response = observer.call(self, event);
                    if (!(response instanceof BASE.async.Future)) {
                        futureResponse = new BASE.async.Future(function (setValue, setError) {
                            setTimeout(function () {
                                setValue(response);
                            }, 0);
                        });
                    } else {
                        futureResponse = response;
                    }

                    task.add(futureResponse);
                };

                globalObservers.forEach(forEachObserver);
                typeObservers.forEach(forEachObserver);

                return task.start();
            };

            return self;
        };

        BASE.extend(Observable, Super);

        return Observable;
    }(BASE.util.Notifiable));
});