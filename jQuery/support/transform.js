BASE.require(["jQuery"], function () {
    BASE.namespace("jQuery.support");

    $.support.transform = (function(){ 
        var thisBody = document.body || document.documentElement,
        thisStyle = thisBody.style,
        support = thisStyle.transform !== undefined || thisStyle.WebkitTransform !== undefined;
        return support; 
    })();
});
