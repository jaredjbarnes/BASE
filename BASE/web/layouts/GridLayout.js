BASE.require([], function () {
    BASE.namespace("BASE.web.layouts");

    // size : {width: 100, height: 100}
    BASE.web.layouts.GridLayout = function (size) {
        var self = this;

        if (!(self instanceof BASE.web.layouts.GridLayout)) {
            throw new Error("GridLayout constructor run in the context of window.");
        }

        var getColumnCount = function () {
            return Math.floor(self.scrollViewport.width / size.width);
        };

        var getMarginWidth = function () {
            return Math.round((self.scrollViewport.width % size.width) / 2);
        };

        var rowAt = function (y) {
            return Math.floor(y / size.height);
        };

        var indexAtY = function (y) {
            return rowAt(y) * getColumnCount();
        };

        var getColumn = function (index) {
            return index % getColumnCount();
        };

        var getRow = function (index) {
            return Math.floor(index / getColumnCount());
        };

        self.tagName = "div";

        self.scrollViewport = { width: 0, height: 0 };

        self.getWidth = function (length) {
            return "100%";
        };

        self.getHeight = function (length) {
            return (Math.ceil(length / getColumnCount()) * size.height) + "px";
        };

        // region has {top: 0, left: 0, right: 0, bottom:0}
        // scrollViewport has {width: 0, height: 0}
        self.getIndexes = function (region) {
            var columnCount = getColumnCount();

            var firstIndex = indexAtY(region.top);
            var lastIndex = (indexAtY(region.bottom)) + columnCount;

            var indexes = [];
            for (var i = firstIndex; i <= lastIndex; i++) {
                indexes.push(i);
            }

            return indexes;
        };

        self.getCss = function (index) {
            var y = getRow(index) * size.height;
            var x = getColumn(index) * size.width;

            var centeredX = x + getMarginWidth();

            var transform = "translate(" + centeredX + "px," + y + "px)";

            return {
                "width": size.width + "px",
                "height": size.height + "px",
                "transform": transform,
                "-webkit-transform": transform,
                "-ms-transform": transform,
                "-moz-transform": transform
            };

        };

        self.prepareElement = function (item, element, index) {
            throw new Error("Not yet implemented");
        };

        self.cleanElement = function () {
            throw new Error("Not yet implemented");
        };

        return self;
    };

});