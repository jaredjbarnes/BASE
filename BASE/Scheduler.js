BASE.require(["BASE.DateEvent","BASE.ObservableArray","BASE.EventEmitter"], function(){

	BASE.Scheduler = function(){
		if (!(this instanceof BASE.Scheduler)){
			return new BASE.Scheduler();
		}
		
		BASE.EventEmitter.call(self);
		
		var self = this;
		var _dateEvents = new BASE.ObservableArray();
		
		Object.defineProperties(self, {
			"dateEvents": {
				get: function(){
					return _dateEvents.slice();
				}
			},
			"addDateEvent", {
				value: function(dateEvent){
					if (dateEvent instanceof BASE.DateEvent){
						_dateEvents.push(dateEvent);
						
						var event = new BASE.Event("dateEventAdded");
						event.dateEvent = dateEvent;
						
						self.emit(event);
					}
				},
				writable: false
			},
			"removeDateEvent", {
				value: function(dateEvent){
					var index = _dateEvents.indexOf(dateEvent);
					if (index > -1) {
						_dateEvents.splice(index, 1);
						
						var event = new BASE.Event("dateEventRemoved");
						event.dateEvent = dateEvent;
						
						self.emit(event);
					}
				},
				writable: false
			}
		});
		
		return self;
	};
	BASE.Scheduler.prototype = new BASE.EventEmitter();
	

});