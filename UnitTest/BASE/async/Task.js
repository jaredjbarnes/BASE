BASE.require(["BASE.util.UnitTest", "BASE.async.Future"], function () {
    BASE.namespace("UnitTest.BASE.async");

    UnitTest.BASE.async.Task = (function (Super) {
        var Task = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new Task();
            }

            Super.call(self, "UnitTest.BASE.async.Task");

            function setupTimer(delay, id) {
                return new BASE.async.Future(function (setValue, setError) {
                    setTimeout(function () { setValue() }, delay);
                });
            }

            self.execute = function () {
                return new BASE.async.Future(function (setValue, setError) {
                    // Run your test here and set the value or error upon completion.

                    allTimers = new BASE.async.Task();

                    var timer1 = setupTimer(1000);
                    var timer2 = setupTimer(2000);
                    var timer3 = setupTimer(3000);

                    allTimers.add(timer1);
                    allTimers.add(timer2);
                    allTimers.add(timer3);

                    var allFutures = [timer1, timer2, timer3];

                    function onedone(future) {
                        var index = allFutures.indexOf(future);

                        allFutures.splice(index, 1);
                    }

                    function alldone(future) {
                        if (allFutures.length !== 0) {
                            self.message = "Failed";
                            setError(self);
                        } else {
                            self.message = "Passed";
                            setValue(self);
                        }
                    }

                    allTimers.start().whenAny(onedone).whenAll(alldone);

                    // or setError(self);
                });
            };

            return self;
        };

        BASE.extend(Task, Super);

        return Task;
    }(BASE.util.UnitTest));
});