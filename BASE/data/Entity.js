BASE.require(["BASE.Observable"], function () {
    BASE.namespace("BASE.data");
    BASE.data.Entity = (function (Super) {
        function Entity() {
            var self = this;

            if (!(self instanceof arguments.callee)) {
                return new Entity();
            }

            Super.call(self);

            var _id = null;
            var _tracker = null;

            var __dataContext = null;

            Object.defineProperties(self, {
                "__dataContext": {
                    get: function () {
                        return __dataContext;
                    },
                    set: function (value) {
                        if (__dataContext === null) {
                            __dataContext = value;
                        }
                    }
                },
                "id": {
                    get: function () {
                        return _id;
                    },
                    set: function (value) {
                        var oldValue = _id;
                        if (oldValue !== value) {
                            _id = value;
                            this.notify(new PropertyChangedEvent("id", oldValue, value));
                        }
                    },
                    enumerable: true,
                    configurable: true
                }
            });

            self.load = function (options) {
                options = options || {};
                options.success = options.success || function () { };
                options.error = options.error || function () { };

                if (!self.id) {
                    options.success();
                    return;
                }
                if (self.__dataContext) {
                    self.__dataContext.loadEntities({
                        Type: self.constructor,
                        filter: function (entity) {
                            this.where(entity.id.equals(this.toGuid(self.id)));
                        },
                        success: options.success,
                        error: options.error
                    });
                } else {
                    console.log(this);
                    throw new Error("Entity isn't part of a context.");
                }
            };

        }

        BASE.extend(Entity, BASE.Observable);

        return Entity;
    }(BASE.Observable));
});

