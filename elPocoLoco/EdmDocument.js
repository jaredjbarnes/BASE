BASE.require(["BASE.util.Observable"], function () {
    var https = require("https");

    BASE.namespace("elPocoLoco");

    elPocoLoco.EdmDocument = function (uri) {
        var self = this;
        BASE.assertNotGlobal(self);

        BASE.util.Observable.call(self);

        var xDocument;

        var defaultState = {
            getDocument: function () {
                throw new Error("Document isn't loaded yet.");
            }
        };

        var readyState = {
            getDocument: function () {
                return xDocument;
            }
        };

        var errorState = {
            getDocument: function () {
                throw new Error("Invalid document uri.");
            }
        };

        https.get(uri, function (res) {
            var xml = "";
            res.on("data", function (d) {
                xml += d;
            });

            res.on("end", function () {
                var parser = new DOMParser();
                xDocument = parser.parseFromString(xml, "application/xml");
                state = readyState;
                self.notify({
                    type: "ready"
                });
            });

        }).on("error", function (e) {
            state = errorState;
        });

        var state = defaultState;

        self.getDocument = function () {
            return state.getDocument();
        };
    };
});
