if (!Date.hasOwnProperty("now")){
    Date.now = function () {
        return (new Date()).getTime();
    };
}