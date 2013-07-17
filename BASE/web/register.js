BASE.namespace("BASE.web");

BASE.web.register = function (element, dependencies, prototype) {

    var instances = [];
    var activities = [];

    var FunctionActivity = function (instance, property, arguments) {
        var self = this;

        self.execute = function () {
            instance[property].apply(instance, arguments);
        };
    };

    var SetValueActivity = function (instance, property, value) {
        var self = this;

        values[property] = value;
        self.execute = function () {
            instance[property] = value;
        };
    };

    var unloadedState = {};
    var proxyPrototype = {};
    var state = unloadedState;

    var build = function (instance) {
        if (!instance.register__values) {
            instance.register__values = {};
        }
    };

    // Build the proxyPrototype and the unloaded state object.
    Object.keys(prototype).forEach(function (key) {
        var value = prototype[key];

        if (typeof value === "function") {

            proxyPrototype[key] = function () {
                state[key].apply(this, arguments);
            };

            unloadedState[key] = function () {
                var functionActivity = new FunctionActivity(this, key, arguments);
                activities.push(functionActivity);
            };

        } else {

            Object.defineProperty(proxyPrototype, key, {
                get: function () {
                    return state[key];
                },
                set: function (value) {
                    state[key] = value;
                }
            });

            Object.defineProperty(unloadedState, key, {
                get: function () {
                    build(this);
                    return this.register__values[key] || prototype[property];
                },
                set: function (value) {
                    build(this);
                    var valueActivity = new SetValueActivity(this, key, value);

                    activities.push(valueActivity);
                    this.register__values[key] = value;
                }
            });
        }

    });

    element.register({ prototype: proxyPrototype });

    BASE.require(dependencies, function () {
        state = prototype;

        activities.forEach(function (activity) {
            activity.execute();
        });

        // Clean house.
        instances = null;
        activities = null;
        proxyPrototype = null;
    });
};

