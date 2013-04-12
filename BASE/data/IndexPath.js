BASE.require(["Object"], function () {
    BASE.namespace("BASE.data");

    BASE.data.IndexPath = (function (Super) {
        var IndexPath = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new IndexPath();
            }

            var indexes = Array.prototype.slice.call(arguments, 0);

            if (indexes.length < 2) {
                throw new Error("IndexPath needs to at least have a first and second index.");
            }

            Object.defineProperty(self, "length", {
                get: function () {
                    return indexes.length;
                }
            });

            Object.defineProperty(self, "section", {
                get: function () {
                    return indexes[0];
                }
            });

            Object.defineProperty(self, "row", {
                get: function () {
                    return indexes[1];
                }
            });

            self.getIndexAt = function (position) {
                if (position >= indexes.length) {
                    return null;
                } else {
                    return indexes[position];
                }
            };

            self.addIndex = function (index) {
                indexes.push(index >= 0 ? index : 0);
            };

            self.removeLastIndex = function () {
                if (indexes.length > 2) {
                    indexes.pop();
                }
            };

            self.getIndexes = function () {
                return indexes.slice(0);
            };

            self.equals = function (indexPath) {
                //TODO: compare each index and position.
                for (var x = 0 ; x < indexPath.length ; x++) {
                    if (indexPath.indexAtPosition(x) !== self.indexAtPosition(x)) {
                        return false;
                    }
                }

                return true;
            };

            self.toString = function () {
                return indexes.join(".");
            };

            return self;
        };

        BASE.extend(IndexPath, Super);

        return IndexPath;
    }(Object));
});