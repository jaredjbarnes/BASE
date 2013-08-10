BASE.require(["BASE.util.Observable", "BASE.util.ObservableEvent"], function () {
    BASE.namespace("BASE.data");

    BASE.data.SaveTrackerItem = (function (Super) {
        var SaveTrackerItem = function (entity) {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new SaveTrackerItem();
            }
            Super.call(self);

            var _entity = entity;
            

            self.onSave = function (callback) {
                var wrapper = function () {
                    self.unobserve(wrapper, "saved");
                    callback();
                };
                self.observe(wrapper, "saved");
                return self;
            };

            self.onError = function (callback) {
                var wrapper = function (event) {
                    self.unobserve(wrapper, "error");
                    callback(event);
                };
                self.observe(wrapper, "error");
                return self;
            };

            self.save = function () {
                _entity.save().then(function () {
                    var event = new BASE.util.ObservableEvent("saved");
                    self.notify(event);
                }).ifError(function (error) {
                    var event = new BASE.util.ObservableEvent("error");
                    event.error = error;
                    event.entity = _entity;
                    self.notify(event);
                });
            };
            
            return self;
        };

        BASE.extend(SaveTrackerItem, Super);

        return SaveTrackerItem;
    }(BASE.util.Observable));
});