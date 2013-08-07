BASE.require(["BASE.util.Observable", "BASE.util.PropertyChangedEvent"], function () {
    BASE.namespace("BASE.web.ui");

    BASE.web.ui.DataLayout = (function (Super) {
        var DataLayout = function () {
            var self = this;
            if (!(self instanceof arguments.callee)) {
                return new DataLayout();
            }

            Super.call(self);

            var _name = null;
            Object.defineProperty(self, "name", {
                configurable: true,
                enumerable: true,
                get: function () {
                    return "DataLayout";
                }
            });

            var _invalidateOnResize = true;
            Object.defineProperty(self, "invalidateOnResize", {
                get: function () {
                    return _invalidateOnResize;
                },
                set: function (value) {
                    var oldValue = _invalidateOnResize;
                    if (value !== _invalidateOnResize) {
                        _invalidateOnResize = value;
                        self.notify(new BASE.util.PropertyChangedEvent("invalidateOnResize", oldValue, value));
                    }
                }
            });

            var _contentWidth = null;
            Object.defineProperty(self, "contentWidth", {
                get: function () {
                    return _contentWidth;
                },
                set: function (value) {
                    var oldValue = _contentWidth;
                    if (value !== _contentWidth) {
                        _contentWidth = value;
                        self.notify(new BASE.util.PropertyChangedEvent("contentWidth", oldValue, value));
                    }
                }
            });

            var _contentHeight = null;
            Object.defineProperty(self, "contentHeight", {
                get: function () {
                    return _contentHeight;
                },
                set: function (value) {
                    var oldValue = _contentHeight;
                    if (value !== _contentHeight) {
                        _contentHeight = value;
                        self.notify(new BASE.util.PropertyChangedEvent("contentHeight", oldValue, value));
                    }
                }
            });

            var _collectionView = null;
            Object.defineProperty(self, "collectionView", {
                get: function () {
                    return _collectionView;
                },
                set: function (value) {
                    var oldValue = _collectionView;
                    if (value !== _collectionView) {
                        _collectionView = value;

                        self.prepareLayout();
                        self.notify(new BASE.util.PropertyChangedEvent("collectionView", oldValue, value));
                    }
                }
            });

            /*
                Attributes
                 {
                    indexPath: IndexPath.create(section, row),
                    style: {"top":"0px", "position":"absolute"},
                    reuseId: "Anything you want!",
                    itemId: "unique to the data"
                 }
            */

            self.attributesInRegion = function (region) {
                //This should return an array of attributes for the specified region.
                throw new Error("\"attributesInRegion\" was intended to be overriden by its subclass.");
            };

            self.attributeAtIndexPath = function (reuseId, indexPath) {
                //This should return an attribute.
                throw new Error("\"attibutesAtIndexPath\" was intended to be overriden by its subclass.");
            };

            self.attributeWhenAppearingAtIndexPath = function (reuseId, indexPath) {
                //This should return an attribute.
                throw new Error("\"attributesWhenAppearingAtIndexPath\" was intended to be overriden by its subclass.");
            };

            self.attributeWhenDisappearingAtIndexPath = function (reuseId, indexPath) {
                //This should return an attribute.
                throw new Error("\"attributesWhenDisappearingAtIndexPath\" was intended to be overriden by its subclass.");
            };

            self.prepareLayout = function () {
                //This should find out its new contentHeight and contentWidth, and set it!!!!!
                throw new Error("\"prepareLayout\" was intended to be overriden by its subclass.");
            };

            return self;
        };

        BASE.extend(DataLayout, Super);

        return DataLayout;
    }(BASE.util.Observable));
});