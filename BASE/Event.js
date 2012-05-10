BASE.Event = function (type) {
    if (!(this instanceof BASE.Event)) {
        return new Event(type);
    }

    var event = this;
    event.type = type;
    event.propagation = true;
    var isDefaultPrevented = false;

    event.stopPropagation = function () {
        event.propagation = false;
    };
    event.preventDefault = function () {
        isDefaultPrevented = true;
    };
    event.isDefaultPrevented = function () {
        return isDefaultPrevented;
    };
};