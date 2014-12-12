Array.convertToArray = function (arrayLike) {
    var array = [];

    for (var x = 0 ; x < arrayLike.length; x++) {
        array.push(arrayLike[x]);
    }

    return array;

};