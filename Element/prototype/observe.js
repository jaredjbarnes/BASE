BASE.require([
    "BASE.util.Observer",
    "jQuery"
], function () {
    var Observer = BASE.util.Observer;

    Element.prototype.observe = function (type) {
        var $elem = $(this);
        var wrapper = function (e) {
            observer.notify(e);
        };

        $elem.bind(type, wrapper);
        var observer = new Observer(function () {
            $elem.unbind(type, wrapper);
        });

        return observer;
    };
})