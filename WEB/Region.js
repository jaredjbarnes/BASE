BASE.require(["BASE.Observer","BASE.PropertyChangedEvent"], function () {
    BASE.namespace("WEB");
    
    WEB.Region = (function(_Super){
        var Region = function (t, r, b, l) {
            var self = this;
            if (!(self instanceof arguments.callee)){
                return new Region(t,r,b,l);
            }
            
            _Super.call(self);
            
            var regionPinnedTo  = null;
            var observe = function(e){
                var offsetY = y + regionPinnedTo.y;
                var offsetX = x + regionPinnedTo.x;

                self.setRegion(offsetY, (offsetX) + self.width, offsetY + self.height, offsetX);
            };
            
            self.contains = function(region){
                return (region.left >= self.left &&
               region.right <= self.right &&
               region.top >= self.top &&
               region.bottom <= self.bottom);
            };
            self.getArea = function(){
                return ((self.bottom - self.top) * (self.right - self.left));
            };
            self.intersect = function(region){
                var t = Math.max(self.top, region.top),
                r = Math.min(self.right, region.right),
                b = Math.min(self.bottom, region.bottom),
                l = Math.max(self.left, region.left);

                if (b >= t && r >= l) {
                    return new Region(t, r, b, l);
                } else {
                    return null;
                }
            };
            self.moveTopSideTo = function(val){
                if (typeof val === "number" && self.bottom >= val) {
                    self.setRegion(val, self.right, self.bottom, self.left);
                }    
            };
            self.moveRightSideTo = function(val){
                if (typeof val === "number" && val >= self.left) {
                    self.setRegion(self.top, val, self.bottom, self.left);
                }
            };
            self.moveBottomSideTo = function(val){
                if (typeof val === "number" && val >= self.top) {
                    self.setRegion(self.top, self.right, val, self.left);
                }    
            };
            self.moveLeftSideTo = function(val){
                if (typeof val === "number" && self.right >= val) {
                    self.setRegion(self.top, self.right, self.bottom, val);
                }    
            };
            self.setRegionTo = function(region){
                self.setRegion(region.top, region.right, region.bottom, region.left);
            };
            self.setRegion = function(top, right, bottom, left){
                if (bottom >= top && right >= left) {
                    this.top = top;
                    this.y = top;
                    this[1] = top;
                    this.right = right;
                    this.bottom = bottom;
                    this.left = left;
                    this.x = left;
                    this[0] = left;
                    this.width = this.right - this.left;
                    this.height = this.bottom - this.top;
                } else {
                    throw new Error("Invalid Region Instantiation: top=" + top + ", right=" + right + ", bottom=" + bottom + ", left=" + left + ".");
                }
            };
            self.moveToPoint = function(x,y){
                self.setRegion(y, x + self.width, y + self.height, x);
                self.notify();
            };
            self.pinToRegion = function(region){
                self.unPin();
                regionPinnedTo = region;
                regionPinnedTo.observe(observe,"x");
                regionPinnedTo.observe(observe, "y");
            };
            self.unPin = function(){
                if(regionPinnedTo){
                    regionPinnedTo.unobserve(observe, "x");
                    regionPinnedTo.unobserve(observe, "y");
                    regionPinnedTo = null;
                }
            };
            self.union = function(region){
                var t = Math.min(self.top, region.top),
                r = Math.max(self.right, region.right),
                b = Math.max(self.bottom, region.bottom),
                l = Math.min(self.left, region.left);
    
                return new Region(t, r, b, l);    
            };
            self.equals = function(region){
                return (region.top === self.top && region.right === self.right && region.bottom === self.bottom && region.left === self.left) ? true : false;    
            };
            self.toString = function(){
                return ("Region {" +
               "top: " + self.top +
               ", right: " + self.right +
               ", bottom: " + self.bottom +
               ", left: " + self.left +
               ", height: " + self.height +
               ", width: " + self.width +
               "}");
            };
            self.copy = function(){
                return new WEB.Region(self.top, self.right, self.bottom, self.left);
            };
            
            self.setRegion(t, r, b, l);
            
            return self
        }
        
        BASE.extend(Region, _Super);
        
        return Region
    })(BASE.Observer);

});