BASE.require(["BASE.EventEmitter"], function(){
	
	var SECOND_IN_MILLISECONDS = 1000;
	var MINUTE_IN_MILLISECONDS = SECOND_IN_MILLSECONDS * 60;
	var HOUR_IN_MILLISECONDS = MINUTE_IN_MILLISECONDS * 60;
	var DAY_IN_MILLISECONDS = HOUR_IN_MILLISECONDS * 24;
	var WEEK_IN_MILLISECONDS = DAY_IN_MILLISECONDS * 7;
	var YEAR_IN_MILLISECONDS = WEEK_IN_MILLISECONDS * 52;

	BASE.Date = function( milliseconds ){
		if (!(this instanceof BASE.Date)){
			return new BASE.Date(milliseconds);
		}
		var self = this;
		//Inherit from EventEmitter, like calling super.
		BASE.EventEmitter.call(self);
		
		var _date = typeof milliseconds !== "undefined" ? new Date(milliseconds) :  new Date();
		
		Object.defineProperties(self, {
			"time": {
				get: function(){
					return _date.getTime(); 
				},
				set: function(time){
					var event = new BASE.Event("dateChanged");
					event.oldValue = _date.getTime();					
					_date.setTime(time);
					event.newValue = _date.getTime();
					
					self.emit(event);
				}
			},
			"milliseconds":{
				get: function(){
					_date.getMilliseconds();
				},
				set: function(milliseconds){
					var event = new BASE.Event("dateChanged");
					event.oldValue = _date.getTime();					
					_date.setMilliseconds(milliseconds);
					event.newValue = _date.getTime();
					
					self.emit(event);
				}
			},
			"seconds":{
				get: function(){
					return _date.getSeconds();
				},
				set: function(seconds){
					var event = new BASE.Event("dateChanged");
					event.oldValue = _date.getTime();					
					_date.setSeconds(seconds);
					event.newValue = _date.getTime();
					
					self.emit(event);
				}
			},
			"minutes":{
				get: function(){
					return _date.getMinutes();
				},
				set: function(minutes){
					var event = new BASE.Event("dateChanged");
					event.oldValue = _date.getTime();					
					_date.setMinutes(minutes);
					event.newValue = _date.getTime();
					
					self.emit(event);
				}
			},
			"hours":{
				get: function(){
					return _date.getHours();
				},
				set: function( hours ){
					var event = new BASE.Event("dateChanged");
					event.oldValue = _date.getTime();
					_date.setHours(hours);
					event.newValue = _date.getTime();
					
					self.emit(event);
				}
			},
			"date":{
				get: function(){
					return _date.getDate();
				},
				set: function(date){
					var event = new BASE.Event("dateChanged");
					event.oldValue = _date.getTime();					
					_date.setDate(date);
					event.newValue = _date.getTime();
					
					self.emit(event);
				}
			},
			"day":{
				get: function(){
					return _date.getDay();
				},
				set: function(day){
					var event = new BASE.Event("dateChanged");
					event.oldValue = _date.getTime();					
					_date.setDay(day);
					event.newValue = _date.getTime();
					
					self.emit(event);
				}
			},
			"month":{
				get: function(){
					return _date.getMonth();
				},
				set: function(month){
					var event = new BASE.Event("dateChanged");
					event.oldValue = _date.getTime();					
					_date.setMonth(month);
					event.newValue = _date.getTime();
					
					self.emit(event);
				}
			},
			"year":{
				get: function(){
					return _date.getYear();
				},
				set: function(year){
					var event = new BASE.Event("dateChanged");
					event.oldValue = _date.getTime();					
					_date.setYear(year);
					event.newValue = _date.getTime();
					
					self.emit(event);
				}
			}
		});
		
		self.addMilliseconds = function( milliseconds ){
			var result = self.milliseconds + milliseconds;
			
			if (result >= 1000) {
				var remainder = result%1000;
				var seconds = Math.floor(result/1000);
				
				self.setSeconds(seconds);
				result = remainder;
			}
			self.milliseconds = result;
		};
		self.addSeconds = function(seconds){
			var result = self.seconds + seconds;
			if (result >= 60){
				var remainder = result%60;
				var minutes = Math.floor(result/60);
				
				self.addMinutes(minutes);
				result = remainder;
			}
			self.seconds = result;
		};
		self.addMinutes = function(minutes){
			var result = self.minutes + minutes;
			if (result >= 60){
				var remainder = result%60;
				var hours = Math.floor(result/60);
				
				self.addHours(hours);
				result = remainder;
			}
			self.minutes = result;
		};
		self.addHours = function(hours){
			var result = self.hours + hours;
			if (result >= 24){
				var remainder = result%24;
				var days = Math.floor(result/24);
				
				self.addDays(days);
				result = remainder;
			}
			self.hours = result;
		};
		self.addDays = function(days){
			var result = self.days + days;
			if (result >= 7){
				var remainder = result%7;
				var weeks = Math.floor(result/7);
				
				self.addWeeks(weeks);
				result = remainder;
			}
			self.days = result;
		};
		self.addWeeks = function(weeks){
			var result = self.weeks + weeks;
			if (result >= 52){
				var remainder = result%52;
				var years = Math.floor(result/52);
				
				self.addYears(years);
				result = remainder;
			}
			self.weeks = result;
		};
		self.addMonths = function(months){
			var result = self.months + months;
			if (result >= 12){
				var remainder = result%12;
				var years = Math.floor(result/12);
				
				self.addYears(years);
				result = remainder;
			}
			self.months = result;
		};		
		self.addYears = function(years){
			self.years = self.years + years;
		};
		
		self.equals = function(date){
			return date.time === self.time;
		}
	};
	
	BASE.Date.prototype = new BASE.EventEmitter();
});