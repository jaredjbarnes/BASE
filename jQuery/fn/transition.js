BASE.require([
    "jQuery",
    "jQuery.fn.redraw",
    "jQuery.support.transition",
    "jQuery.fn.isAnimating",
    "BASE.async.delay"
], function () {

    var docStyle = document.documentElement.style;
    global = window;

    var engine;
    if (global.opera && Object.prototype.toString.call(opera) === '[object Opera]') {
        engine = 'presto';
    } else if ('MozAppearance' in docStyle) {
        engine = 'gecko';
    } else if ('WebkitAppearance' in docStyle) {
        engine = 'webkit';
    } else if (typeof navigator.cpuClass === 'string') {
        engine = 'trident';
    }

    var vendorPrefix = {
        trident: '-ms-',
        gecko: '-moz-',
        webkit: '-webkit-',
        presto: '-o-'
    }[engine];

    var vendorCss = {
        transform: vendorPrefix + "transform",
        translate: vendorPrefix + "translate"
    };

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

    var getCurrentCss = function (elem) {
        var css = {};
        var styles = elem.style.cssText.split(";");
        styles.forEach(function (style) {
            var keyValue = style.split(":");
            css[keyValue[0]] = keyValue[1];
        });

        return css;
    };

    var toCssText = function (css) {
        return Object.keys(css).map(function (style) {
            return style + ":" + css[style];
        }).join(";");
    };

    jQuery.fn.transition = function (properties) {
        var elem = this[0];
        var $elem = $(this[0]);
        var toCss = {};

        var reset = function () {
            toCss[vendorPrefix + "transition-property"] = "";
            toCss[vendorPrefix + "transition-duration"] = "";
            toCss[vendorPrefix + "transition-timing-function"] = "";
        };

        var animationFuture = new Future(function (setValue, setError) {
            var propertyNames = Object.keys(properties);
            var durations = [];
            var timingFunctions = [];
            var longestDuration = 0;

            if (!$.support.transition) {
                propertyNames.forEach(function (name) {
                    property = properties[name];
                    if (typeof property.to !== "undefined") {
                        toCss[name] = property.to;
                    }
                });

                elem.style.cssText = toCssText(toCss);
                setValue();

            } else {

                propertyNames.forEach(function (key) {
                    var duration = properties[key].duration;

                    if (typeof duration !== "number") {
                        properties[key].duration = duration = 1000;
                    }

                    if (duration > longestDuration) {
                        longestDuration = duration;
                    }
                });

                propertyNames.forEach(function (key) {
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
                        toCss[vendorCss[key] || key] = property.to;
                    }

                });

                var currentTransitionProperty = propertyNames.join(", ");
                var currentTransitionDuration = durations.join(", ");
                var currentTransitionTimingFunction = timingFunctions.join(", ");

                toCss[vendorPrefix + "transition-property"] = currentTransitionProperty;
                toCss[vendorPrefix + "transition-duration"] = currentTransitionDuration;
                toCss[vendorPrefix + "transition-timing-function"] = currentTransitionTimingFunction;

                // For hardware accelerating on iOS.
                if (typeof properties["transform"] === 'undefined') {
                    toCss[vendorPrefix + "transform"] = "translate3d(0, 0, 0)";
                }
                if (typeof properties["perspective"] === "undefined") {
                    toCss[vendorPrefix + "perspective"] = "1000";
                }

                toCss[vendorPrefix + "backface-visibility"] = "hidden";

                elem.style.cssText = toCssText(toCss);

                BASE.async.delay(longestDuration).then(function () {
                    setValue();
                }).ifError(setError);
            }

        });

        return animationFuture.then(function () {
            reset();
        }).ifCanceled(function () {
            reset();
        }).ifError(function () {
            reset();
        }).ifTimedOut(function () {
            reset();
        });

    };


});