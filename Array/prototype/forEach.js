if (!Array.prototype.hasOwnProperty("forEach")) {
    Array.prototype.forEach = function (fn, thisp) {
        ///<summary>
        ///Invokes a function on each item.
        ///</summary>
        ///<param name="fn" type="Function">
        ///The function to be run on every item.
        ///function(item, index, thisArray){/*...*/}
        ///</param>
        ///<param name="thisp" type="Object">
        ///Declaring the "this" object inside the scope of the function.
        ///</param>
        ///<returns type="undefined" />
        var i;
        var length = this.length;

        for (i = 0; i < length; i += 1) {
            if (this.hasOwnProperty(i)) {
                fn.call(thisp, this[i], i, this);
            }
        }
    };
}