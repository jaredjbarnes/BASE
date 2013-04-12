BASE.require(["BASE.data.IndexPath", "BASE.web.ui.DataLayout"], function () {
    var IndexPath = BASE.data.IndexPath;

    BASE.namespace("BASE.web.ui.layouts");

    BASE.web.ui.layouts.GridLayout = (function (Super) {
        var GridLayout = function () {

            var self = this;
            if (!(self instanceof GridLayout)) {
                return new GridLayout();
            }

            Super.call(self);

            Object.defineProperty(self, "name", {
                get: function () {
                    return "BASE.web.ui.layouts.GridLayout";
                }
            });

            var _itemHeight = 50;
            Object.defineProperty(self, "itemHeight", {
                get: function () {
                    return _itemHeight;
                },
                set: function (value) {
                    var oldValue = _itemHeight;
                    if (value !== _itemHeight) {
                        _itemHeight = value;
                        self.notify(new BASE.PropertyChangedEvent("itemHeight", oldValue, value));
                    }
                }
            });

            var _itemWidth = 50;
            Object.defineProperty(self, "itemWidth", {
                get: function () {
                    return _itemWidth;
                },
                set: function (value) {
                    var oldValue = _itemWidth;
                    if (value !== _itemWidth) {
                        _itemWidth = value;
                        self.notify(new BASE.PropertyChangedEvent("itemWidth", oldValue, value));
                    }
                }
            });

            var _itemMargin = 0;
            Object.defineProperty(self, "itemMargin", {
                get: function () {
                    return _itemMargin;
                },
                set: function (value) {
                    var oldValue = _itemMargin;
                    if (value !== _itemMargin) {
                        _itemMargin = value;
                        self.notify(new BASE.PropertyChangedEvent("itemMargin", oldValue, value));
                    }
                }
            });

            var _columnCount = 1;
            Object.defineProperty(self, "columnCount", {
                get: function () {
                    return _columnCount;
                }
            });

            var _rowCount = 1;
            Object.defineProperty(self, "rowCount", {
                get: function () {
                    return _rowCount;
                },
                set: function (value) {
                    var oldValue = _rowCount;
                    if (value !== _rowCount) {
                        _rowCount = value;
                        self.notify(new BASE.PropertyChangedEvent("rowCount", oldValue, value));
                    }
                }
            });

            var _itemIndexAtHeight = function (y) {
                y = y > 0 ? y : 0;
                return Math.floor((y / (_itemHeight + (_itemMargin * 2)))) * _columnCount;
            };



            self.attributesInRegion = function (region) {
                //This should return an array of attributes for the specified region.
                var attributes = [];

                var beginIndex = _itemIndexAtHeight(region.top) - (_columnCount);
                var endIndex = _itemIndexAtHeight(region.bottom) + (_columnCount);

                for (var x = beginIndex; x <= endIndex; x++) {
                    if (x >= 0 && x < self.collectionView.dataSource.numberOfItemsInSection(0)) {
                        attributes.push(self.attributeAtIndexPath("item", new IndexPath(0, x)));
                    }
                }
                return attributes;

            };

            var _topAtRow = function (row) {
                return (row * (_itemHeight + (_itemMargin * 2))) + _itemMargin;
            };

            var _leftAtColumn = function (column) {
                return (column * (_itemWidth + (_itemMargin * 2))) + _itemMargin;
            };

            self.attributeAtIndexPath = function (reuseId, indexPath) {
                //This should return an array of attributes
                var row = Math.floor(indexPath.row / _columnCount);
                var column = indexPath.row % _columnCount;

                var top = _topAtRow(row);
                var left = _leftAtColumn(column);

                var attribute = {
                    indexPath: indexPath,
                    style: {
                        position: "absolute",
                        top: top + "px",
                        left: left + "px",
                        width: _itemWidth + "px",
                        height: _itemHeight + "px",
                        opacity: 1
                    },
                    reuseId: reuseId
                };
                return attribute;
            };

            self.attributeWhenAppearingAtIndexPath = function (reuseId, indexPath) {
                //This should return an array of attributes
                return self.attributeAtIndexPath(reuseId, indexPath);
            };

            self.attributeWhenDisappearingAtIndexPath = function (reuseId, indexPath) {
                //This should return an array of attributes
                return self.attributeAtIndexPath(reuseId, indexPath);
            };

            self.calculateColumnCount = function () {
                _columnCount = Math.floor(self.collectionView.width / (_itemWidth + (_itemMargin * 2)));
            };

            self.calculateRowCount = function () {
                self.calculateColumnCount();
                _rowCount = Math.ceil(self.collectionView.dataSource.numberOfItemsInSection(0) / _columnCount);
            };

            self.prepareLayout = function () {
                //This should find out its new contentHeight and contentWidth, and set it!!!!!

                self.calculateRowCount();
                self.contentHeight = _rowCount * (_itemHeight + (_itemMargin * 2));

                self.contentWidth = self.collectionView.width - 25;

            };

        };

        BASE.extend(GridLayout, Super);
        return GridLayout;
    }(BASE.web.ui.DataLayout));
});
