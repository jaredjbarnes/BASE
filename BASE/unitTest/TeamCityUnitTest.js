BASE.require(["BASE.unitTest.UnitTest"], function () {
    BASE.namespace("BASE.unitTest");

    var escapeChars = function (str) {
        if (typeof str !== "string") {
            return str;
        } else {
            return str.replace(/\|/g, "||")
                    .replace(/'/g, "|'")
                    .replace(/\n/g, "|n")
                    .replace(/\r/g, "|r")
                    .replace(/\u0085/, "|x")
                    .replace(/\u2028/, "|l")
                    .replace(/\u2029/, "|p")
                    .replace(/\[/g, "|[")
                    .replace(/\]/g, "|]");
        }
    };

    var TeamCityOutput = function (type) {
        this.toString = function (attr) {
            var attributes = Object.keys(attr).reduce(function (str, key) {
                return str += " " + key + "='" + escapeChars(attr[key]) + "'";
            }, "");
            return "##teamcity[" + type + attributes + "]";
        };
    };

    BASE.unitTest.TeamCityUnitTest = function () {
        var self = this;

        BASE.assertNotGlobal(self);

        BASE.unitTest.UnitTest.apply(self, arguments);

        self.observeType("started", function (event) {
            var name = event.name;
            console.log(new TeamCityOutput("testStarted").toString({ name: name}));
        });

        self.observeType("ended", function (event) {
            var duration = event.duration;
            var name = event.name;
            console.log(new TeamCityOutput("testFinished").toString({ name: name, duration: duration }));
        });

        self.observeType("result", function (event) {
            var name = event.name;
            var result = event.result;
            var message = "";

            if (result.failures.length === 0) {
                result.successes.forEach(function (success) {
                    message += success.message + "\n";
                });

                console.log(new TeamCityOutput("testStdOut").toString({ name: name, out: message }));
            } else {
                result.failures.forEach(function (failure) {
                    message += failure.message + "\n";
                });

                console.log(new TeamCityOutput("testFailed").toString({ name: name, out: message }));
            }
        });

    };
});