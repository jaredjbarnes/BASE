/// <reference path="/scripts/leavitt/Person.js" />

BASE.require(["leavitt.Person"], function () {
    Object.namespace("leavitt");
    leavitt.Employee = function () {
        leavitt.Person.apply(this, arguments);
    };
    leavitt.Employee.prototype = new leavitt.Person();
});