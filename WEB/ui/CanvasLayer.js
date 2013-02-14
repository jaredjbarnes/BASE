BASE.require(["WEB.Region","BASE.Observable"], function () {
    BASE.namespace("WEB.ui");

    WEB.ui.CanvasLayer = (function (Super) {
        var CanvasLayer = function (width, height) {
            if (!(this instanceof CanvasLayer)) {
                return CanvasLayer();
            }

            var self = this;
            Super.call(self);
            var _canvas = document.createElement("canvas");
            var _context = _canvas.getContext("2d");
            var _region = new WEB.Region(0, 0, 0, 0);
            var _id = "";

            var _resizeCanvas = function (w, h) {
                width = w;
                height = h;
                _canvas.width = w;
                _canvas.height = h;
                _region.width = w;
                _region.height = h;
            };

            _region.observe(function(e){
                _resizeCanvas(e.newValue, height);    
            }, "width");

            _region.observe(function(e){
                _resizeCanvas(width, e.newValue);
            }, "height");

            Object.defineProperties({
                "opacity": {
                    get: function () { },
                    set: function () { }
                },
                "region": {
                    get: function () {
                        return region;
                    }
                },
                "context": {
                    get: function () {
                        return _context;
                    }
                },
                "id": {
                    get: function () {
                        return _id;
                    }
                }
            });

            self.drawOnLayer = function (canvasShape) {
                canvasShape.drawTo(_context);
            };
            self.clear = function () {

            };
            self.hitTest = function (region) {
                var image = _context.getImageData(region.top - (_region.y), region.left - (_region.x), region.bottom - (_region.y), region.right - (_region.x));

                // Canvas data is like an array of bytes, every forth one is the opacity. This is one pixel [255,255,255,255] ([r,g,b,a]) 
                // Check all data to see if there is anything opaque, if so hit test returns true;
                for (var index = 3 ; index < image.data.length; index += 4) {
                    if (image.data[index] > 0) {
                        return true;
                    }
                }
                return false;
            };

            return self;
        };
        return CanvasLayer;
    })(BASE.Observable);
});