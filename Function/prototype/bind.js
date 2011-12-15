if (!Function.prototype.hasOwnProperty("bind")){
    Function.prototype.bind = function (object) {
        var slice = Array.prototype.slice;
        var func = this;
        var args = slice.call(arguments, 1);
        return function () {
            return func.apply(object, args.concat(slice.call(arguments, 0)));
        };
    };
}