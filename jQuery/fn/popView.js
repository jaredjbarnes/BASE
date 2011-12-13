BASE.require(["jQuery", "jQuery.fn.region"], function () {
    jQuery.fn.popView = function (options, callback) {

        callback = typeof options === 'function' ? options : callback || function () { };
        options = typeof options === 'object' ? options : {};

        return this.each(function () {
            var elem = this;
            var $this = $(this);
            $this.css({ position: 'relative' });
            var array = $this.data("viewArray");
            if (!array) {
                array = [];
                $this.data("viewArray", array);
            }

            var oldElem = array.pop();
            var newElem = array[array.length - 1];

            var finalize = function () {
                if (oldElem) {
                    oldElem.remove();
                }

                if (newElem) {
                    newElem.css({ display: "block", position: "absolute" });

                    var onDeactivate = new $.Event("deactivate");
                    onDeactivate.data = options.data || {};
                    newElem.trigger(onDeactivate);

                }
                callback.apply(newElem || null, [options.data || {}]);

            };

            if (options.animate && oldElem) {
                var region = $this.region();

                oldElem.animate({ left: region.width + 'px' }, 300, "easeInQuad", function () { 
                    finalize();
                });
                if (newElem) {
                    newElem.css({
                        left: (-region.width) + "px",
                        display: "block"
                    }).animate({ left: '0px' }, 300, "easeInQuad");
                } 
            } else {
                if (newElem) newElem.css({ top: "0px", left: "0px", display: "block" });
                finalize();
            }

        });
    };
});
