BASE.require(["BASE.collections.Hashmap"], function () {
    var Hashmap = BASE.collections.Hashmap;
    
    if (!Array.prototype.union) {
        Object.defineProperty(Array.prototype, "union", {
            enumerable: false,
            configurable: true,
            value: function (array) {
                
                var hashmap = new Hashmap();
                var add = function (value) {
                    hashmap.add(value, value);
                };
                
                this.forEach(add);
                array.forEach(add);
                
                return hashmap.getValues();
            }
        });
    }
});
