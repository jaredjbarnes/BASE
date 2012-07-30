BASE.require(["BASE.DateRange", "BASE.ObservableArray"], function(){
	
	BASE.DateEvent = function(dateRange){
		if (!(this instanceof BASE.DateEvent)){
			return new BASE.DateEvent(dateRange);
		}
		
		BASE.EventEmitter.call(self);
		var self = this;
		
		if (dateRange && dateRange instanceof BASE.DateRange){
			self.dateRange = dateRange;
		} else {
			self.dateRange = new Base.DateRange();
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
					var event = new BASE.Event("titleChanged")
					event.oldValue = _title;
					event.newValue = value;
					
					_title = value;
					self.emit(event);
				}
			},
			"description": {
				get: function(){
					return _description;
				},
				set: function(value){
					var event = new BASE.Event("descriptionChanged")
					event.oldValue = _description;
					event.newValue = value;
					
					_description = value;
					self.emit(event);
				}
			},
			"items": {
				get: function(){
					return _items.slice();
				}
			},
			"addItem": {
				value: function(item){
					_items.push(item);
					
					var event = new BASE.Event("itemAdded");
					event.item = item;
					self.emit(event);
				},
				writable: false
			},
			"removeItem": {
				value: function(item){
					var index = _items.indexOf(item);
					if (index > -1){
						_items.splice(index, 1);
					
						var event = new BASE.Event("itemRemoved");
						event.item = item;
						self.emit(event);
					}
				},
				writable: false
			}
		});
		
		return self;
	};
	
	BASE.DateEvent.prototype = new BASE.EventEmitter();
	
});