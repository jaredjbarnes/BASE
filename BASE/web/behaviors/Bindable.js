BASE.require([
    "jQuery",
    "BASE.util.PropertyBehavior"
], function () {
    BASE.namespace("BASE.web.behaviors");
    BASE.web.behaviors.Bindable = function (elem) {
        var self = this;
        var $elem = $(elem);
        var model;
        var modelObserver;
        var targets = {};
        var outboundObservers = {};
        BASE.assertNotGlobal(self);

        var binder = {};
        $elem.data("bindable", binder);

        binder.setModel = function (m) {
            // tear down observing on existing model, if there is one
            if (modelObserver) {
                modelObserver.dispose();
            }

            model = m;
            var amObservable = m._implementsPropertyBehavior || false;
            if (!amObservable) {
                BASE.util.PropertyBehavior.apply(model);
            }
            modelObserver = m.observeAllProperties(modelChangeHandler);

            // set initial model values to target
            for (propertyName in targets) {
                var pascalCased = propertyName.substr(0, 1).toUpperCase() + propertyName.substr(1);
                var propertyGetter = model["get" + pascalCased];
                if (propertyGetter) {
                    targets[propertyName].forEach(function (node) {
                        setTargetValue(node, propertyGetter());
                    });
                }

            }
            
        };

        var modelChangeHandler = function (e) {
            var targetArray = targets[e.type];
            if (targetArray) {
                targetArray.forEach(function (targetElement) {
                    setTargetValue(targetElement, e.newValue);
                });
            }
        };

        var setTargetValue = function (target, value) {
            if (target.hasOwnProperty("value")) {
                target.value = value;
            } else {
                $(target).text(value);
            }
        };

        var pushTarget = function (propertyName, target) {
            var targetArr = targets[propertyName];
            if (!targetArr) {
                targetArr = targets[propertyName] = [];
            }
            targetArr.push(target);
        };

        var gatherTargets = function (root) {
            $(root).find('[bind]').each(function () {
                var node = this;
                var propertyName = $(node).attr("bind");
                pushTarget(propertyName, node);
                var pascalCased = propertyName.substr(0, 1).toUpperCase() + propertyName.substr(1);

                // Observe to anything that fires a change
                $(node).on("change", function (e) {
                    
                    var propertySetter = model["set" + pascalCased];
                    if (propertySetter) {
                        propertySetter($(node).val());
                    }
                });
                
            });
        };

        gatherTargets(elem);

    };
});