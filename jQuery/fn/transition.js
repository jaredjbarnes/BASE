BASE.require([
    "jQuery",
    "jQuery.fn.redraw",
    "jQuery.support.transition"
], function () {

    var easings = {
        bounce: "cubic-bezier(0.0, 0.35, .5, 1.3)",
        linear: "linear",
        swing: "ease-in-out",
        easeInQuad: "cubic-bezier(0.550, 0.085, 0.680, 0.530)",
        easeInCubic: "cubic-bezier(0.550, 0.055, 0.675, 0.190)",
        easeInQuart: "cubic-bezier(0.895, 0.030, 0.685, 0.220)",
        easeInQuint: "cubic-bezier(0.755, 0.050, 0.855, 0.060)",
        easeInSine: "cubic-bezier(0.470, 0.000, 0.745, 0.715)",
        easeInExpo: "cubic-bezier(0.950, 0.050, 0.795, 0.035)",
        easeInCirc: "cubic-bezier(0.600, 0.040, 0.980, 0.335)",
        easeInBack: "cubic-bezier(0.600, -0.280, 0.735, 0.045)",
        easeOutQuad: "cubic-bezier(0.250, 0.460, 0.450, 0.940)",
        easeOutCubic: "cubic-bezier(0.215, 0.610, 0.355, 1.000)",
        easeOutQuart: "cubic-bezier(0.165, 0.840, 0.440, 1.000)",
        easeOutQuint: "cubic-bezier(0.230, 1.000, 0.320, 1.000)",
        easeOutSine: "cubic-bezier(0.390, 0.575, 0.565, 1.000)",
        easeOutExpo: "cubic-bezier(0.190, 1.000, 0.220, 1.000)",
        easeOutCirc: "cubic-bezier(0.075, 0.820, 0.165, 1.000)",
        easeOutBack: "cubic-bezier(0.175, 0.885, 0.320, 1.275)",
        easeInOutQuad: "cubic-bezier(0.455, 0.030, 0.515, 0.955)",
        easeInOutCubic: "cubic-bezier(0.645, 0.045, 0.355, 1.000)",
        easeInOutQuart: "cubic-bezier(0.770, 0.000, 0.175, 1.000)",
        easeInOutQuint: "cubic-bezier(0.860, 0.000, 0.070, 1.000)",
        easeInOutSine: "cubic-bezier(0.445, 0.050, 0.550, 0.950)",
        easeInOutExpo: "cubic-bezier(1.000, 0.000, 0.000, 1.000)",
        easeInOutCirc: "cubic-bezier(0.785, 0.135, 0.150, 0.860)",
        easeInOutBack: "cubic-bezier(0.680, -0.550, 0.265, 1.550)"
    };

    var Future = BASE.async.Future;

    var reset = function ($elem) {
        $elem.redraw();

        var transitionPluginData = $elem.data("transitionPlugin");

        $elem.css({
            "transition-property": transitionPluginData.currentTransitionProperty,
            "transition-duration": transitionPluginData.currentTransitionDuration,
            "transition-timing-function": transitionPluginData.currentTransitionTimingFunction
        });

        $elem.off("webkitTransitionEnd transitionEnd", transitionPluginData.currentTransitionEnd);
    };

    jQuery.fn.transition = function (properties) {

        var $elem = $(this[0]);

        var transitionPluginData = $elem.data("transitionPlugin");

        if (typeof transitionPluginData !== "object") {

            transitionPluginData = {
                currentAnimationFuture: new BASE.async.Future(),
                currentTransitionProperty: "",
                currentTransitionDuration: 0,
                currentTransitionTimingFunction: "",
                currentTransitionEnd: function () { }
            };

            $elem.data("transitionPlugin", transitionPluginData);
        }

        transitionPluginData.currentAnimationFuture.cancel();
        transitionPluginData.currentTransitionProperty = $elem.css("transition-property");
        transitionPluginData.currentTransitionDuration = $elem.css("transition-duration");
        transitionPluginData.currentTransitionTimingFunction = $elem.css("transition-timing-function");

        transitionPluginData.currentAnimationFuture = new Future(function (setValue, setError) {
            var allProperties = Object.keys(properties);
            var durations = [];
            var timingFunctions = [];
            var toCss = {};
            var completedCount = 0;

            $elem.redraw();

            allProperties.forEach(function (key) {
                var property = properties[key];

                if (typeof property.from !== "undefined") {
                    $elem.css(key, property.from);
                }

                if (typeof property.duration === "number") {
                    durations.push(property.duration + "ms");
                } else {
                    durations.push("1000ms");
                }

                if (typeof property.easing === "string" && easings[property.easing]) {
                    timingFunctions.push(easings[property.easing]);
                } else {
                    timingFunctions.push("linear");
                }

                if (typeof property.to !== "undefined") {
                    toCss[key] = property.to;
                }

            });

            transitionPluginData.currentTransitionProperty = allProperties.join(", ");
            transitionPluginData.currentTransitionDuration = durations.join(", ");
            transitionPluginData.currentTransitionTimingFunction = timingFunctions.join(", ");

            $elem.redraw();

            toCss["transition-property"] = transitionPluginData.currentTransitionProperty;
            toCss["transition-duration"] = transitionPluginData.currentTransitionDuration;
            toCss["transition-timing-function"] = transitionPluginData.currentTransitionTimingFunction;

            // For hardware accelerating on iOS.
            toCss["-webkit-transform"] = "translate3d(0, 0, 0)";
            toCss["-webkit-backface-visibility"] = "hidden";
            toCss["-webkit-perspective"] = "1000";

            transitionPluginData.currentTransitionEnd = function () {
                completedCount++;
                if (completedCount >= allProperties.length) {
                    setValue();
                }
            };

            $elem.on("webkitTransitionEnd transitionEnd", transitionPluginData.currentTransitionEnd);

            $elem.css(toCss);

            if (!$.support.transition) {
                setValue();
            }

        });

        return transitionPluginData.currentAnimationFuture.then(function () {
            reset($elem);
        }).ifCanceled(function () {
            reset($elem);
        }).ifError(function () {
            reset($elem);
        }).ifTimedOut(function () {
            reset($elem);
        });

    };

});