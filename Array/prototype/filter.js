if (!Array.prototype.hasOwnProperty("filter")) {
    Array.prototype.filter = function (fn, thisp) {
        ///<summary>
        ///Invokes a function on each item to filter, and creates a new array with items that returned true on the filter function.
        ///</summary>
        ///<param name="fn" type="Function">
        ///The function to be run on every item. If the function returns true, it adds the item to the returned array. If the function returns false, it doesn't add the item to the returned array.
        ///function(item, index, thisArray){/*...*/}
        ///</param>
        ///<param name="thisp" type="Object">
        ///Declaring the "this" object inside the scope of the function.
        ///</param>
        ///<returns type="Array" />
        var i;
        var length = this.length;
        var result = [];
        var value;

        for (i = 0; i < length; i += 1) {
            if (this.hasOwnProperty(i)) {
                value = this[i];
                if (fn.call(thisp, value, i, this)) {
                    result.push(value);
                }
            }
        }
        return result;
    };
}