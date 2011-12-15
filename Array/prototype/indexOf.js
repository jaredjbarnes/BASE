if (!Array.prototype.hasOwnProperty("indexOf")) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        ///<summary>
        ///Searches this array for an object, and returns the index of the first occurrence in the array. Returns -1 if no matches were made.
        ///</summary>
        ///<param name="searchElement" type="Object">
        ///The item to be found in this array.
        ///</param>
        ///<param name="fromIndex" type="Number">
        ///(Optional) - The index to start from inside the array.
        ///</param>
        ///<returns type="Number" />
        var i = fromIndex || 0;
        var length = this.length;

        while (i < length) {
            if (this.hasOwnProperty(i) && this[i] === searchElement) {
                return i;
            }
            i += 1;
        }
        return -1;
    };
}