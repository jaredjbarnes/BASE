/// <reference path="/scripts/BASE.js" />
/// <reference path="/scripts/jQuery.js" />
/// <reference path="/scripts/WEB/ui/ViewController.js" />

BASE.require(["WEB.ui.ViewController"], function () {

    BASE.namespace("WEB.ui.ViewControllers");

    WEB.ui.ViewControllers.TableViewController = function () {
        var self = this;

        //Calling the super class
        WEB.ui.ViewController.apply(self, arguments);

        self.viewDidLoad = function (oldValue, newValue) {
            $(oldValue).remove();
            $(newValue).appendTo(document.body);

            var $this = $(newValue);
            $this.css({
                "background-color": "#ff0000",
                "width": "100px",
                "height": "100px"
            });

            $this.bind("click", function (e) {
                console.log("Hey you clicked me.");
            });
        };

    };

    WEB.ui.ViewControllers.TableViewController.prototype = new WEB.ui.ViewController();

});