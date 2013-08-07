BASE.require(["BASE.util.Observable", "BASE.util.PropertyChangedEvent"], function () {

    var SECOND_IN_MILLISECONDS = 1000;
    var MINUTE_IN_MILLISECONDS = SECOND_IN_MILLISECONDS * 60;
    var HOUR_IN_MILLISECONDS = MINUTE_IN_MILLISECONDS * 60;
    var DAY_IN_MILLISECONDS = HOUR_IN_MILLISECONDS * 24;
    var WEEK_IN_MILLISECONDS = DAY_IN_MILLISECONDS * 7;
    var YEAR_IN_MILLISECONDS = WEEK_IN_MILLISECONDS * 52;
    /*
     * Date Format 1.2.3
     * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
     * MIT license
     *
     * Includes enhancements by Scott Trenda <scott.trenda.net>
     * and Kris Kowal <cixar.com/~kris.kowal/>
     *
     * Accepts a date, a mask, or a date and a mask.
     * Returns a formatted version of the given date.
     * The date defaults to the current date/time.
     * The mask defaults to dateFormat.masks.default.
     */

    var dateFormat = function () {
        var token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
            timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
            timezoneClip = /[^-+\dA-Z]/g,
            pad = function (val, len) {
                val = String(val);
                len = len || 2;
                while (val.length < len) val = "0" + val;
                return val;
            };

        // Regexes and supporting functions are cached through closure
        return function (date, mask, utc) {
            var dF = dateFormat;

            // You can't provide utc if you skip other args (use the "UTC:" mask prefix)
            if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date;
            if (isNaN(date)) throw SyntaxError("invalid date");

            mask = String(dF.masks[mask] || mask || dF.masks["default"]);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) == "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }

            var _ = utc ? "getUTC" : "get",
                d = date[_ + "Date"](),
                D = date[_ + "Day"](),
                m = date[_ + "Month"](),
                y = date[_ + "FullYear"](),
                H = date[_ + "Hours"](),
                M = date[_ + "Minutes"](),
                s = date[_ + "Seconds"](),
                L = date[_ + "Milliseconds"](),
                o = utc ? 0 : date.getTimezoneOffset(),
                flags = {
                    d: d,
                    dd: pad(d),
                    ddd: dF.i18n.dayNames[D],
                    dddd: dF.i18n.dayNames[D + 7],
                    m: m + 1,
                    mm: pad(m + 1),
                    mmm: dF.i18n.monthNames[m],
                    mmmm: dF.i18n.monthNames[m + 12],
                    yy: String(y).slice(2),
                    yyyy: y,
                    h: H % 12 || 12,
                    hh: pad(H % 12 || 12),
                    H: H,
                    HH: pad(H),
                    M: M,
                    MM: pad(M),
                    s: s,
                    ss: pad(s),
                    l: pad(L, 3),
                    L: pad(L > 99 ? Math.round(L / 10) : L),
                    t: H < 12 ? "a" : "p",
                    tt: H < 12 ? "am" : "pm",
                    T: H < 12 ? "A" : "P",
                    TT: H < 12 ? "AM" : "PM",
                    Z: utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
                    o: (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
                    S: ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
                };

            return mask.replace(token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        };
    }();

    // Some common format strings
    dateFormat.masks = {
        "default": "ddd mmm dd yyyy HH:MM:ss",
        shortDate: "m/d/yy",
        mediumDate: "mmm d, yyyy",
        longDate: "mmmm d, yyyy",
        fullDate: "dddd, mmmm d, yyyy",
        shortTime: "h:MM TT",
        mediumTime: "h:MM:ss TT",
        longTime: "h:MM:ss TT Z",
        isoDate: "yyyy-mm-dd",
        isoTime: "HH:MM:ss",
        isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
        isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
    };

    // Internationalization strings
    dateFormat.i18n = {
        dayNames: [
            "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
            "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
        ],
        monthNames: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
            "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
        ]
    };

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

                        var event = new BASE.util.PropertyChangedEvent("dateChanged", oldValue, newValue);
                        self.notify(event);
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

                        var event = new BASE.util.PropertyChangedEvent("dateChanged", oldValue, newValue);
                        self.notify(event);
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

                        var event = new BASE.util.PropertyChangedEvent("dateChanged", oldValue, newValue);
                        self.notify(event);
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

                        var event = new BASE.util.PropertyChangedEvent("dateChanged", oldValue, newValue);
                        self.notify(event);
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

                        var event = new BASE.util.PropertyChangedEvent("dateChanged", oldValue, newValue);
                        self.notify(event);
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

                        var event = new BASE.util.PropertyChangedEvent("dateChanged", oldValue, newValue);
                        self.notify(event);
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

                        var event = new BASE.util.PropertyChangedEvent("dateChanged", oldValue, newValue);
                        self.notify(event);
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

                        var event = new BASE.util.PropertyChangedEvent("dateChanged", oldValue, newValue);
                        self.notify(event);
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
                return dateFormat(_date, format);
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