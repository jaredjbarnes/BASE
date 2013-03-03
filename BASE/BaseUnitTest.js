/// <reference path="/scripts/BASE.js" />

BASE.require(["BASE.EventEmitter"], function () {
    BASE.BaseUnitTest = BASE.defineClass(BASE.EventEmitter, function () {
        var self = this;
        self.base();

        self.run = function () {
            self.sendError("This was meant to be a base unitTester!");
        };

        self.sendNote = function (message, details) {
            var event = new BASE.Event("notes");
            event.message = message;
            event.details = details;

            self.emit(event);
        };
        self.sendError = function (message, details) {
            var event = new BASE.Event("error");
            event.message = message;
            event.details = details;

            self.emit(event);
        };
        self.sendSuccess = function (message, details) {
            var event = new BASE.Event("success");
            event.message = message;
            event.details = details;

            self.emit(event);
        };
        self.sendWarning = function (message, details) {
            var event = new BASE.Event("warning");
            event.message = message;
            event.details = details;

            self.emit(event);
        };

        return self;
    });
});