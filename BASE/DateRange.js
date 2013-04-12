BASE.require(["BASE.Observable","BASE.Date"], function(){
	
	BASE.DateRange = (function(_Super){
		var DateRange = function(startDate, endDate){
			if (!(this instanceof BASE.DateRange)){
				return new BASE.DateRange(startDate, endDate);
			}
			
			var self = this;
			
			//Inherit from Observer;
			_Super.call(self);
			
			var _onStartDateChanged = function(e){
				var event = new BASE.PropertyChangedEvent("startDateChanged", e.oldValue, e.newValue);
				self.notify(event);
			};
			var _onEndDateChanged = function(e){
				var event = new BASE.PropertyChangedEvent("endDateChanged", e.oldValue, e.newValue);
				self.notify(event);
			};
			
			var _startDate = typeof startDate === "undefined" ? new BASE.Date() : startDate;
			_startDate.observe(_onStartDateChanged,"dateChanged");
			var _endDate = typeof endDate === "undefined" ? new BASE.Date() : endDate;
			_endDate.observe(_onEndDateChanged,"dateChanged");
			
			Object.defineProperties(self, {
				"startDate": {
					get: function(){
						return _startDate;
					},
					set: function(date){
						_startDate.unobserve(_onStartDateChanged,"dateChanged");
						if (date.time >= _endDate.time){
							date = new BASE.Date(_endDate.time);
						}
						_startDate = date;
						_startDate.observe(_onStartDateChanged, "dateChanged");
					}
				},
				"endDate": {
					get: function(){
						return _endDate;
					},
					set: function(date){
						_endDate.unobserve(_onEndDateChanged, "dateChanged");
						if (date.time <= _startDate.time){
							date = new BASE.Date(_startDate.time);
						} 					
						_endDate = date;
						_endDate.observe(_onEndDateChanged, "dateChanged");
					}
				},
				"totalMinutesSpan":{
					get: function(){
						return Math.floor(self.totalTimeSpan/BASE.Date.MINUTE_IN_MILLISECONDS);
					}
				},
				"totalHoursSpan":{
					get: function(){
						return Math.floor(self.totalTimeSpan/BASE.Date.HOUR_IN_MILLISECONDS);
					}
				},
				"totalDaysSpan": {
					get: function(){
						return Math.floor(self.totalTimeSpan/BASE.Date.DAY_IN_MILLISECONDS);
					}
				},
				"totalWeeksSpan": {
					get: function(){
						return Math.floor(self.totalTimeSpan/BASE.Date.WEEK_IN_MILLISECONDS);
					}
				},
				"totalMonthsSpan": {
					get: function(){
						return Math.floor(self.totalTimeSpan/BASE.Date.MONTH_IN_MILLISECONDS);
					}
				},
				"totalYearsSpan":{
					get: function(){
						return Math.floor(self.totalTimeSpan/BASE.Date.YEAR_IN_MILLISECONDS);
					}
				},
				"totalTimeSpan": {
					get: function(){
						return _endDate.time - _startDate.time; 
					}
				}
			});
			
			self.union = function(dateRange){
				var start = Math.min(dateRange.startDate.time, self.startDate.time);
				var end = Math.max(dateRange.endDate.time, self.endDate.time);
		
				return new BASE.DateRange(BASE.Date(start), BASE.Date(end));
			};
			self.intersect = function(dateRange){
				var start = Math.max(dateRange.startDate.time, self.startDate.time);
				var end = Math.min(dateRange.endDate.time, self.endDate.time);
				
				if (end >= start){
					return new BASE.DateRange(BASE.Date(start), BASE.Date(end));
				} else {
					return null;
				}
			};
			self.contains = function(dateRange){
				return (dateRange.startDate.time >= self.startDate.time &&
				dateRange.endDate.time <= self.endDate.time);
			};
			self.equals = function(){
				return (dateRange.startDate.time == self.startDate.time &&
				dateRange.endDate.time == self.endDate.time);
			};
			
			return self;
		};
		
		BASE.extend(DateRange, _Super);
		
		return DateRange;
	})(BASE.Observable);

});