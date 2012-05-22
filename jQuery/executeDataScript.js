BASE.require(["jQuery"], function () {

    jQuery.executeDataScript = function (root) {
        $("[data-script]", root || document).each(function () {
            var $this = $(this);
            var script = $this.attr("data-script");
            if (!$this.data("data-script")) {
                BASE.require([script], function () {
                    var Klass = BASE.getObject(script);

                    if (typeof Klass === "function") {
                        $this[0].controller = new Klass($this[0]);
                        var event = new $.Event("controlReady");
                        $this.trigger(event);
                    } else {
                        throw new Error("\"" + script + "\" needs to be a class.");
                    }
                });
            }
        });
    };

    jQuery(function () {
        jQuery.executeDataScript();
    });

});