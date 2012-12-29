    
BASE.require(["BASE.ObserverEvent"], function(){
    BASE.ObservePropertyEvent = (function (_super) {
        BASE.extend(ObservePropertyEvent, _super);
        function ObservePropertyEvent(type, oldValue, newValue) {
            _super.call(this, type);
            this.oldValue = oldValue;
            this.newValue = newValue;
            this.property = type;
        }
        return ObservePropertyEvent;
    })(BASE.ObserverEvent);
});