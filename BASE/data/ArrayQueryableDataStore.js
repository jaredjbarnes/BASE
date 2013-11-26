BASE.require([
    "Array.prototype.asQueryable",
    "BASE.util.Observable",
    "BASE.async.Future",
    "BASE.async.Task"
], function () {

    BASE.namespace("BASE.data");

    BASE.data.ArrayQueryableDataStore = (function (Super) {
        var ArrayQueryableDataStore = function (array) {
            var self = this;

            if (!(self instanceof arguments.callee)) {
                throw new Error("ArrayQueryableDataStore constructor was not executed with the right context.");
            }

            Super.call();


            self.asQueryable = function (Type) {
                return array.asQueryable(Type);
            };

            self.add = function () { };

            self.remove = function () { };

            self.update = function () { };

        };

        BASE.extend(ArrayQueryableDataStore, Super);

        return ArrayQueryableDataStore;
    }(BASE.util.Observable));

});