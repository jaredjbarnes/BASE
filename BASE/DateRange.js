BASE.require(["BASE.EventEmitter"], function(){
	BASE.DateRange = function(){
		if (!(this instanceof BASE.DateRange)){
			return new BASE.DateRange();
		}
		
		var self = this;
		
		//Inherit from EventEmitter;
		BASE.EventEmitter.call(self);
		
		var _startDate = new Date();
		var _endDate = new Date();
		
		Object.defineProperties(self, {
			"startDate": {
				get: function(){
					return new Date(_startDate);
				},
				set: function(){
					
				}
			},
			"endDate": {
				get: function(){
				
				},
				set: function(){
				
				}
			}
		});
		
		return self;
	};

	BASE.DateRange.prototype = new BASE.EventEmitter();
});