BASE.require(["jQuery", "jQuery.loadFile", "jQuery.fn.popView", "jQuery.fn.region"], function () {
    jQuery.fn.pushView = function (viewUrl, options, callback) {
        switch (arguments.length) {
            case 2:
                callback = options;
                options = {};
                break;
            case 1:
                options = {};
                callback = function () { };
                break;
            case 0:
                options = {};
                callback = function () { };
                break;
        }

        if (typeof callback !== "function") {
            callback = function () { };
        }

        var beforeDisplay = options.beforeDisplay || function () { };

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

                    if (options.animate) {
                        var region = $this.region();

                        oldElem = array[array.length - 1];
                        if (!oldElem) {
                            oldElem = $this.children().first();
                        }

                        newElem = $(html).css({ display: "block", position: "absolute", top: "0px", left: (-region.width) + "px" }).appendTo(elem);

                        beforeDisplay.apply(newElem, []);

                        newElem.css({
                            left: region.width
                        }).animate({ left: 0 }, 300, "easeInQuad", function () {
                            afterDisplay.apply(newElem, []);
                        });

                        if (oldElem) {
                            oldElem.animate({ left: -region.width }, 300, "easeInQuad", function () {
                                oldElem.css({ display: "none" });
                            });
                        }

                        finalize();
                    } else {
                        $this.children().css({ display: "none" });

                        newElem = $(html).css({ display: "block", position: "absolute", top: "0px", left: "0px" });
                        beforeDisplay.apply(newElem, []);

                        newElem.appendTo(elem);

                        afterDisplay.apply(newElem, []);
                        finalize();
                    }

                }
            });
        });
    };
});
