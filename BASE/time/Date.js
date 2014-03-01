BASE.require(["BASE.util.Observable", "Date.prototype.format"], function () {

    var SECOND_IN_MILLISECONDS = 1000;
    var MINUTE_IN_MILLISECONDS = SECOND_IN_MILLISECONDS * 60;
    var HOUR_IN_MILLISECONDS = MINUTE_IN_MILLISECONDS * 60;
    var DAY_IN_MILLISECONDS = HOUR_IN_MILLISECONDS * 24;
    var WEEK_IN_MILLISECONDS = DAY_IN_MILLISECONDS * 7;
    var YEAR_IN_MILLISECONDS = WEEK_IN_MILLISECONDS * 52;

    BASE.namespace("BASE.time");

    BASE.time.Date = (function (_Super) {

        var _Date = function (milliseconds) {
            ///<summary>
            ///A Utility Date class that wraps the javascript Date class. It eases modification of time, as well as fires events when the date value is changed, because it is a Event Emitter.
            ///</summary>
            ///<returns type="BASE.time.Date" >
            ///Returns "BASE.time.Date" object.
            ///</returns>
            if (!(this instanceof arguments.callee)) {
                return new _Date(milliseconds);
            }
            var self = this;
            //Inherit from Observer, like calling super.
            _Super.call(self);

            var _date = typeof milliseconds !== "undefined" ? new Date(milliseconds) : new Date();

            var prettyDay = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var prettyMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            Object.defineProperties(self, {
                "time": {
                    get: function () {
                        return _date.getTime();
                    },
                    set: function (time) {
                        var oldValue = _date.getTime();
                        _date.setTime(time);
                        var newValue = _date.getTime();

                        self.notify({
                            type: "dateChanged",
                            oldValue: oldValue,
                            newValue: newValue
                        });
                    }
                },
                "milliseconds": {
                    get: function () {
                        return _date.getMilliseconds();
                    },
                    set: function (milliseconds) {
                        self.time = milliseconds;
                    }
                },
                "seconds": {
                    get: function () {
                        return _date.getSeconds();
                    },
                    set: function (seconds) {
                        var oldValue = _date.getTime();
                        _date.setSeconds(seconds);
                        var newValue = _date.getTime();

                        self.notify({
                            type: "dateChanged",
                            oldValue: oldValue,
                            newValue: newValue
                        });
                    }
                },
                "minutes": {
                    get: function () {
                        return _date.getMinutes();
                    },
                    set: function (minutes) {
                        var oldValue = _date.getTime();
                        _date.setMinutes(minutes);
                        var newValue = _date.getTime();

                        self.notify({
                            type: "dateChanged",
                            oldValue: oldValue,
                            newValue: newValue
                        });
                    }
                },
                "hours": {
                    get: function () {
                        return _date.getHours();
                    },
                    set: function (hours) {
                        var oldValue = _date.getTime();
                        _date.setHours(hours);
                        var newValue = _date.getTime();

                        self.notify({
                            type: "dateChanged",
                            oldValue: oldValue,
                            newValue: newValue
                        });
                    }
                },
                "date": {
                    get: function () {
                        return _date.getDate();
                    },
                    set: function (date) {
                        var oldValue = _date.getTime();
                        _date.setDate(date);
                        var newValue = _date.getTime();

                        self.notify({
                            type: "dateChanged",
                            oldValue: oldValue,
                            newValue: newValue
                        });
                    }
                },
                "day": {
                    get: function () {
                        return _date.getDay();
                    },
                    set: function (day) {
                        day = _date.getDate() - _date.getDay() + day;

                        var oldValue = _date.getTime();
                        _date.setDate(day);
                        var newValue = _date.getTime();

                        self.notify({
                            type: "dateChanged",
                            oldValue: oldValue,
                            newValue: newValue
                        });
                    }
                },
                "month": {
                    get: function () {
                        return _date.getMonth() + 1;
                    },
                    set: function (month) {
                        var oldValue = _date.getTime();
                        _date.setMonth(month - 1);
                        var newValue = _date.getTime();

                        self.notify({
                            type: "dateChanged",
                            oldValue: oldValue,
                            newValue: newValue
                        });
                    }
                },
                "year": {
                    get: function () {
                        return _date.getFullYear();
                    },
                    set: function (year) {
                        var oldValue = _date.getTime();
                        _date.setFullYear(year);
                        var newValue = _date.getTime();

                        self.notify({
                            type: "dateChanged",
                            oldValue: oldValue,
                            newValue: newValue
                        });
                    }
                },
                "dayString": {
                    get: function () {
                        return prettyDay[this.day]
                    }
                },
                "monthString": {
                    get: function () {
                        return prettyMonth[this.month - 1];
                    }
                }
            });

            self.addMilliseconds = function (milliseconds) {
                _date.setTime(_date.getTime() = milliseconds);
            };
            self.addSeconds = function (seconds) {
                _date.setTime(_date.getTime() + (seconds * SECOND_IN_MILLISECONDS));
            };
            self.addMinutes = function (minutes) {
                _date.setTime(_date.getTime() + (minutes * MINUTE_IN_MILLISECONDS));
            };
            self.addHours = function (hours) {
                _date.setTime(_date.getTime() + (hours * HOUR_IN_MILLISECONDS));
            };
            self.addDays = function (days) {
                _date.setTime(_date.getTime() + (days * DAY_IN_MILLISECONDS));
            };
            self.addWeeks = function (weeks) {
                _date.setTime(_date.getTime() + (weeks * WEEK_IN_MILLISECONDS));
            };
            self.addMonths = function (months) {
                var result = self.month + months;
                if (result > 12) {
                    var remainder = result % 12;
                    var years = Math.floor(result / 12);

                    self.addYears(years);
                    result = remainder;
                }
                self.month = result;
            };
            self.addYears = function (years) {
                self.year = self.year + years;
            };

            self.equals = function (date) {
                return date.time === self.time;
            }

            self.toString = function (format) {
                return _date.format(format);
            };

            return self;
        };

        BASE.extend(_Date, _Super);


        return _Date;
    })(BASE.util.Observable);


    BASE.time.Date.SECOND_IN_MILLISECONDS = SECOND_IN_MILLISECONDS;
    BASE.time.Date.MINUTE_IN_MILLISECONDS = MINUTE_IN_MILLISECONDS;
    BASE.time.Date.HOUR_IN_MILLISECONDS = HOUR_IN_MILLISECONDS;
    BASE.time.Date.DAY_IN_MILLISECONDS = DAY_IN_MILLISECONDS;
    BASE.time.Date.WEEK_IN_MILLISECONDS = WEEK_IN_MILLISECONDS;
    BASE.time.Date.YEAR_IN_MILLISECONDS = YEAR_IN_MILLISECONDS;

});