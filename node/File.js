
BASE.require([
    "BASE.async.Continuation",
    "node.futurize"
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

    var getStat = function (path) {
        return futurizeWithError(fileSystem.lstat, toArray(arguments));
    };

    var writeFile = function (fileName, content) {
        return futurizeWithError(fileSystem.writeFile, toArray(arguments));
    };

    var readFile = function (path, encoding) {
        return futurizeWithError(fileSystem.readFile, toArray(arguments));
    };

    var renameFile = function (oldPath, newPath) {
        return futurizeWithError(fileSystem.rename, toArray(arguments));
    };

    var watchFile = function (path, options) {
        return futurize(fileSystem.watchFile, toArray(arguments));
    };

    var removeFile = function (path) {
        return futurizeWithError(fileSystem.unlink, [path]);
    };

    node.File = function (path) {
        var self = this;
        var watchObservers = [];

        self.read = function (encoding) {
            return readFile(path, encoding).then();
        };

        self.write = function (content) {
            return writeFile(path, content).then();
        };

        self.rename = function (newPath) {
            var oldPath = path;
            return renameFile(oldPath, newPath).then(function () {
                path = newPath;
            }).then();
        };

        self.watch = function () {
            var observer;
            var currentPath = path;

            var watchListener = function (prev, curr) {
                observer.notify({
                    previousStat: prev,
                    currentStat: curr
                });
            };

            observer = new Observer(function () {
                fileSystem.unwatchFile(currentPath, watchListener);
            });

            fileSystem.watchFile(currentPath, watchListener);

            return observer;
        };

        self.remove = function () {
            return removeFile(path).then();
        };
    };

});