if (!Array.prototype.hasOwnProperty("every")) {
    Array.prototype.every = function (fn, thisp) {
        ///<summary>
        ///Invokes a function for each item in the array.
        ///</summary>
        ///<param name="fn" type="Function">
        ///The function to be run on every item. If function returns true, it continues to execute on each item. If function returns false, it stops and returns false to the original caller.
        ///function(item, index, thisArray){/*...*/}
        ///</param>
        ///<param name="thisp" type="Object">
        ///Declaring the "this" object inside the scope of the function.
        ///</param>
        ///<returns type="Boolean" />
        var i;
        var length = this.length;
        for (i = 0; i < length; i += 1) {
            if (this.hasOwnProperty(i) && !fn.call(thisp, this[i], i, this)) {
                return false;
            }
        }
        return true;
    };
}