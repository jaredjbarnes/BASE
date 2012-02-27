BASE.require(["jQuery", "jQuery.loadFile", "jQuery.fn.popView", "jQuery.fn.region"], function () {
    jQuery.fn.pushView = function (viewUrl, options, callback) {

        callback = typeof options === 'function' ? options : callback || function () { };
        options = typeof options === 'object' ? options : {};

        var beforeDisplay = options.beforeDisplay || function () { };
        var easing = options.easing;
        return this.each(function () {
            var elem = this;
            var $this = $(this);
            $this.css({ position: 'relative' });

            var array = $this.data("viewArray");
            if (!array) {
                array = [];
                $this.data("viewArray", array);
            }

            jQuery.loadFile(viewUrl, { fromCache: true }, function (err, html) {
                if (!err) {
                    var newElem;
                    var oldElem;

                    var finalize = function () {
                        array.push(newElem);
                        callback.apply(newElem, [options.data || {}]);
                    };

                    if (options.easing) {
                        var region = $this.region();

                        oldElem = array[array.length - 1];
                        if (!oldElem) {
                            oldElem = $this.children().first();
                        }

                        newElem = $(html).css({ display: "block", position: "absolute", top: "0px", left: (-region.width) + "px" }).appendTo(elem);
                        var $scripts = newElem.find("script[type='text/module']");

                        $scripts.each(function () {
                            var $script = $(this);
                            var text = $script.html();
                            var script = new Function(text);

                            script.apply(newElem[0], options.args || []);
                        });

                        beforeDisplay.apply(newElem, []);

                        newElem.css({
                            left: region.width
                        }).animate({ left: 0 }, 300, easing, function () {
                            finalize();
                        });

                        if (oldElem) {
                            oldElem.animate({ left: -region.width }, 300, easing, function () {
                                oldElem.css({ display: "none" });
                            });
                        }

                    } else {
                        $this.children().css({ display: "none" });

                        newElem = $(html).css({ display: "block", position: "absolute", top: "0px", left: "0px" });
                        var $scripts = newElem.find("script[type='text/module']");

                        $scripts.each(function () {
                            var $script = $(this);
                            var text = $script.html();
                            script = new Function(text);

                            script.apply(newElem[0], options.args || []);
                        });

                        beforeDisplay.apply(newElem, []);

                        newElem.appendTo(elem);

                        finalize();
                    }

                }
            });
        });
    };
});
