    
BASE.require(["BASE.ObserverEvent"], function(){
    BASE.PropertyChangedEvent = (function (_super) {
        BASE.extend(PropertyChangedEvent, _super);
        function PropertyChangedEvent(property, oldValue, newValue) {
            _super.call(this, property);
            this.oldValue = oldValue;
            this.newValue = newValue;
            this.property = property;
        }
        return PropertyChangedEvent;
    })(BASE.ObserverEvent);
});