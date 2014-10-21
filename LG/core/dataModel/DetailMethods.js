BASE.require(["Object"], function () {
    BASE.namespace("LG.core.dataModel");

    var _globalObject = this;

    LG.core.dataModel.DetailMethods = (function (Super) {
        var DetailMethods = function () {
            var self = this;
            if (self === _globalObject) {
                throw new Error("DetailMethods constructor invoked with global context.  Say new.");
            }

            Super.call(self);
            
                                                  

            return self;
        };

        BASE.extend(DetailMethods, Super);

        return DetailMethods;
    }(Object));
});