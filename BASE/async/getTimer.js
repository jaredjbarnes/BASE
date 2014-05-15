BASE.require([
    "BASE.util.Observer"
], function () {

    BASE.namespace("BASE.async");

    BASE.async.getTimer = function (intervalDuration) {

        var startTime = new Date().getTime();
        var lastTick = startTime;

        if (typeof intervalDuration !== "number") {
            intervalDuration = 1000;
        }

        var interval = setInterval(function () {
            var time = new Date().getTime();

            timer.notify({
                type: "timerTick",
                time: time,
                startTime: startTime,
                runningTime: time - startTime,
                delta: time - lastTick
            });

            lastTick = time;

        }, intervalDuration);

        var timer = new BASE.util.Observer(function () {
            clearInterval(interval);
        });

        return timer;
    };

});