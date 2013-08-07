BASE.namespace("BASE.util");

BASE.util.ObservableEvent = (function () {
    function ObserverEvent(type) {
        this.type = type;
    }
    return ObserverEvent;
})();