BASE.require([
    "BASE.Notifiable",
    "BASE.PropertyChangedEvent",
    "BASE.Future",
    "BASE.Task"
], function () {
    BASE.namespace("BASE");

    BASE.Observable = (function (Super) {
        var Observable = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Observable();
            }

            Super.call(self);

            self.notify = function (event) {
                var self = this;
                var globalObservers = this._globalObservers.slice(0);
                var typeObservers = [];

                var task = new BASE.Task();

                if (this._typeObservers[event.type]) {
                    typeObservers = this._typeObservers[event.type].slice(0);
                }

                var forEachObserver = function (observer) {
                    var futureResponse;
                    var response = observer.call(self, event);
                    if (!(response instanceof BASE.Future)) {
                        futureResponse = new BASE.Future(function (setValue, setError) {
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
    }(BASE.Notifiable));
});