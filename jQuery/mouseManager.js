/// <reference path="/scripts/jQuery.js" />
/// <reference path="/scripts/BASE/enableObserving.js" />
/// <reference path="/scripts/BASE/MouseManager.js" />

BASE.require(["jQuery","BASE.MouseManager","BASE.enableObserving"], function () {
        $.mouseManager = new BASE.MouseManager();
        BASE.enableObserving($.mouseManager);
});