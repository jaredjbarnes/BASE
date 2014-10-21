BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel.testing");

    var _globalObject = this;

    LG.core.dataModel.testing.Pesticide = (function (Super) {
        var Pesticide = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("Pesticide constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
            self['name'] = null;
            self['fruits'] = [];
            self['id'] = null;
                                                  

            return self;
        };

        BASE.extend(Pesticide, Super);

        return Pesticide;
    }(Object));
});