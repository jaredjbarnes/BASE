/// <reference path="/scripts/jQuery.js" />
/// <reference path="/scripts/BASE/enableObserving.js" />
/// <reference path="/scripts/WEB/MouseManager.js" />

BASE.require(["jQuery","WEB.MouseManager","BASE.enableObserving"], function () {
        $.mouseManager = new WEB.MouseManager();
        BASE.enableObserving($.mouseManager);
});