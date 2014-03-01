BASE.require(["BASE.time.DateRange", "BASE.collections.ObservableArray", "BASE.util.Observable"], function(){

    BASE.namespace("BASE.time");

    BASE.time.DateEvent = (function (_Super) {
		var DateEvent =  function(dateRange){
			if (!(this instanceof BASE.time.DateEvent)){
				return new BASE.time.DateEvent(dateRange);
			}
			
			var self = this;
			_Super.call(self);
			
			if (dateRange && dateRange instanceof BASE.time.DateRange){
				self.dateRange = dateRange;
			} else {
				self.dateRange = new BASE.time.DateRange();
			}
			
			var _description = "";
			var _title = "";
			var _items = new BASE.collections.ObservableArray();
			
			Object.defineProperties(self, {
				"title": {
					get: function(){
						return _title;
					},
					set: function(value){
						var oldValue = _title;
						_title = value;
						self.notify({
						    type: "title",
						    oldValue: oldValue,
						    newValue: newValue
						});
					}
				},
				"description": {
					get: function(){
						return _description;
					},
					set: function(value){
						var oldValue = _description;
						_description = value;
						self.notify({
						    type: "description",
						    oldValue: oldValue,
						    newValue: newValue
						});
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
	})(BASE.util.Observable);
	
});