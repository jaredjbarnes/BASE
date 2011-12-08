BASE.require(['jQuery', 'leavitt.App'], function () {
    BASE.namespace('leavitt.App.prototype');

    var prototype = leavitt.App.prototype;
    prototype.touch = { version: '0.0.1' };

    $(document).bind('touchstart', function (e) {
        var oEvent = e.originalEvent;
        var event = new $.Event('tapstart');
        event.touches = oEvent.touches;

        $(e.target).trigger(event);

        if (event.isDefaultPrevented()) {
            return false;
        }
    });

    $(document).bind('touchmove', function (e) {
        var oEvent = e.originalEvent;
        var event = new $.Event('tapmove');
        event.touches = oEvent.touches;

        $(e.target).trigger(event);

        if (event.isDefaultPrevented()) {
            return false;
        }
    });

    $(document).bind('touchend', function (e) {
        var oEvent = e.originalEvent;
        var event = new $.Event('tapend');
        event.touches = oEvent.touches;

        $(e.target).trigger(event);

        if (event.isDefaultPrevented()) {
            return false;
        }
    });

    $(document).bind('touchcancel', function (e) {

    });

});