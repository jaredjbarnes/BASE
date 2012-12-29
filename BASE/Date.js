/// <reference path="http://raw.github.com/jaredjbarnes/BASE/master/BASE.js" />
/// <reference path="http://raw.github.com/jaredjbarnes/BASE/master/BASE/EventEmitter.js" />

BASE.require(["BASE.Observer","BASE.ObservePropertyEvent"], function () {

    var SECOND_IN_MILLISECONDS = 1000;
    var MINUTE_IN_MILLISECONDS = SECOND_IN_MILLISECONDS * 60;
    var HOUR_IN_MILLISECONDS = MINUTE_IN_MILLISECONDS * 60;
    var DAY_IN_MILLISECONDS = HOUR_IN_MILLISECONDS * 24;
    var WEEK_IN_MILLISECONDS = DAY_IN_MILLISECONDS * 7;
    var YEAR_IN_MILLISECONDS = WEEK_IN_MILLISECONDS * 52;

    BASE.Date = (function(_Super){
           
           var _Date = function (milliseconds) {
            ///<summary>
            ///A Utility Date class that wraps the javascript Date class. It eases modification of time, as well as fires events when the date value is changed, because it is a Event Emitter.
            ///</summary>
            ///<returns type="BASE.Date" >
            ///Returns "BASE.Date" object.
            ///</returns>
            if (!(this instanceof arguments.callee)) {
                return new _Date(milliseconds);
            }
            var self = this;
            //Inherit from Observer, like calling super.
            _Super.call(self);
    
            var _date = typeof milliseconds !== "undefined" ? new Date(milliseconds) : new Date();
            
            var prettyDay = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            var prettyMonth = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    
            Object.defineProperties(self, {
                "time": {
                    get: function () {
                        return _date.getTime();
                    },
                    set: function (time) {
                        var oldValue = _date.getTime();
                        _date.setTime(time);
                        var newValue = _date.getTime();
                        
                        var event = new BASE.ObservePropertyEvent("dateChanged", oldValue, newValue);
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
                        
                        var event = new BASE.ObservePropertyEvent("dateChanged", oldValue, newValue);
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
                        
                        var event = new BASE.ObservePropertyEvent("dateChanged", oldValue, newValue);
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
                        
                        var event = new BASE.ObservePropertyEvent("dateChanged", oldValue, newValue);
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
                        
                        var event = new BASE.ObservePropertyEvent("dateChanged", oldValue, newValue);
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
                        
                        var event = new BASE.ObservePropertyEvent("dateChanged", oldValue, newValue);
                        self.notify(event);
                    }
                },
                "week": {
                    get: function () {
                        var date = new Date(_date.getTime());
                        date.setMonth(0);
                        date.setDate(1);
    
                        var now = _date.getTime();
                        var then = date.getTime();
    
                        return Math.floor((now - then) / WEEK_IN_MILLISECONDS);
                    },
                    set: function (week) {
                        if (week < 51) {
                            var fromDate = new Date(_date.getTime());
                            fromDate.setMonth(0);
                            fromDate.setDate(1);
    
                            var toDate = new Date(fromDate.getTime() + (week * WEEK_IN_MILLISECONDS));
    
                            var oldValue = _date.getTime();
                            _date.setTime(toDate.getTime());
                            var newValue = _date.getTime();
    
                            var event = new BASE.Event("dateChanged", oldValue, newValue);
                            self.notify(event);
                        }
                    }
                },
                "month": {
                    get: function () {
                        return _date.getMonth();
                    },
                    set: function (month) {
                        var oldValue = _date.getTime();
                        _date.setMonth(month);
                        var newValue = _date.getTime();
                        
                        var event = new BASE.ObservePropertyEvent("dateChanged", oldValue, newValue);
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
                        
                        var event = new BASE.ObservePropertyEvent("dateChanged", oldValue, newValue);
                        self.notify(event);
                    }
                },
                "dayString": {
                    get: function(){
                        return prettyDay[this.day]
                    }
                },
                "monthString": {
                    get: function(){
                        return prettyMonth[this.month];
                    }
                }
            });
    
            self.addMilliseconds = function (milliseconds) {
                var result = self.milliseconds + milliseconds;
    
                if (result >= 1000) {
                    var remainder = result % 1000;
                    var seconds = Math.floor(result / 1000);
    
                    self.addSeconds(seconds);
                    result = remainder;
                }
                self.milliseconds = result;
            };
            self.addSeconds = function (seconds) {
                var result = self.seconds + seconds;
                if (result >= 60) {
                    var remainder = result % 60;
                    var minutes = Math.floor(result / 60);
    
                    self.addMinutes(minutes);
                    result = remainder;
                }
                self.seconds = result;
            };
            self.addMinutes = function (minutes) {
                var result = self.minutes + minutes;
                if (result >= 60) {
                    var remainder = result % 60;
                    var hours = Math.floor(result / 60);
    
                    self.addHours(hours);
                    result = remainder;
                }
                self.minutes = result;
            };
            self.addHours = function (hours) {
                var result = self.hours + hours;
                if (result >= 24) {
                    var remainder = result % 24;
                    var days = Math.floor(result / 24);
    
                    self.addDays(days);
                    result = remainder;
                }
                self.hours = result;
            };
            self.addDays = function (days) {
                var result = self.day + days;
                if (result >= 7) {
                    var remainder = result % 7;
                    var weeks = Math.floor(result / 7);
    
                    self.addWeeks(weeks);
                    result = remainder;
                }
                self.day = result;
            };
            self.addWeeks = function (weeks) {
                var result = self.week + weeks;
                if (result >= 52) {
                    var remainder = result % 52;
                    var years = Math.floor(result / 52);
    
                    self.addYears(years);
                    result = remainder;
                }
                self.week = result;
            };
            self.addMonths = function (months) {
                var result = (self.month + 1) + months;
                if (result >= 12) {
                    var remainder = result % 12;
                    var years = Math.floor(result / 12);
    
                    self.addYears(years);
                    result = remainder;
                }
                self.month = result - 1;
            };
            self.addYears = function (years) {
                self.year = self.year + years;
            };
    
            self.equals = function (date) {
                return date.time === self.time;
            }
    
            self.toString = function () {
                return _date.toString();
            };
    
            return self;
        };
        
        BASE.extend(_Date, _Super);
        
        return _Date;
    })(BASE.Observer);


    BASE.Date.SECOND_IN_MILLISECONDS = SECOND_IN_MILLISECONDS;
    BASE.Date.MINUTE_IN_MILLISECONDS = MINUTE_IN_MILLISECONDS;
    BASE.Date.HOUR_IN_MILLISECONDS = HOUR_IN_MILLISECONDS;
    BASE.Date.DAY_IN_MILLISECONDS = DAY_IN_MILLISECONDS;
    BASE.Date.WEEK_IN_MILLISECONDS = WEEK_IN_MILLISECONDS;
    BASE.Date.YEAR_IN_MILLISECONDS = YEAR_IN_MILLISECONDS;

});