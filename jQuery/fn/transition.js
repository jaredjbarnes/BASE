BASE.require([
    "jQuery",
    "jQuery.fn.redraw",
    "jQuery.support.transition",
    "jQuery.fn.isAnimating",
    "BASE.async.delay"
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

    };

    jQuery.fn.transition = function (properties) {

        var $elem = $(this[0]);

        var isAnimating = $elem.isAnimating();

        var transitionPluginData = $elem.data("transitionPlugin");

        if (transitionPluginData && transitionPluginData.currentAnimationFuture) {
            transitionPluginData.currentAnimationFuture.cancel();
        }

        transitionPluginData = {
            currentAnimationFuture: new BASE.async.Future(),
            currentTransitionProperty: $elem.css("transition-property"),
            currentTransitionDuration: $elem.css("transition-duration"),
            currentTransitionTimingFunction: $elem.css("transition-timing-function"),
        };

        $elem.data("transitionPlugin", transitionPluginData);

        transitionPluginData.currentAnimationFuture = new Future(function (setValue, setError) {
            var allProperties = Object.keys(properties);
            var durations = [];
            var timingFunctions = [];
            var toCss = {};
            var longestDuration = 0;

            allProperties.forEach(function (key) {
                var duration = properties[key].duration;

                if (typeof duration !== "number") {
                    properties[key].duration = duration = 1000;
                }

                if (duration > longestDuration) {
                    longestDuration = duration;
                }
            });

            if (!isAnimating) {
                $elem.css({
                    transition: ""
                });
            }
            // This makes transition current.
            $elem.redraw();

            allProperties.forEach(function (key) {
                var property = properties[key];

                if (typeof property.from !== "undefined") {
                    $elem.css(key, property.from);
                }

                durations.push(property.duration + "ms");

                if (typeof property.easing === "string" && easings[property.easing]) {
                    timingFunctions.push(easings[property.easing]);
                } else {
                    timingFunctions.push("linear");
                }

                if (typeof property.to !== "undefined") {
                    toCss[key] = property.to;
                }

            });

            var currentTransitionProperty = allProperties.join(", ");
            var currentTransitionDuration = durations.join(", ");
            var currentTransitionTimingFunction = timingFunctions.join(", ");

            $elem.redraw();

            toCss["transition-property"] = currentTransitionProperty;
            toCss["transition-duration"] = currentTransitionDuration;
            toCss["transition-timing-function"] = currentTransitionTimingFunction;

            // For hardware accelerating on iOS.
            if (typeof properties["transform"] === 'undefined' && $elem.css('transform') === 'none') {
                toCss["transform"] = "translate3d(0, 0, 0)";
            }
            if ($elem.css("perspective") === 'none') {
                toCss["perspective"] = "1000";
            }
            toCss["backface-visibility"] = "hidden";

            $elem.css(toCss);
            $elem.redraw();

            if (!$.support.transition) {

                setValue();

            } else {
                $elem.attr('animating', '');

                BASE.async.delay(longestDuration).then(function () {

                    $elem.removeAttr("animating");
                    setValue();

                }).ifError(setError);
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