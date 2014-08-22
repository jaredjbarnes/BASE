
BASE.require([
    "node.futurize",
    "BASE.async.Continuation"
], function () {

    var fileSystem = require("fs");

    BASE.namespace("node");

    var Future = BASE.async.Future;
    var Task = BASE.async.Task;
    var Continuation = BASE.async.Continuation;
    var Observer = BASE.util.Observer;

    var futurize = node.futurize;
    var futurizeWithError = node.futurizeWithError;

    var toArray = function (arrayLike) {
        return Array.prototype.slice.call(arrayLike, 0);
    };

    var makeDirectory = function (path) {
        return futurizeWithError(fileSystem.mkdir, toArray(arguments));
    };

    var readDirectory = function (path) {
        return futurizeWithError(fileSystem.readdir, [path]);
    };

    var makeFullDirectory = function (path) {
        var directories = path.split("/");

        return directories.reduce(function (continuation, next, index) {
            return continuation.then(function () {
                return new Future(function (setValue, setError) {
                    var path = directories.slice(0, index + 1).join("/");

                    getStat(path).then(function (stat) {
                        if (stat.isDirectory()) {
                            setValue();
                        } else {
                            makeDirectory(path).then(setValue).ifError(setValue);
                        }
                    }).ifError(function () {
                        makeDirectory(path).then(setValue).ifError(setValue);
                    });
                });
            });
        }, new Continuation(Future.fromResult(null)));

    };

    var removeDirectory = function (path) {
        return futurizeWithError(fileSystem.rmdir, [path]);
    };

    var removeFullDirectory = function (path) {
        return new Future(function (setValue, setError) {
            getStat(path).then(function (stat) {
                if (stat.isDirectory()) {
                    readDirectory(path).then(function (files) {
                        var task = new Task();

                        files.forEach(function (filePath) {
                            task.add(removeFullDirectory([path, filePath].join("/")));
                        });

                        task.start().whenAll(function () {
                            removeDirectory(path).then(setValue);
                        });
                    });
                } else {
                    removeFile(path).then(setValue).ifError(setValue);
                }

            }).ifError(setError);
        });
    };

    var getStat = function (path) {
        return futurizeWithError(fileSystem.lstat, toArray(arguments));
    };

    node.Directory = function (path) {
        var self = this;

        self.create = function () {
            return makeFullDirectory(path).then();
        };

        self.remove = function () {
            return removeFullDirectory(path).then();
        };
    };
});