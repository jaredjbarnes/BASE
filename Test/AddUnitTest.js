BASE.require(["BASE.EventEmitter"], function () {
    BASE.namespace("Test");

    window.Test.AddUnitTest = function () {
        var self = this;
        BASE.EventEmitter.call(this);

        self.run = function () {
            var event = new BASE.Event("success");
            event.message = "It Worked!";

            self.emit(event);
        };

        return self;
    };

});

