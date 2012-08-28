BASE.require(["BASE.EventEmitter"], function () {
    BASE.namespace("Test");

    window.Test.AddUnitTest = function () {
        var self = this;
        BASE.EventEmitter.call(this);

        self.run = function () {
            var error = new BASE.Event("error");
            error.message = "We have an error!";

            self.emit(error);

            var warning = new BASE.Event("warning");
            warning.message = "This is a warning, I'm counting to three!";

            self.emit(warning);

            var notes = new BASE.Event("notes");
            notes.message = "Some Notes of sorts";

            self.emit(notes);

            var event = new BASE.Event("success");
            event.message = "It Worked!";
            event.details = "This is a longer test explaining why this worked and that we all succeeded."

            self.emit(event);
        };

        return self;
    };

});

