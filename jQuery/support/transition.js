BASE.require(["jQuery"], function () {
    BASE.namespace("jQuery.support");

    $.support.transition = (function(){ 
        var thisBody = document.body || document.documentElement,
        thisStyle = thisBody.style,
        support = thisStyle.transition !== undefined || thisStyle.WebkitTransition !== undefined;
        return support; 
    })();
});
