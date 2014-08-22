BASE.require([
    "BASE.util.Observable",
], function () {

    BASE.namespace("BASE.time");

    var Observable = BASE.util.Observable;

    BASE.time.DateRange = function (startDate, endDate) {
        var self = this;

        BASE.assertNotGlobal(self);
        Observable.call(self);

        // We copy the dates so people cant change them out from under us.
        self.setStartDate = function (date) {
            var oldValue = startDate;
            if (date.getTime() !== oldValue) {
                startDate = new Date(date.getTime());
                self.notify({
                    type: "startDateChange",
                    oldValue: new Date(oldValue.getTime()),
                    newValue: new Date(startDate.getTime())
                });
            }
        };

        // We copy the dates so people cant change them out from under us.
        self.setEndDate = function (date) {
            var oldValue = endDate;
            if (date.getTime() !== oldValue) {
                endDate = new Date(date.getTime());
                self.notify({
                    type: "endDateChange",
                    oldValue: new Date(oldValue.getTime()),
                    newValue: new Date(endDate.getTime())
                });
            }
        };

        self.getStartDate = function () {
            return new Date(startDate.getTime());
        };

        self.getEndDate = function () {
            return new Date(endDate.getTime());
        };

        self.union = function (dateRange) {
            var startDate;
            var endDate;

            if (dateRange.getStartDate().getTime() <= self.getStartDate().getTime()) {
                startDate = new Date(dateRange.getStartDate().getTime());
            } else {
                startDate = new Date(self.getStartDate().getTime());
            }

            if (dateRange.getEndDate().getTime() >= self.getEndDate().getTime()) {
                endDate = new Date(dateRange.getEndDate().getTime());
            } else {
                endDate = new Date(self.getEndDate().getTime());
            }

            return new BASE.time.DateRange(startDate, endDate);
        };


        self.intersect = function (dateRange) {
            var startDate;
            var endDate;

            if (dateRange.getStartDate().getTime() >= self.getStartDate().getTime()) {
                startDate = new Date(dateRange.getStartDate().getTime());
            } else {
                startDate = new Date(self.getStartDate().getTime());
            }

            if (dateRange.getEndDate().getTime() <= self.getEndDate().getTime()) {
                endDate = new Date(dateRange.getEndDate().getTime());
            } else {
                endDate = new Date(self.getEndDate().getTime());
            }

            if (startDate < endDate) {
                return new BASE.time.DateRange(startDate, endDate);
            } else {
                return null;
            }
        };

        self.contains = function (dateRange) {
            if (dateRange.getStartDate().getTime() >= self.getStartDate().getTime() &&
                dateRange.getEndDate().getTime() <= self.getEndDate().getTime()) {
                return true;
            }

            return false;
        };

        self.equals = function (dateRange) {
            if (!dateRange) {
                return false;
            }

            if (dateRange.getStartDate().getTime() === self.getStartDate().getTime() &&
                dateRange.getEndDate().getTime() === self.getEndDate().getTime()) {
                return true;
            }

            return false;
        };

        return self;
    };


});