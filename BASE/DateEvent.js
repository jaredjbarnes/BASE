/// <reference path="http://raw.github.com/jaredjbarnes/BASE/master/BASE.js" />
/// <reference path="http://raw.github.com/jaredjbarnes/BASE/master/BASE/DateRange.js" />
/// <reference path="http://raw.github.com/jaredjbarnes/BASE/master/BASE/ObservableArray.js" />
/// <reference path="http://raw.github.com/jaredjbarnes/BASE/master/BASE/Observable.js" />

BASE.require(["BASE.DateRange", "BASE.ObservableArray", "BASE.Observable"], function(){
	BASE.DateEvent = (function(_Super){
		var DateEvent =  function(dateRange){
			if (!(this instanceof BASE.DateEvent)){
				return new BASE.DateEvent(dateRange);
			}
			
			var self = this;
			_Super.call(self);
			
			if (dateRange && dateRange instanceof BASE.DateRange){
				self.dateRange = dateRange;
			} else {
				self.dateRange = new BASE.DateRange();
			}
			
			var _description = "";
			var _title = "";
			var _items = new BASE.ObservableArray();
			
			Object.defineProperties(self, {
				"title": {
					get: function(){
						return _title;
					},
					set: function(value){
						var oldValue = _title;
						_title = value;
						var event = new BASE.PropertyChangedEvent("title", oldValue, value);
						self.notify(event);
					}
				},
				"description": {
					get: function(){
						return _description;
					},
					set: function(value){
						var oldValue = _description;
						_description = value;
						var event = new BASE.PropertyChangedEvent("description", oldValue, value);
						self.notify(event);
					}
				},
				"items": {
					get: function(){
						return _items;
					}
				}
			});
			
			return self;
		};
		
		BASE.extend(DateEvent, _Super);
		
		return DateEvent;
	})(BASE.Observable);
	
});