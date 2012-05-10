/// <reference path="/scripts/BASE.js" />
/// <reference path="/scripts/jQuery.js" />
/// <reference path="/scripts/Object/create.js" />
/// <reference path="/scripts/jQuery/fn/region.js" />

BASE.require(["jQuery", "Object.create", "jQuery.fn.region"], function () {
    BASE.namespace("WEB.ui");
    WEB.ui.Segue = function (controller, viewUrl, options) {
        if (!(this instanceof WEB.ui.Segue)) {
            return new Segue(controller, viewUrl, options);
        }

        if (!viewForm || !viewTo) {
            throw new Error("Segues require to views to segue to and from.");
        }

        if (!(controller instanceof WEB.ui.Controller)) {
            throw new Error("Segue needs to have a WEB.ui.Controller as the first argument.");
        }

        options = options || {};
        var self = this;
        self.$viewFrom = $viewFrom;
        self.$viewTo = $viewTo;

        self.push = function (callback) {
            callback = callback || function () { };

            var region = $viewFrom.region();
            $viewTo.offset(region);

            callback();
        };

        self.pop = function (callback) {

        };
    };

});