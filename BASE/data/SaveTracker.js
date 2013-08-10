BASE.require(["BASE.collections.Hashmap", "BASE.async.Future", "BASE.data.SaveTrackerItem"], function () {
    BASE.namespace("BASE.data");

    BASE.data.SaveTracker = (function (Super) {
        var SaveTracker = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new SaveTracker();
            }
            Super.call(self);

            var trackedItems = new BASE.collections.Hashmap();

            self.add = function (entity) {
                var trackerItem = new BASE.data.SaveTrackerItem(entity);
                trackedItems.add(trackerItem, trackerItem);
                return trackerItem;
            };

            self.remove = function (entity) {
                trackedItems.remove(entity);
            };

            self.save = function () {
                return saveFuture = new BASE.async.Future(function (setValue, setError) {
                    var errors = [];
                    var itemsTask = new BASE.async.Task();
                    trackedItems.getKeys().forEach(function (key) {

                        var itemSavedFuture = new BASE.async.Future(function (setValue, setError) {
                            var item = trackedItems.remove(key);
                            item.onError(function (error) {
                                errors.push(error);
                                setValue();
                            });
                            item.onSave(function (error) {
                                setValue();
                            });
                            item.save();
                        });

                        itemsTask.add(itemSavedFuture);
                        
                    });

                    itemsTask.start().whenAll(function (futures) {
                        if (errors.length > 0) {
                            setError(errors);
                        } else {
                            setValue();
                        }
                    });

                });
            };

            return self;
        };

        BASE.extend(SaveTracker, Super);

        return SaveTracker;
    }(Object));
});