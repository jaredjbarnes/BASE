BASE.require(["jQuery"], function () {

    jQuery.executeDataScript = function (root) {
        var scriptArray = [];
        var $elemArray = [];

        var exec = function ($this) {
            var script = $this.attr("data-script");
            if (script) {
                scriptArray.push(script);
                $elemArray.push($this);
            }
        };

        var walk = function ($root) {
            var $children = $root.children();
            var $child;
            for (var x = 0 ; x < $children.length; x++) {
                $child = $children.slice(x, x + 1);
                walk($child);
            }
            exec($root);
        };

        walk($(root || document.body));
        BASE.require(scriptArray, function () {
            var Klass;
            var $this;
            var script;
            var i;

            while (scriptArray.length > 0) {
                script = scriptArray.pop();
                $this = $elemArray.pop();

                Klass = BASE.getObject(script);

                if (typeof Klass === "function") {
                    i = scriptArray.length;
                    $this[0].controller = new Klass($this[0]);
                    var event = new $.Event("controlReady");
                    $this.trigger(event);
                } else {
                    throw new Error("\"" + script + "\" needs to be a class.");
                }
            }
        });
    };

    jQuery(function () {
        jQuery.executeDataScript();
    });

});