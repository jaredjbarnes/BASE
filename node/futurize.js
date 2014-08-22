(function () {

    var Future = BASE.async.Future;

    var futurizeWithError = function (method, args) {
        return new Future(function (setValue, setError) {
            args.push(function (err, value) {
                if (err) {
                    setError(err);
                } else if (arguments.length > 2) {
                    setValue(Array.prototype.slice.apply(arguments, 1));
                } else {
                    setValue(value);
                }

            });
            method.apply(method, args);
        });
    };


    var futurize = function (method, args) {
        return new Future(function (setValue, setError) {
            args.push(function (value) {
                if (arguments.length > 1) {
                    setValue(Array.prototype.slice.apply(arguments, 1));
                } else {
                    setValue(value);
                }

            });
            method.apply(method, args);
        });
    };

    BASE.namespace("node");

    node.futurize = futurize;
    node.futurizeWithError = futurizeWithError;

}());